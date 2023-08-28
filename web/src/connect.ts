import algosdk, { AtomicTransactionComposer } from 'algosdk'
import { PeraSession } from './wallets/pera'
import Utils from './utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import appspec from '../application.json'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, set } from 'firebase/database';
import { get } from 'firebase/database';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { sign } from 'crypto'


//connect our wallet and populate wallet array
const pera = new PeraSession()
//Figure out what to do with this when it comes time to deploy to mainnets
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '')
const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '')

//Instantiate contract object
const contract = new algosdk.ABIContract(appspec.contract)

let cpID: number
let cpApp: algokit.ApplicationClient

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
const database = getDatabase(app);


const account_mnemonic = "patch caught ignore dilemma deny please tent soccer powder tube enrich yellow will benefit head tobacco bachelor web fox half magic cannon fiscal abandon bomb";
const recoveredAccount = algosdk.mnemonicToSecretKey(account_mnemonic);
const accountsMenu = document.getElementById('accountsUse') as HTMLSelectElement
const shirtsInput = document.getElementById('shirts') as HTMLInputElement
const shortsInput = document.getElementById('shorts') as HTMLInputElement
const sweatshirtsInput = document.getElementById('sweatshirts') as HTMLInputElement
const assetInput = document.getElementById('assetId') as HTMLInputElement
const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
const signatureInput = document.getElementById('signature') as HTMLTextAreaElement;
const addSignatureButton = document.getElementById('add-signature') as HTMLButtonElement;
const downloadButton = document.getElementById('download-button') as HTMLButtonElement;
const party1Name = document.getElementById('party1') as HTMLInputElement;
const dateValue = document.getElementById('date') as HTMLInputElement;
const lengthOfContract = document.getElementById('length') as HTMLInputElement;
let blob: Blob;
let pdfHash: Uint8Array;
shirtsInput.disabled = true;
shortsInput.disabled = true;
sweatshirtsInput.disabled = true;
let downloadLink: string;

let pdfDoc: PDFDocument | null = null;

const assetAccount = algosdk.generateAccount();
const passphrase = algosdk.secretKeyToMnemonic(assetAccount.sk);
console.log(`My address: ${assetAccount.addr}`);
console.log(`My passphrase: ${passphrase}`);

const buttonIds = ['connect', 'enter', 'agree', 'connect2', 'submit', 'checkAsset', 'add-signature', 'preview-button', 'download-button']
const buttons: { [key: string]: HTMLButtonElement } = {}
buttonIds.forEach(id => {
  buttons[id] = document.getElementById(id) as HTMLButtonElement
})

/*
function hashPdf(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      resolve(hashHex);
    };
    reader.onerror = () => reject(new Error('An error occurred while reading the file'));
  });
}
*/

function hashPdf(file: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      resolve(hashArray);
    };
    reader.onerror = () => reject(new Error('An error occurred while reading the file'));
  });
}


function storeAccount(account: string, assetIndex: number) {
  const db = getDatabase();
  console.log(`fffffffffffffffffff${db}`)
  const accountRef = dbRef(db, 'accounts/' + account);

  // Retrieve existing asset indexes
  get(accountRef).then(snapshot => {
    let assetIndexes = snapshot.val()?.assetIndexes || [];

    // Add the new assetIndex to the array
    assetIndexes.push(assetIndex);

    // Update the assetIndexes in the database
    set(accountRef, { assetIndexes });
  }).catch(error => {
    console.error("Error updating asset indexes: ", error);
  });
}


function checkAccount(inputAccount: string, inputAssetIndex: number) {
  const db = getDatabase();
  console.log("testingcheckaccount");
  const accountRef = dbRef(db, 'accounts/' + inputAccount);

  // Get the account data from the database
  get(accountRef).then(snapshot => {
    const assetIndexes = snapshot.val()?.assetIndexes || [];

    // Check if the assetIndexes array contains the inputAssetIndex
    if (assetIndexes.includes(inputAssetIndex)) {
      console.log('Match found!');
      buttons.submit.disabled = false
      shirtsInput.disabled = false;
      shortsInput.disabled = false;
      sweatshirtsInput.disabled = false;
    } else {
      console.log('No match found.');
    }
  }).catch(error => {
    console.error("Error retrieving account: ", error);
  });
}




async function signer(txns: algosdk.Transaction[]) {
  return await pera.signTxns(txns)
}

