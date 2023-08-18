var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import algosdk from 'algosdk';
import { PeraSession } from './wallets/pera';
import * as algokit from '@algorandfoundation/algokit-utils';
import appspec from '../application.json';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, set } from 'firebase/database';
import { get } from 'firebase/database';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
//connect our wallet and populate wallet array
var pera = new PeraSession();
//Figure out what to do with this when it comes time to deploy to mainnets
var algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
var indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '');
//Instantiate contract object
var contract = new algosdk.ABIContract(appspec.contract);
var cpID;
var cpApp;
var firebaseConfig = {
    apiKey: "AIzaSyDMEGBFsul2qxumXo0G4R1XdQjtX4dMrf8",
    authDomain: "copyrightprototype.firebaseapp.com",
    projectId: "copyrightprototype",
    storageBucket: "copyrightprototype.appspot.com",
    messagingSenderId: "517747606301",
    appId: "1:517747606301:web:d20424b36a961972f817f4",
    measurementId: "G-S9N43X8PM9"
};
var app = initializeApp(firebaseConfig);
var database = getDatabase(app);
var account_mnemonic = "patch caught ignore dilemma deny please tent soccer powder tube enrich yellow will benefit head tobacco bachelor web fox half magic cannon fiscal abandon bomb";
var recoveredAccount = algosdk.mnemonicToSecretKey(account_mnemonic);
var accountsMenu = document.getElementById('accountsUse');
var accountsMenu2 = document.getElementById('accounts2Use');
var shirtsInput = document.getElementById('shirts');
var shortsInput = document.getElementById('shorts');
var sweatshirtsInput = document.getElementById('sweatshirts');
var assetInput = document.getElementById('assetId');
var canvas = document.getElementById('pdf-canvas');
var signatureInput = document.getElementById('signature');
var addSignatureButton = document.getElementById('add-signature');
var downloadButton = document.getElementById('download-button');
var party1Name = document.getElementById('party1');
var dateValue = document.getElementById('date');
var lengthOfContract = document.getElementById('length');
var blob;
var pdfHash;
shirtsInput.disabled = true;
shortsInput.disabled = true;
sweatshirtsInput.disabled = true;
var downloadLink;
var pdfDoc = null;
var assetAccount = algosdk.generateAccount();
var passphrase = algosdk.secretKeyToMnemonic(assetAccount.sk);
console.log("My address: ".concat(assetAccount.addr));
console.log("My passphrase: ".concat(passphrase));
var buttonIds = ['connect', 'enter', 'agree', 'connect2', 'submit', 'checkAsset', 'add-signature', 'preview-button', 'download-button'];
var buttons = {};
buttonIds.forEach(function (id) {
    buttons[id] = document.getElementById(id);
});
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
function hashPdf(file) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = function () { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, hashBuffer, hashArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arrayBuffer = reader.result;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', arrayBuffer)];
                    case 1:
                        hashBuffer = _a.sent();
                        hashArray = new Uint8Array(hashBuffer);
                        resolve(hashArray);
                        return [2 /*return*/];
                }
            });
        }); };
        reader.onerror = function () { return reject(new Error('An error occurred while reading the file')); };
    });
}
function storeAccount(account, assetIndex) {
    var db = getDatabase();
    var accountRef = dbRef(db, 'accounts/' + account);
    // Retrieve existing asset indexes
    get(accountRef).then(function (snapshot) {
        var _a;
        var assetIndexes = ((_a = snapshot.val()) === null || _a === void 0 ? void 0 : _a.assetIndexes) || [];
        // Add the new assetIndex to the array
        assetIndexes.push(assetIndex);
        // Update the assetIndexes in the database
        set(accountRef, { assetIndexes: assetIndexes });
    }).catch(function (error) {
        console.error("Error updating asset indexes: ", error);
    });
}
function checkAccount(inputAccount, inputAssetIndex) {
    var db = getDatabase();
    var accountRef = dbRef(db, 'accounts/' + inputAccount);
    // Get the account data from the database
    get(accountRef).then(function (snapshot) {
        var _a;
        var assetIndexes = ((_a = snapshot.val()) === null || _a === void 0 ? void 0 : _a.assetIndexes) || [];
        // Check if the assetIndexes array contains the inputAssetIndex
        if (assetIndexes.includes(inputAssetIndex)) {
            console.log('Match found!');
            buttons.submit.disabled = false;
            shirtsInput.disabled = false;
            shortsInput.disabled = false;
            sweatshirtsInput.disabled = false;
        }
        else {
            console.log('No match found.');
        }
    }).catch(function (error) {
        console.error("Error retrieving account: ", error);
    });
}
function signer(txns) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pera.signTxns(txns)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
buttons['connect'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pera.getAccounts()];
            case 1:
                _a.sent();
                pera.accounts.forEach(function (account) {
                    accountsMenu.add(new Option(account, account));
                });
                buttons.enter.disabled = false;
                document.getElementById('status').innerHTML = 'Connected! Not the right account? Feel free to connect again';
                return [2 /*return*/];
        }
    });
}); };
buttons['enter'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, _a, appIndex, appAddress, transaction, atcAss, suggestedParams, fundGenAcc, page, font;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                buttons.enter.disabled = true;
                sender = {
                    addr: accountsMenu.selectedOptions[0].value,
                    signer: signer
                };
                cpApp = new algokit.ApplicationClient({
                    app: JSON.stringify(appspec),
                    sender: sender,
                    creatorAddress: sender.addr
                }, algodClient, indexerClient);
                return [4 /*yield*/, cpApp.create()];
            case 1:
                _a = _b.sent(), appIndex = _a.appIndex, appAddress = _a.appAddress, transaction = _a.transaction;
                atcAss = new algosdk.AtomicTransactionComposer();
                return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 2:
                suggestedParams = _b.sent();
                fundGenAcc = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: 1000000,
                    from: sender.addr,
                    to: assetAccount.addr
                });
                atcAss.addTransaction({ txn: fundGenAcc, signer: signer });
                return [4 /*yield*/, atcAss.execute(algodClient, 3)];
            case 3:
                _b.sent();
                return [4 /*yield*/, PDFDocument.create()];
            case 4:
                pdfDoc = _b.sent();
                page = pdfDoc.addPage([600, 800]);
                return [4 /*yield*/, pdfDoc.embedFont(StandardFonts.TimesRoman)];
            case 5:
                font = _b.sent();
                // Add the title
                page.drawText('LEGAL CONTRACT', {
                    x: 180,
                    y: 750,
                    size: 24,
                    font: font,
                });
                // Add some body content
                page.drawText("THIS AGREEMENT made the day of ".concat(dateValue.valueAsDate, ", between ").concat(party1Name.value, " (\u201CParty 1\u201D) and UCLA (\u201CParty 2\u201D):"), {
                    x: 50,
                    y: 700,
                    size: 12,
                    font: font,
                    lineHeight: 15,
                });
                page.drawText('WHEREAS, Party 1 provides money for the asset;', {
                    x: 50,
                    y: 650,
                    size: 12,
                    font: font,
                });
                // Prompt for signature
                page.drawText('WHEREAS, Party 2 requires money to give the asset;', {
                    x: 50,
                    y: 630,
                    size: 12,
                    font: font,
                });
                page.drawText("This contract is valid for a length of ".concat(lengthOfContract.valueAsNumber, " months, and shall conclude on the date calculated accordingly."), {
                    x: 50,
                    y: 300,
                    size: 12,
                    font: font,
                    lineHeight: 15,
                });
                page.drawText('NOW, THEREFORE, for and in consideration of the covenants and obligations contained herein, it is hereby agreed as follows:', {
                    x: 50,
                    y: 600,
                    size: 12,
                    font: font,
                    lineHeight: 15,
                });
                page.drawText('IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first above written.', {
                    x: 50,
                    y: 250,
                    size: 12,
                    font: font,
                });
                page.drawText('Party 1 Signature:', {
                    x: 50,
                    y: 220,
                    size: 12,
                    font: font,
                });
                cpID = appIndex;
                buttons.agree.disabled = false;
                return [2 /*return*/];
        }
    });
}); };
buttons['add-signature'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
        if (pdfDoc) {
            page = pdfDoc.getPages()[0];
            page.drawText(signatureInput.value, {
                x: 200,
                y: 220,
                size: 18,
                color: rgb(0, 0, 0),
            });
        }
        return [2 /*return*/];
    });
}); };
buttons['preview-button'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pdfBytes, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pdfDoc) return [3 /*break*/, 3];
                return [4 /*yield*/, pdfDoc.save()];
            case 1:
                pdfBytes = _a.sent();
                blob = new Blob([pdfBytes], { type: 'application/pdf' });
                return [4 /*yield*/, hashPdf(blob)];
            case 2:
                pdfHash = _a.sent();
                url = URL.createObjectURL(blob);
                // Set the blob URL as the iframe's source for preview
                document.getElementById('pdf-preview').src = url;
                document.getElementById('pdf-preview').style.display = 'block';
                // Store the download link and enable the actual download button
                downloadLink = url;
                document.getElementById('download-button').disabled = false;
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
buttons['download-button'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var link;
    return __generator(this, function (_a) {
        link = document.createElement('a');
        link.href = downloadLink;
        link.download = 'generated.pdf';
        link.click();
        return [2 /*return*/];
    });
}); };
buttons['agree'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, suggestedParams, assetCreateTxn, signedAssetCreateTxn, assetCreateInfo, assetIndex, atcOpt, optInTxn, claimLicenseMe, claimLicenseUCLA, xferTxn, signedXferTxn, storage, pdfRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //document.getElementById('status').innerHTML = 'Feel free to order now!!'
                buttons.agree.disabled = true;
                sender = {
                    addr: accountsMenu.selectedOptions[0].value,
                    signer: signer
                };
                return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 1:
                suggestedParams = _a.sent();
                assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    from: assetAccount.addr,
                    assetName: 'UCLALOGO',
                    unitName: 'UCLA',
                    total: 1,
                    decimals: 0,
                    reserve: recoveredAccount.addr,
                    freeze: recoveredAccount.addr,
                    defaultFrozen: false,
                    clawback: recoveredAccount.addr,
                    assetURL: 'https://developer.algorand.org',
                    manager: recoveredAccount.addr,
                    assetMetadataHash: pdfHash
                });
                signedAssetCreateTxn = assetCreateTxn.signTxn(assetAccount.sk);
                return [4 /*yield*/, algodClient.sendRawTransaction(signedAssetCreateTxn).do()];
            case 2:
                _a.sent();
                return [4 /*yield*/, algosdk.waitForConfirmation(algodClient, assetCreateTxn.txID(), 3)];
            case 3:
                _a.sent();
                return [4 /*yield*/, algodClient.pendingTransactionInformation(assetCreateTxn.txID()).do()];
            case 4:
                assetCreateInfo = _a.sent();
                assetIndex = assetCreateInfo['asset-index'];
                console.log('Asset ${assetIndex} created!');
                atcOpt = new algosdk.AtomicTransactionComposer();
                optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    from: sender.addr,
                    to: sender.addr,
                    suggestedParams: suggestedParams,
                    assetIndex: assetIndex,
                    amount: 0,
                });
                atcOpt.addTransaction({ txn: optInTxn, signer: signer });
                claimLicenseMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: 2000000,
                    from: sender.addr,
                    to: recoveredAccount.addr
                });
                atcOpt.addTransaction({ txn: claimLicenseMe, signer: signer });
                claimLicenseUCLA = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: 3000000,
                    from: sender.addr,
                    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
                });
                atcOpt.addTransaction({ txn: claimLicenseUCLA, signer: signer });
                return [4 /*yield*/, atcOpt.execute(algodClient, 3)];
            case 5:
                _a.sent();
                xferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    from: assetAccount.addr,
                    to: sender.addr,
                    suggestedParams: suggestedParams,
                    assetIndex: assetIndex,
                    amount: 1,
                });
                signedXferTxn = xferTxn.signTxn(assetAccount.sk);
                return [4 /*yield*/, algodClient.sendRawTransaction(signedXferTxn).do()];
            case 6:
                _a.sent();
                return [4 /*yield*/, algosdk.waitForConfirmation(algodClient, xferTxn.txID().toString(), 3)];
            case 7:
                _a.sent();
                document.getElementById('t&c').innerHTML = 'Your asset ID is: ' + assetIndex + '. Make sure to store this number safely and do not share it with anyone. This is your key place records of your merchandise.';
                storage = getStorage();
                pdfRef = storageRef(storage, 'accounts/${sender.addr}/${assetIndex}/generated.pdf');
                // Upload the PDF to the defined reference
                uploadBytes(pdfRef, blob).then(function (snapshot) {
                    console.log('PDF uploaded to Firebase Storage!');
                });
                storeAccount(sender.addr, assetIndex);
                return [2 /*return*/];
        }
    });
}); };
buttons['checkAsset'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, assetID;
    return __generator(this, function (_a) {
        sender = {
            addr: accountsMenu.selectedOptions[0].value,
            signer: signer
        };
        assetID = assetInput.valueAsNumber;
        checkAccount(sender.addr, assetID);
        return [2 /*return*/];
    });
}); };
buttons['submit'].onclick = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, suggestedParams, numShirtPriceOrg, numShortPriceOrg, numSweatshirtPriceOrg, numShirtPriceMe, numShortPriceMe, numSweatshirtPriceMe, atc, paymentShirtOrg, paymentShirtMe, paymentShortOrg, paymentShortMe, paymentSweatshirtOrg, paymentSweatshirtMe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sender = {
                    addr: accountsMenu.selectedOptions[0].value,
                    signer: signer
                };
                return [4 /*yield*/, algodClient.getTransactionParams().do()];
            case 1:
                suggestedParams = _a.sent();
                numShirtPriceOrg = shirtsInput.valueAsNumber * 1000;
                numShortPriceOrg = shortsInput.valueAsNumber * 2000;
                numSweatshirtPriceOrg = sweatshirtsInput.valueAsNumber * 3000;
                numShirtPriceMe = shirtsInput.valueAsNumber * 100;
                numShortPriceMe = shortsInput.valueAsNumber * 200;
                numSweatshirtPriceMe = sweatshirtsInput.valueAsNumber * 300;
                atc = new algosdk.AtomicTransactionComposer();
                paymentShirtOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numShirtPriceOrg,
                    from: sender.addr,
                    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
                });
                atc.addTransaction({ txn: paymentShirtOrg, signer: signer });
                paymentShirtMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numShirtPriceMe,
                    from: sender.addr,
                    to: recoveredAccount.addr
                });
                atc.addTransaction({ txn: paymentShirtMe, signer: signer });
                paymentShortOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numShortPriceOrg,
                    from: sender.addr,
                    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
                });
                atc.addTransaction({ txn: paymentShortOrg, signer: signer });
                paymentShortMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numShortPriceMe,
                    from: sender.addr,
                    to: recoveredAccount.addr
                });
                atc.addTransaction({ txn: paymentShortMe, signer: signer });
                paymentSweatshirtOrg = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numSweatshirtPriceOrg,
                    from: sender.addr,
                    to: 'RPNXNY5BYC67TI7AZGUUKAS77TFOP5WMLHP3GZKLDS2QSKIVVPZGO7RRBY'
                });
                atc.addTransaction({ txn: paymentSweatshirtOrg, signer: signer });
                paymentSweatshirtMe = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: suggestedParams,
                    amount: numSweatshirtPriceMe,
                    from: sender.addr,
                    to: recoveredAccount.addr
                });
                atc.addTransaction({ txn: paymentSweatshirtMe, signer: signer });
                return [4 /*yield*/, atc.execute(algodClient, 3)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map