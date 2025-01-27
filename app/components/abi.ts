export const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            }
        ],
        "name": "CardDealt",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "hasWon",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winnings",
                "type": "uint256"
            }
        ],
        "name": "GameEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "bet",
                "type": "uint256"
            }
        ],
        "name": "GameStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "hasWon",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winnings",
                "type": "uint256"
            }
        ],
        "name": "WinnerDetermined",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "dealer",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "bet",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "hasWon",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalWinnings",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "devAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fundContract",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gamesPlayed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDealerHand",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "enum Blackjack.Suit",
                        "name": "suit",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum Blackjack.Rank",
                        "name": "rank",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct Blackjack.Card[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDealerScore",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGamesPlayed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalWinnings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserHand",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "enum Blackjack.Suit",
                        "name": "suit",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum Blackjack.Rank",
                        "name": "rank",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct Blackjack.Card[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserScore",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "hit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "refundContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stand",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startGame",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "user",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "bet",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "hasWon",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalWinnings",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];