buttons['connect'].onclick = async () => {
  await pera.getAccounts()
  pera.accounts.forEach(account => {
    accountsMenu.add(new Option(account, account))
  })
  var accountCheck = document.getElementById('accountCheck') as HTMLInputElement;
  accountCheck.classList.remove("hidden");
  accountsMenu.classList.remove("hidden");


  var form = document.getElementById('contractForm') as HTMLInputElement;
  form.classList.remove("hidden");
  var enterButton = document.getElementById('enter') as HTMLInputElement
  enterButton.classList.remove("hidden");
  var party = document.getElementById('party1') as HTMLInputElement;
  var date = document.getElementById('date') as HTMLInputElement;
  var number = document.getElementById('length') as HTMLInputElement;
  party.addEventListener("input",checkForm);
  date.addEventListener("input",checkForm);
  number.addEventListener("input",checkForm);
  var enterinfo = document.getElementById('enterinfo') as HTMLInputElement;
  function checkForm(){
    if(party.value && date.value && number.value){
      enterButton.disabled = false;
      enterinfo.classList.remove('hidden');
    }
  }
 
}
var signature = document.getElementById('signature') as HTMLInputElement;
var add_signature = document.getElementById('add-signature') as HTMLInputElement;
var preview_button = document.getElementById('preview-button') as HTMLInputElement;
var download_button = document.getElementById('download-button') as HTMLInputElement;
var agreeinfo = document.getElementById('agreeinfo') as HTMLInputElement;
var agreeButton = document.getElementById('agree') as HTMLInputElement;
buttons['enter'].onclick = async () => {
  const sender = {
    addr: accountsMenu.selectedOptions[0].value,
    signer
  }

  cpApp = new algokit.ApplicationClient(
    {
      app: JSON.stringify(appspec),
      sender,
      creatorAddress: sender.addr
    },
    algodClient,
    indexerClient
  )

  // Instantaites contract on testnet itself - gives us info in variables
  const { appIndex, appAddress, transaction } = await cpApp.create()

  const atcAss = new algosdk.AtomicTransactionComposer()

  const suggestedParams = await algodClient.getTransactionParams().do()

  const fundGenAcc = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: 1000000,
    from: sender.addr,
    to: assetAccount.addr
  })
  atcAss.addTransaction({ txn: fundGenAcc, signer })

  await atcAss.execute(algodClient, 3)

  pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // Increased the page size
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman); // Changed the font to Times Roman

  // Add the title
  page.drawText('LEGAL CONTRACT', {
    x: 180,
    y: 750,
    size: 24,
    font,
  });

  // Add some body content
  page.drawText(`THIS AGREEMENT made the day of ${dateValue.valueAsDate}, between ${party1Name.value} (“Party 1”) and UCLA (“Party 2”):`, {
    x: 50,
    y: 700,
    size: 12,
    font,
    lineHeight: 15,
  });

  page.drawText('WHEREAS, Party 1 provides money for the asset;', {
    x: 50,
    y: 650,
    size: 12,
    font,
  });

  // Prompt for signature
  page.drawText('WHEREAS, Party 2 requires money to give the asset;', {
    x: 50,
    y: 630,
    size: 12,
    font,
  });

  page.drawText(`This contract is valid for a length of ${lengthOfContract.valueAsNumber} months, and shall conclude on the date calculated accordingly.`, {
    x: 50,
    y: 300,
    size: 12,
    font,
    lineHeight: 15,
  });

  page.drawText('NOW, THEREFORE, for and in consideration of the covenants and obligations contained herein, it is hereby agreed as follows:', {
    x: 50,
    y: 600,
    size: 12,
    font,
    lineHeight: 15,
  });

  page.drawText('IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.', {
    x: 50,
    y: 250,
    size: 12,
    font,
  });

  page.drawText('Party 1 Signature:', {
    x: 50,
    y: 220,
    size: 12,
    font,
  });

  console.log("do i get to this point");
  cpID = appIndex
  buttons.agree.disabled = false
 
  signature.classList.remove("hidden");
  add_signature.classList.remove("hidden");


}

signature.addEventListener("input",checkSignature);

function checkSignature()
{
  if(signature.value)
  {
    console.log('hellloooooo');
    add_signature.disabled = false;
  }
}

    
buttons['add-signature'].onclick = async () => {
  console.log('helooooo')
    preview_button.classList.remove("hidden");
    download_button.classList.remove("hidden");
    agreeButton.classList.remove("hidden");
    agreeinfo.classList.remove("hidden");
  if (pdfDoc) {
    const page = pdfDoc.getPages()[0];
    page.drawText(signatureInput.value, {
      x: 200,
      y: 220,
      size: 18,
      color: rgb(0, 0, 0),
    });
  }

}

