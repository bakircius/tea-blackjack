// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blackjack {
    enum Suit { Clubs, Diamonds, Hearts, Spades }
    enum Rank { Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace }

    struct Card {
        Suit suit;
        Rank rank;
    }

    address public owner;

    struct Player {
        Card[] hand;
        uint8 score;
        uint256 bet;
        bool hasWon;
        uint256 totalWinnings;
    }

    Player public user;
    Player public dealer;
    uint256 public gamesPlayed;
    address public immutable devAddress;

    event GameStarted(address indexed player, uint256 bet);
    event CardDealt(address indexed player, uint8 score);
    event WinnerDetermined(address indexed player, bool hasWon, uint256 winnings);
    event GameEnded(address indexed player, bool hasWon, uint256 winnings);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Must send some ether to fund the contract");
    }

    function refundContract(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(owner).transfer(amount);
    }

    function dealCard(Player storage player, bool isDealer) internal {
        uint256 randomness;
        if (isDealer) {
            randomness = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, player.hand.length, msg.sender, "dealer")));
        } else {
            randomness = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, player.hand.length, msg.sender, "user")));
        }
        Card memory card = Card(Suit(randomness % 4), Rank(randomness % 13));
        player.hand.push(card);
        uint8[2] memory cardValues = getCardValue(card);

        if (card.rank == Rank.Ace) {
            if (player.score + cardValues[1] <= 21) {
                player.score += cardValues[1];
            } else {
                player.score += cardValues[0];
            }
        } else {
            player.score += cardValues[0];
        }

        uint8 aceCount = 0;
        for (uint i = 0; i < player.hand.length; i++) {
            if (player.hand[i].rank == Rank.Ace) {
                aceCount++;
            }
        }
        while (player.score > 21 && aceCount > 0) {
            player.score -= 10;
            aceCount--;
        }

        emit CardDealt(msg.sender, player.score);
    }

    function getCardValue(Card memory card) internal pure returns (uint8[2] memory) {
        if (card.rank == Rank.Ace) {
            return [1, 11];
        } else if (card.rank >= Rank.Ten) {
            return [10, 10];
        } else {
            uint8 value = uint8(card.rank) + 2;
            return [value, value];
        }
    }

    function startGame() external payable {
        require(msg.value > 0, "Bet amount must be greater than zero");
        delete user.hand;
        delete dealer.hand;
        user.score = 0;
        dealer.score = 0;
        user.bet = msg.value;
        user.hasWon = false;
        gamesPlayed += 1;

        dealCard(user, false);
        dealCard(user, false);
        dealCard(dealer, true);

        emit GameStarted(msg.sender, msg.value);

        if (user.score == 21) {
            determineWinner();
        }
    }

    function hit() external {
        require(user.bet > 0, "Game has not started or no bet placed");
        dealCard(user, false);
        if (user.score > 21) {
            uint256 devFee = user.bet / 100;
            payable(devAddress).transfer(devFee);
            emit GameEnded(msg.sender, false, 0);
            user.score = 0;
            dealer.score = 0;
            user.bet = 0;
            user.hasWon = false;
        }
    }

    function stand() external {
        require(user.bet > 0, "Game has not started or no bet placed");

        while (dealer.score < 17 || (dealer.score < user.score && dealer.score <= 21)) {
            dealCard(dealer, true);
        }
        determineWinner();
    }

    function determineWinner() internal {
        uint256 devFee = user.bet / 100;
        uint256 winnings = user.bet * 2;

        if (user.score > 21 || (dealer.score <= 21 && dealer.score > user.score)) {
            payable(devAddress).transfer(devFee);
            emit GameEnded(msg.sender, false, 0);
            emit WinnerDetermined(msg.sender, false, 0);
        } else if (dealer.score > 21 || user.score > dealer.score) {
            if (address(this).balance >= winnings) {
                user.hasWon = true;
                user.totalWinnings += winnings;
                payable(msg.sender).transfer(winnings);
                emit GameEnded(msg.sender, true, winnings);
                emit WinnerDetermined(msg.sender, true, winnings);
            } else {
                payable(msg.sender).transfer(user.bet);
                emit GameEnded(msg.sender, false, user.bet);
                emit WinnerDetermined(msg.sender, false, user.bet);
            }
        } else {
            payable(msg.sender).transfer(user.bet);
            emit GameEnded(msg.sender, false, user.bet);
            emit WinnerDetermined(msg.sender, false, user.bet);
        }
    }

    function getUserScore() external view returns (uint8) {
        return user.score;
    }

    function getDealerScore() external view returns (uint8) {
        return dealer.score;
    }

    function getTotalWinnings() external view returns (uint256) {
        return user.totalWinnings;
    }

    function getGamesPlayed() external view returns (uint256) {
        return gamesPlayed;
    }

    function getUserHand() external view returns (Card[] memory) {
        return user.hand;
    }

    function getDealerHand() external view returns (Card[] memory) {
        return dealer.hand;
    }
}