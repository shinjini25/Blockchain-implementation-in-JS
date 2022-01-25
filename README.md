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
    loops through each node in the network and registers the new node with every node in the network and also create a HTTP request to register-nodes-bulk from the new node. 
    
  POST /consensus: 
    
 ![bbf](https://user-images.githubusercontent.com/71487701/151002606-0ccd6710-d2eb-4f4a-841b-c3a9b42221d2.png)
![bbf2](https://user-images.githubusercontent.com/71487701/151002608-f1fedd6f-1200-4a9d-af4c-ede372436fb3.png)
![bbf3](https://user-images.githubusercontent.com/71487701/151002613-8ac69e44-3db0-487e-a0be-89e0aa02399d.png)
  ![bb](https://user-images.githubusercontent.com/71487701/151002567-27c2dd53-0d93-4879-8636-f3987127e3a0.png)
![bb5](https://user-images.githubusercontent.com/71487701/151002589-eae77a8a-7a23-4a3f-a529-091abab21d34.png)
![bb2](https://user-images.githubusercontent.com/71487701/151002591-0ee252c3-48ad-4175-826b-b4fba0e1cedd.png)
![bb3](https://user-images.githubusercontent.com/71487701/151002592-f60400da-0865-430a-a15e-a6f70ae673ee.png)
![bb4](https://user-images.githubusercontent.com/71487701/151002599-7153e3a1-00b0-457e-85bb-bd934265f15b.png)
