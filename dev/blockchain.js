const sha256= require('sha256');
const uuid = require('uuid').v1;
const currentNodeURL= process.argv[3];

    function Blockchain() {
    this.chain= [];
    this.newTransactions=[];
    this.networkNodes = [];
    
    this.currentNodeURL= currentNodeURL;
   

    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock= {
        index: this.chain.length +1,
        timestamp: Date.now(),
        transactions:  this.newTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    };
//after putting all the new transactions into the newly created block, empty the array
    this.newTransactions=[];
    //pushing this block into the chain
    this.chain.push(newBlock);

    return newBlock;

}
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length-1];
}
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient){
    const newTransaction={
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
    // this.newTransactions.push(newTransaction);
    // console.log(newTransaction);

    // return this.getLastBlock()['index'] + 1;
    return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function(transaction) {
    this.newTransactions.push(transaction);
    return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock= function(previousBlockHash, blockData, nonce){
    //if any block is tampered, the hash of the following block will change.
    const dataString= previousBlockHash + nonce.toString() + JSON.stringify(blockData);
    const hash= sha256(dataString);

    return hash;
};
//returns the correct nonce that gives a valid hash
Blockchain.prototype.proofOfWork = function (previousBlockHash, blockData) {
    let nonce= 0;
    let hash = this.hashBlock(previousBlockHash, blockData, nonce);
    //trial and run for hash untill hash starting with 4 zeros is obtained
    while(hash.substring(0, 4) !== '0000'){
       nonce++;
       hash= this.hashBlock(previousBlockHash, blockData, nonce);
    }
    return nonce;
}
Blockchain.prototype.chainIsValid= function(blockchain){
   
    let validChain= true;
console.log('blockchain: ', blockchain);
    //every block through blockchain
    for(var i=1; i< blockchain.length; i++){
        const currentBlock= blockchain[i];
        const lastBlock= blockchain[i-1];

        //rehash every block to check if the hash of currentblock starts with 4 0s or not
        const blockHash = this.hashBlock(lastBlock['hash'], { transactions: currentBlock['transactions'] }, currentBlock['nonce']);
        if(blockHash.substring(0,4) !== '0000') validChain= false;
        
        //hash compare
        if(currentBlock['previousBlockHash'] != lastBlock['hash']){
            validChain= false;
        }
    };

    //checking genesis block
    const genesisBlock = blockchain[0];

    const correctNonce= genesisBlock['nonce'] === 100;
    const correctPrevHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash= genesisBlock['hash'] === '0';
    const correctTransactions= genesisBlock['transactions'].length === 0;

    if( !correctHash || !correctPrevHash || !correctNonce || !correctTransactions ) validChain = false;
    return validChain;
};

module.exports = Blockchain; 