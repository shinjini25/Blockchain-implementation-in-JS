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
    const transaction = req.body;
    const index= bitcoin.addTransactionToPendingTransactions(transaction);
    res.json({ note: `New transaction will be added to ${index} block`});

    // const blockIndex= bitcoin.createNewTransaction(amount, sender, recipient);
    // res.json({note: `Transaction will be added in block number- ${blockIndex} after mining.`})
});
//broadcasts the transactions to every node for sync
app.post('/transaction/broadcast', (req, res) => {
    const requestPromises= [];
    const newTransaction= bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

    bitcoin.addTransactionToPendingTransactions(newTransaction);

    //boradcast
    bitcoin.networkNodes.forEach(network => {
        const reqOptions= {
            uri: network + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(reqOptions));
    });


    Promise.all(requestPromises)
        .then(data => {
            res.json({ note: 'Transaction created and broadcast successfully.' });
        });

    // async function transactionPromises() {
    //     try{
           
    //         const proms = await requestPromises;
    //         console.log(proms);
    //         res.json({ note: "Boradcast of transaction was successful!"})

    //     } catch (e) {
    //         console.log("unsuccessful!", e);
    //         res.json({note: "Unsuccessful!"});
    //     };
    // }
    // transactionPromises();
});

app.get('/mine', (req, res) => {

    const reqPromises= [];

    //last block
    const lastBlock= bitcoin.getLastBlock();
    const previousBlockHash= lastBlock['hash'];

    const currentBlockData= {
        transactions: bitcoin.newTransactions,
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData );
    const blockHash= bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    const newBlock= bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    //broadcast
    bitcoin.networkNodes.forEach(networkUrl => {
        const requestOptions= {
            uri: networkUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };
        reqPromises.push(rp(requestOptions));
    });
   async function minePromsies() {
       try{
           const proms = await reqPromises;

           const reqOptions = {
               uri: bitcoin.currentNodeURL + '/transaction/broadcast',
               method: 'POST',
               body: {
                   amount: 12.5,
                   sender: "0xREWARD",
                   recipient: nodeAdress
               },
               json: true
           };
           res.json({
               note: "New block mined successfully!",
               block: newBlock,
           });
           return rp(reqOptions);
       } catch(e) {
           res.json({ note: "Unsuccessful!"});
           console.log(e);
       }
       }
   
    minePromsies();
   
});
app.post('/receive-new-block', (req, res) => {
 const newblock= req.body.newBlock;
 const lastBlock= bitcoin.getLastBlock();
 const lastblockHash= lastBlock.hash;

 //legitimate block
    const correctHash= lastblockHash === newblock.previousBlockHash 
    if(correctHash){
        bitcoin.chain.push(newblock);
        bitcoin.newTransactions=[];
        res.json({ 
            note: "New block succesfully added to the chain!",
            newBlock: newblock
        });
    }else{
        res.json({ 
            note: "The new block was rejected :(", 
            newBlock: newblock
            });
    }
});

app.post('/register-and-broadcast-node', function(req, res){
    const newNodeURL= req.body.newNodeURL;
    const regNodesPromises=[];

    //if node doesn't already exist, add it to the array
    if(bitcoin.networkNodes.indexOf(newNodeURL) == -1){
        bitcoin.networkNodes.push(newNodeURL);
    }
    //boradcast
    //for every node in the network nodes array, hit register node individually
        bitcoin.networkNodes.forEach(async nodeURL => {
        const reqOptions={
            uri: nodeURL + '/register-node',
            method: 'POST',
            body: { newNodeURL: newNodeURL },
            json: true 
        };
        //async requests
        regNodesPromises.push(rp(reqOptions));
        });
    // register and broadcast done
    async function bulkPromises() {
        try {
            const proms = await regNodesPromises;
            const arrNodes = [...bitcoin.networkNodes, bitcoin.currentNodeURL ];
            const bulkOptions = {
                    uri: newNodeURL + '/register-nodes-bulk',
                    method: 'POST',
                    //sending all the network urls to the new node
                    body: { allNetworkNodes: arrNodes},
                    json: true
               };
            res.json({ note: "New node has been successfully registered with the network." });
            return rp(bulkOptions);

        } catch (e) {
            console.log("unsuccessful!", e);
        };
    }
        bulkPromises();


        // Promise.all(regNodesPromises) 
        // .then( (data) => {
        //     console.log("isnide");
        //     const arr= ["localhost1", "localhsot2", "localhost3"];
        //     // console.log("registered new node");
        //     const bulkOptions={
        //         uri: newNodeURL + '/register-nodes-bulk', 
        //         method: 'POST',
        //         //sending all the network urls to the new node
        //         body: { allNetworkNodes: [ ...arr ] },
        //         json: true
        //     };
        //     return rp(bulkOptions);
        // })
        // .then(data => {
        //   res.json({note: "New node has been successfully registered with the network."});
        // })
        // .catch(e =>{
        
        //    errStatusCode= e.statusCode;
        //     res.json({ note: errStatusCode});
        //     console.log("loggin error");
        //     console.log(errStatusCode);
        // }); 
    
});
app.get('/consensus', (req, res) => {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    async function consensusPromises() {
        try{
            
            const blockchains = await Promise.all(requestPromises);
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.newTransactions;
                };
            });
            if (newLongestChain ==  null) {

            }
            // if new longest chain wasn't found or found but it not valid
            if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: bitcoin.chain
                });
            }
            //was found and is valid
            else if ((newLongestChain && bitcoin.chainIsValid(newLongestChain))) {
                bitcoin.chain = newLongestChain;
                bitcoin.newTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: bitcoin.chain
                });
            }
        } catch(e) {
            console.log("Error", e);
            res.json({note: e});
        }
    }

   LongestChain = null;

    consensusPromises();

});

app.post('/register-node', (req, res)=>{
    const newNodeURL = req.body.newNodeURL;
    //if the new node url is not as same as the current node that was hit
    const notCurentNode = bitcoin.currentNodeURL != newNodeURL;

    //only add to nodes that do not have the current node url check
    if( bitcoin.networkNodes.indexOf(newNodeURL) == -1 && notCurentNode) {
        bitcoin.networkNodes.push(newNodeURL);
        res.json({ note: `New node successfully added to the node: ${bitcoin.currentNodeURL}`});
    }
  
});
  
//the new node url makes this req
app.post('/register-nodes-bulk', (req, res) => {
    const allNodes= req.body.allNetworkNodes;

    //loop through the array and register each with the new ndoe url
     allNodes.forEach( node => {
        if (bitcoin.networkNodes.indexOf(node) == -1 && bitcoin.currentNodeURL != node) {
            bitcoin.networkNodes.push(node);
        } 
    });

    res.json({ note: "All network nodes have been successfully registered to the new node!"});

});


// get block by blockHash
app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

// get address by address
app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    });
});
// get transaction by transactionId
app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const trasactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: trasactionData.transaction,
        block: trasactionData.block
    });
});

app.get('/block-explorer', function(req, res) {
    res.sendFile('./block-explorer/index.html' , { root: __dirname });
});

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
}); 