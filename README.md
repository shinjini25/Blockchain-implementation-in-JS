# Blockchain prototype in Javascript

A fully functional Javascript-based decentralized blockchain network with API to interact with the blockchain data structure. Has real-world features
such as proof of work algorithm, hashing, consensus algorithm to synchronize legitimate blocks across all the nodes, broadcasting systems, 
and also a block explorer UI using which user can search for any block in the blockchain network (using hash, address or transaction id), similar to Etherscan (https://etherscan.io/).

Tools used: Express for building API routes & Postman.

# Main Routes:

  GET /blockchain:
    returns the entire blockchain data structure.
    
  GET /transaction: 
    add new transaction object to pendingtransactions to individual node
    
  GET /transaction/broadcast: 
    creating new transation object and broadcasting it to the network by hitting 'transaction' route for individual ndoes in the network asynchronously.
    
  GET /mine: 
    performing proof of work and using the nonce and hash the data with previous block hash to create a legitimate block. After the block has been created, a http call is made from each node in the network to the 'receive-new-block' endpoint.
    
  POST /mine: 
    adds the newly mined block to each of the nodes in the network. 
    
  POST /register-node: 
    adds a newly created node to a particular node.
    
  POST /register-nodes-bulk: 
    registers all the existing nodes with the newly created node.
   
  POST /register-and-broadcast-node: 
    loops through each node in the network and registers the new node with every node in the network and also create a HTTP request to /register-nodes-bulk from the new node. 
    
  POST /consensus: 
  
  
  
  
