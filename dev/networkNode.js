var express= require('express');
const bodyParser= require('body-parser');
const uuid= require('uuid').v1;
const rp= require('request-promise'); 

const port= process.argv[2];

const nodeAdress= uuid().split('-').join('');

const Blockchain= require('./blockchain');
const bitcoin= new Blockchain();

var app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/blockchain', (req, res) => {
    res.send(bitcoin);
});

app.post('/transaction', (req, res) => {

    let sender= req.body.sender;
    let recipient= req.body.recipient;
    let amount= req.body.amount;

    const blockIndex= bitcoin.createNewTransaction(amount, sender, recipient);
    res.json({note: `Transaction will be added in block number- ${blockIndex} after mining.`})
});

app.get('/mine', (req, res) => {

    //last block
    const lastBlock= bitcoin.getLastBlock();
    const previousBlockHash= lastBlock['hash'];

    const currentBlockData= {
        transactions: bitcoin.newTransactions,
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData );
    const blockHash= bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    bitcoin.createNewTransaction(12.5, "0XREWARD", nodeAdress);
    const newBlock= bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json(
        {
            note: "New block mined successfully!",
            block: newBlock,
        }
    );
});
app.post('/register-and-broadcast-node', function(req, res){
 const newNodeURL= req.body.newNodeURL;
 const regNodesPromises=[];
 //if node doesn't already exist, add it to the array
 if(bitcoin.networkNodes.indexOf(newNodeURL) == -1){
     bitcoin.networkNodes.push(newNodeURL);
 }
 //boradcast
 //for every node in the network nodes array, hit register node
    bitcoin.networkNodes.forEach(nodeURL => {
      const options={
          uri: nodeURL + '/register-node',
          method: "POST",
          body: { newNodeURL: nodeURL},
          json: true
      } ;
      regNodesPromises.push(rp(options));

    });

    Promise.all(regNodesPromises)
    .then( data => {
        const options={
            uri: newNodeURL,
            method: 'POST',
            body: { allNetworkNodes: }
        }
    });
 
});
app.post('/register-node', (req, res)=>{

});

app.post('/register-nodes-bulk', (req, res) => {

});

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
}); 