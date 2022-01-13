const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

console.log(bitcoin);
// const previousBlockHash= '0x39J4JEI3002309JSKKMFF';
// const currentBlockData= [
//     {
//         amount: 15,
//         sender: '039FJKSDKRO4NKMD',
//         recipient: '043JSKR3238LKDKNK'
//     },
//     {
//         amount: 45,
//         sender: '039FJKSDKRKJFKKSLKMD',
//         recipient: '043JSKR32O40OKMDO09L'
//     },

//     {
//         amount: 34,
//         sender: '039FJKSDKNFDK0R93D',
//         recipient: '043JSKR3205HJNODK434'
//     },

// ]
// const nonce= 4893;
// bitcoin.createNewBlock(2344, '0X1KJFKJKDKSOPDOPOE2348J', '0XJKJ48289329BD33C');

// const i= bitcoin.createNewTransaction(3344, '0x45JDJI5434KMSDK', '0XJ34JFJJ34J5402NLL');
// console.log("transaction will be added in", i);

// bitcoin.createNewBlock(4398, '0x4JFJ432EK23LLA4092', '0X4JKSK2KALK7283LKLA');

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
// console.log(bitcoin.chain[1].transactions);