buttons['preview-button'].onclick = async () => {
  if (pdfDoc) {
    const pdfBytes = await pdfDoc.save();
    blob = new Blob([pdfBytes], { type: 'application/pdf' });
    pdfHash = await hashPdf(blob);
    const url = URL.createObjectURL(blob);

    // Set the blob URL as the iframe's source for preview
    (document.getElementById('pdf-preview') as HTMLIFrameElement).src = url;
    (document.getElementById('pdf-preview') as HTMLIFrameElement).style.display = 'block';

    // Store the download link and enable the actual download button
    downloadLink = url;
    (document.getElementById('download-button') as HTMLButtonElement).disabled = false;
  }

}

buttons['download-button'].onclick = async () => {
  const link = document.createElement('a');
  link.href = downloadLink;
  link.download = 'generated.pdf';
  link.click();

}

buttons['agree'].onclick = async () => {
  //document.getElementById('status').innerHTML = 'Feel free to order now!!'
  buttons.agree.disabled = true
  const sender = {
    addr: accountsMenu.selectedOptions[0].value,
    signer
  }



  const suggestedParams = await algodClient.getTransactionParams().do()
  const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    suggestedParams,
    from: assetAccount.addr, // The account that will create the asset
    assetName: 'UCLALOGO', // The name of the asset
    unitName: 'UCLA', // The short name of the asset
    total: 1, // The total amount of the smallest unit of the asset
    decimals: 0, // The number of decimals in the asset
    reserve: recoveredAccount.addr, // The address of the account that holds the uncirculated/unminted supply of the asset
    freeze: recoveredAccount.addr, // The address of the account that can freeze or unfreeze the asset in a specific account
    defaultFrozen: false, // Whether or not the asset is frozen by default
    clawback: recoveredAccount.addr, // The address of the account that can clawback the asset
    assetURL: 'https://developer.algorand.org', // The URL where more information about the asset can be retrieved
    manager: recoveredAccount.addr, // The address of the account that can change the reserve, freeze, clawback, and manager addresses
    assetMetadataHash: pdfHash
  });



  const signedAssetCreateTxn = assetCreateTxn.signTxn(assetAccount.sk);
  await algodClient.sendRawTransaction(signedAssetCreateTxn).do();
  await algosdk.waitForConfirmation(algodClient, assetCreateTxn.txID(), 3);
  const assetCreateInfo = await algodClient.pendingTransactionInformation(assetCreateTxn.txID()).do();
  const assetIndex = assetCreateInfo['asset-index'];

  console.log('Asset ${assetIndex} created!');
  console.log(assetIndex);
  const atcOpt = new algosdk.AtomicTransactionComposer()
  console.log("line394")
  const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: sender.addr,
    suggestedParams,
    assetIndex,
    amount: 0,
  });
  console.log("line402")

  atcOpt.addTransaction({ txn: optInTxn, signer })
  console.log("line405")

  const claimLicenseMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: 2_000_000,
    from: sender.addr,
    to: recoveredAccount.addr
  })
  console.log("line413")

  atcOpt.addTransaction({ txn: claimLicenseMe, signer })
  console.log("line416")

  const claimLicenseUCLA = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,
    amount: 3_000_000,
    from: sender.addr,
    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
  })
  atcOpt.addTransaction({ txn: claimLicenseUCLA, signer })
  console.log("line425")

  await atcOpt.execute(algodClient, 3)
  console.log("line428")

  const xferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: assetAccount.addr,
    to: sender.addr,
    suggestedParams,
    assetIndex,
    amount: 1,
  });

  console.log("line438")

  const signedXferTxn = xferTxn.signTxn(assetAccount.sk);
  await algodClient.sendRawTransaction(signedXferTxn).do();
  await algosdk.waitForConfirmation(algodClient, xferTxn.txID().toString(), 3);
  console.log(assetIndex);
  console.log("line444")

  var assetinfo = document.getElementById('assetinfo') as HTMLInputElement;
  assetinfo.classList.remove('hidden');
   assetinfo.innerHTML= 'Your asset ID is: ' + assetIndex + '. Make sure to store this number safely and do not share it with anyone. This is your key place records of your merchandise. Continue to the order page to continue your purchase'
  const storage = getStorage();
  const pdfRef = storageRef(storage, 'accounts/${sender.addr}/${assetIndex}/generated.pdf');
  console.log("line451")

  // Upload the PDF to the defined reference
  uploadBytes(pdfRef, blob).then((snapshot) => {
    console.log('PDF uploaded to Firebase Storage!');
  });

  storeAccount(sender.addr, assetIndex);
 // checkAccount(sender.addr,assetIndex);
  //insertRecord(assetIndex, sender.addr);
}


buttons['checkAsset'].onclick = async () => {
  const sender = {
    addr: accountsMenu.selectedOptions[0].value,
    signer
  }
  const assetID = assetInput.valueAsNumber
  checkAccount(sender.addr, assetID);

}

