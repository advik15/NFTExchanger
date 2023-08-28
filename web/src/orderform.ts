import algosdk, { AtomicTransactionComposer } from 'algosdk'
import { PeraSession } from './wallets/pera'
import { getDatabase, ref as dbRef, set,get } from 'firebase/database';

import { initializeApp } from 'firebase/app';

const pera = new PeraSession()
const accountsMenu = document.getElementById('accountsUse') as HTMLSelectElement
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '')
var submit = document.getElementById('submit') as HTMLInputElement;
var connect = document.getElementById('connect') as HTMLInputElement;
var assetid = document.getElementById('assetId') as HTMLTextAreaElement;
var checkasset = document.getElementById('checkAsset') as HTMLInputElement;
const shirt_label = document.getElementById('shirt_label') as HTMLInputElement;
const short_label = document.getElementById('short') as HTMLInputElement;
const sweatshirts_label = document.getElementById('sweatshirts_label') as HTMLInputElement;

const shirtsInput = document.getElementById('shirts') as HTMLInputElement
const shortsInput = document.getElementById('shorts') as HTMLInputElement
const sweatshirtsInput = document.getElementById('sweatshirts') as HTMLInputElement
const account_mnemonic = "patch caught ignore dilemma deny please tent soccer powder tube enrich yellow will benefit head tobacco bachelor web fox half magic cannon fiscal abandon bomb";
const recoveredAccount = algosdk.mnemonicToSecretKey(account_mnemonic);
async function signer(txns: algosdk.Transaction[]) {
  return await pera.signTxns(txns)
}
const firebaseConfig = {
  apiKey: "AIzaSyDMEGBFsul2qxumXo0G4R1XdQjtX4dMrf8",
  authDomain: "copyrightprototype.firebaseapp.com",
  projectId: "copyrightprototype",
  storageBucket: "copyrightprototype.appspot.com",
  messagingSenderId: "517747606301",
  appId: "1:517747606301:web:d20424b36a961972f817f4",
  measurementId: "G-S9N43X8PM9"
};

const app = initializeApp(firebaseConfig);

function checkAccount(inputAccount: string, inputAssetIndex: number) {
  const db = getDatabase();

  const accountRef = dbRef(db, 'accounts/' + inputAccount);
  console.log(inputAccount)
  console.log(inputAssetIndex)
  // Get the account data from the database
  get(accountRef).then(snapshot => {
    const assetIndexes = snapshot.val()?.assetIndexes || [];

    // Check if the assetIndexes array contains the inputAssetIndex
    if (assetIndexes.includes(inputAssetIndex)) {
      console.log('Match found!');

      shirtsInput.classList.remove("hidden");
      shortsInput.classList.remove("hidden");
      sweatshirtsInput.classList.remove("hidden");
      shirt_label.classList.remove("hidden");
      short_label.classList.remove("hidden");
      sweatshirts_label.classList.remove("hidden");

    } else {
      console.log('No match found.');
    }
  }).catch(error => {
    console.error("Error retrieving account: ", error);
  });
}
connect.onclick = async () => {
  await pera.getAccounts()
  pera.accounts.forEach(account => {
    accountsMenu.add(new Option(account, account))
  })
  var accountCheck = document.getElementById('accountCheck') as HTMLInputElement;
  accountCheck.classList.remove("hidden");
  accountsMenu.classList.remove("hidden");
  assetid.classList.remove("hidden");
  checkasset.classList.remove("hidden");
}
checkasset.onclick = async () => {

  console.log(`${accountsMenu.selectedOptions[0].value}` )
  const sender = {
    addr: accountsMenu.selectedOptions[0].value,
    signer
  }
  console.log("hi" )

  const assetID = parseInt(assetid.value);
  console.log(`this is the assetID ${assetID}` )
  checkAccount(sender.addr, assetID);

}

submit.onclick = async () => {

  const sender = {
    addr: accountsMenu.selectedOptions[0].value,
    signer
  }
  const suggestedParams = await algodClient.getTransactionParams().do()

  const numShirtPriceOrg = shirtsInput.valueAsNumber * 1000
  const numShortPriceOrg = shortsInput.valueAsNumber * 2000
  const numSweatshirtPriceOrg = sweatshirtsInput.valueAsNumber * 3000
  const numShirtPriceMe = shirtsInput.valueAsNumber * 100
  const numShortPriceMe = shortsInput.valueAsNumber * 200
  const numSweatshirtPriceMe = sweatshirtsInput.valueAsNumber * 300

  const atc = new algosdk.AtomicTransactionComposer()

  const paymentShirtOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numShirtPriceOrg,
    from: sender.addr,
    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
  })
  atc.addTransaction({ txn: paymentShirtOrg, signer })

  const paymentShirtMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numShirtPriceMe,
    from: sender.addr,
    to: recoveredAccount.addr
  })
  atc.addTransaction({ txn: paymentShirtMe, signer })

  const paymentShortOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numShortPriceOrg,
    from: sender.addr,
    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
  })
  atc.addTransaction({ txn: paymentShortOrg, signer })

  const paymentShortMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numShortPriceMe,
    from: sender.addr,
    to: recoveredAccount.addr
  })
  atc.addTransaction({ txn: paymentShortMe, signer })

  const paymentSweatshirtOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numSweatshirtPriceOrg,
    from: sender.addr,
    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
  })
  atc.addTransaction({ txn: paymentSweatshirtOrg, signer })

  const paymentSweatshirtMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: numSweatshirtPriceMe,
    from: sender.addr,
    to: recoveredAccount.addr
  })
  atc.addTransaction({ txn: paymentSweatshirtMe, signer })

  await atc.execute(algodClient, 3)
}
