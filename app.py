from typing import Final

from beaker import *
from pyteal import *


class CopyrightState:
    user_client: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.bytes,
        default=Bytes(""),
        descr="Address of the client receiving",
    )

    num_shirts: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(0),
        descr="Number of shirts client wishes to use copright material on",
    )

    num_shorts: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(0),
        descr="Number of shorts client wishes to use copright material on",
    )

    num_sweatshirts: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(0),
        descr="Number of sweatshirts client wishes to use copright material on",
    )

    asa: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(0),
        descr="ID of the asset being minted for authorization",
    )

    copyright_holder: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.bytes,
        default=Bytes("RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY"),
        descr="Address of the organization whose copyright material is being used",
    )

    nanzoo: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.bytes,
        default=Bytes("6UD3DFKUNAB4CQ45D46IMKFJM3KZONNCC6HAHC6SEUIBHG6NBN5UKZQP6I"),
        descr="Creator fee",
    )

    cp_fee: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(10000),
        descr="Initial License fee",
    )

    nanzoo_fee: Final[GlobalStateValue] = GlobalStateValue(
        stack_type=TealType.uint64,
        default=Int(1000),
        descr="creator fee",
    )


app = Application("CopyrightAgree", state=CopyrightState)


@app.create(bare=True)
def create() -> Expr:
    return app.initialize_global_state()


@Subroutine(TealType.none)
def pay(receiver: Expr, amount: Expr) -> Expr:
    return InnerTxnBuilder.Execute(
        {
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: receiver,
            TxnField.amount: amount,
            TxnField.fee: Int(0),  # cover fee with outer txn
        }
    )


@app.external(authorize=Authorize.only(Global.creator_address()))
def claim_license(payment: abi.PaymentTransaction) -> Expr:
    return Seq(
        Assert(Txn.sender() == payment.get().sender()),
        # pay(app.state.copyright_holder.get(), app.state.cp_fee.get()),
        # pay(app.state.nanzoo.get(), app.state.nanzoo_fee.get()),
    )


@app.external
def claim_shirts(payment: abi.PaymentTransaction) -> Expr:
    return Seq(
        # app.state.num_shirts.set(numshirt),
        Assert(Txn.sender() == payment.get().sender()),
        # pay(app.state.copyright_holder.get(), numshirtprice),
        # pay(app.state.nanzoo.get(), app.state.num_shirts.get() * 0.1),
    )


@app.external
def claim_shorts(payment: abi.PaymentTransaction) -> Expr:
    return Seq(
        Assert(Txn.sender() == payment.get().sender()),
        # pay(app.state.copyright_holder.get(), numshortprice),
        # pay(app.state.nanzoo.get(), app.state.num_shorts.get() * 0.2),
    )


@app.external
def claim_sweatshirts(payment: abi.PaymentTransaction) -> Expr:
    return Seq(
        Assert(Txn.sender() == payment.get().sender()),
        # pay(app.state.copyright_holder.get(), numsweatshirtprice),
        # pay(app.state.nanzoo.get(), app.state.num_shirts.get() * 0.3),
    )


if __name__ == "__main__":
    app.build().export()
