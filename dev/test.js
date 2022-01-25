const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1642999324736,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1642999501673,
            "transactions": [],
            "nonce": 182913,
            "hash": "00002e545100915d2bc8433025744663d1d2386360c0f5a61d9582910cd8dcf5",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1642999555729,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0xREWARD",
                    "recipient": "faac19a07ccf11ec8bf45346278fc40a",
                    "transactionId": "6428f3d07cd011ec8bf45346278fc40a"
                },
                {
                    "amount": "40",
                    "sender": "0X459FJDJ89493IJD",
                    "recipient": "38HFJN4IJF8J4S",
                    "transactionId": "7aa491507cd011ec8bf45346278fc40a"
                },
                {
                    "amount": "20",
                    "sender": "0X459FJDJ89493IJD",
                    "recipient": "38HFJN4IJF8J4S",
                    "transactionId": "7e13ee807cd011ec8bf45346278fc40a"
                },
                {
                    "amount": "30",
                    "sender": "0X459FJDJ89493IJD",
                    "recipient": "38HFJN4IJF8J4S",
                    "transactionId": "819e9be07cd011ec8bf45346278fc40a"
                }
            ],
            "nonce": 117029,
            "hash": "0000abf8750359f2e2b892ed8a9e28a33721248dabea70a230708ea333b97550",
            "previousBlockHash": "00002e545100915d2bc8433025744663d1d2386360c0f5a61d9582910cd8dcf5"
        },
        {
            "index": 4,
            "timestamp": 1642999587568,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0xREWARD",
                    "recipient": "faac19a07ccf11ec8bf45346278fc40a",
                    "transactionId": "845c35407cd011ec8bf45346278fc40a"
                }
            ],
            "nonce": 66412,
            "hash": "00006a8115a7d8617272874ee2a0dcf90a37e2d1460cac53458622af64d8f762",
            "previousBlockHash": "0000abf8750359f2e2b892ed8a9e28a33721248dabea70a230708ea333b97550"
        },
        {
            "index": 5,
            "timestamp": 1642999592386,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0xREWARD",
                    "recipient": "faac19a07ccf11ec8bf45346278fc40a",
                    "transactionId": "975674307cd011ec8bf45346278fc40a"
                }
            ],
            "nonce": 3941,
            "hash": "000098a7afb59050bdfb3f59048a702b0b576510ded7eedca3239727d0905dba",
            "previousBlockHash": "00006a8115a7d8617272874ee2a0dcf90a37e2d1460cac53458622af64d8f762"
        }
    ],
        "newTransactions": [
            {
                "amount": 12.5,
                "sender": "0xREWARD",
                "recipient": "faac19a07ccf11ec8bf45346278fc40a",
                "transactionId": "9a35ed707cd011ec8bf45346278fc40a"
            }
        ],
            "networkNodes": [],
                "currentNodeURL": "http://localhost:3001"
}
console.log('genesis block', bc1.chain);
console.log('valid:', bitcoin.chainIsValid(bc1.chain));