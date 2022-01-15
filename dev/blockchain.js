const sha256= require('sha256');
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
    };
    this.newTransactions.push(newTransaction);
    console.log(newTransaction);

    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock= function(previousBlockHash, blockData, nonce){
    //if any block is tampered, the hash of the following block will change.
    const dataString= previousBlockHash + nonce.toString() + JSON.stringify(blockData);
    const hash= sha256(dataString);

    return hash;
}
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

module.exports = Blockchain; 