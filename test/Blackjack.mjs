import * as chai from "chai";
import hardhat from "hardhat";
import { solidity } from "ethereum-waffle";
import chaiAsPromised from 'chai-as-promised';

chai.use(solidity);
chai.use(chaiAsPromised);

const { ethers } = hardhat;
const { expect } = chai;

describe("Blackjack", function () {
    let Blackjack, blackjack, owner, addr1, addr2, addr3;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        Blackjack = await ethers.getContractFactory("Blackjack");
        blackjack = await Blackjack.deploy(owner.address);
        await blackjack.deployed();
    });

    it("should start a game", async function () {
        await expect(blackjack.connect(addr1).startGame({ value: ethers.utils.parseEther("1") }))
            .to.emit(blackjack, "GameStarted")
            .withArgs(addr1.address, ethers.utils.parseEther("1"));
    });

    it("should deal a card and lose", async function () {
        await blackjack.connect(addr1).startGame({ value: ethers.utils.parseEther("1") });
        await blackjack.connect(addr1).hit();
        await blackjack.connect(addr1).stand();
        const gameEndedEvent = await blackjack.queryFilter("GameEnded");
        expect(gameEndedEvent[0].args.hasWon).to.be.false;
    });


    it("should end the game", async function () {
        await blackjack.connect(addr1).startGame({ value: ethers.utils.parseEther("1") });
        await blackjack.connect(addr1).stand();
        const gameEndedEvent = await blackjack.queryFilter("GameEnded");
        expect(gameEndedEvent.length).to.be.greaterThan(0);
    });

    it("should request winnings", async function () {
        await blackjack.connect(addr1).startGame({ value: ethers.utils.parseEther("1") });
        await blackjack.connect(addr1).stand();
        const gameEndedEvent = await blackjack.queryFilter("GameEnded");
        if (gameEndedEvent[0].args.hasWon) {
            await expect(blackjack.connect(addr1).requestWinnings())
                .to.changeEtherBalance(addr1, ethers.utils.parseEther("2"));
        }
    });
});