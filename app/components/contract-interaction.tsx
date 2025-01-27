"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from './abi';
import { Box, Button, Container, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import ToastComponent from './toast';

const CONTRACT_ADDRESS = '0x2ec4EBdF37CAeefb2ee4bA8DABa1B077b8928569';

interface ContractInteractionProps {
    account: string | null;
}

const ContractInteraction: React.FC<ContractInteractionProps> = ({ account }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [betAmount, setBetAmount] = useState<string>('');
    const [userScore, setUserScore] = useState<number | null>(null);
    const [dealerScore, setDealerScore] = useState<number | null>(null);
    const [userHand, setUserHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [loadingStart, setLoadingStart] = useState<boolean>(false);
    const [loadingHit, setLoadingHit] = useState<boolean>(false);
    const [loadingStand, setLoadingStand] = useState<boolean>(false);
    const [winnerStatus, setWinnerStatus] = useState<{ hasWon: boolean | null, winnings: number | null }>({ hasWon: null, winnings: null });
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [teaBalance, setTeaBalance] = useState<string>('');
    const [contractBalance, setContractBalance] = useState<string>('');
    const [gameStatus, setGameStatus] = useState<string>(''); // New state for game status


    useEffect(() => {
        if ((window as any).ethereum) {
            const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
            setProvider(web3Provider);
        } else {
            console.error('MetaMask is not installed');
        }
    }, []);

    useEffect(() => {
        if (account && provider) {
            const setupSignerAndContract = async () => {
                const signer = await provider.getSigner();
                setSigner(signer);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                setContract(contract);

                // Listen for GameEnded event
                await contract.on('GameEnded', (player, hasWon, winnings) => {
                    setWinnerStatus({hasWon, winnings: Number(winnings)});
                    setUserScore(null);
                    setDealerScore(null);
                    setUserHand([]);
                    setDealerHand([]);
                    setBetAmount('');
                });

                // Listen for WinnerDetermined event
                await contract.on('WinnerDetermined', (player, hasWon, winnings) => {
                    setWinnerStatus({hasWon, winnings: Number(winnings)});
                });
            };
            setupSignerAndContract();
        }
    }, [account, provider]);

    useEffect(() => {
        const fetchScores = async () => {
            if (contract) {
                const userScore = await contract.getUserScore();
                const dealerScore = await contract.getDealerScore();
                setUserScore(userScore);
                setDealerScore(dealerScore);
            }
        };
        fetchScores();
    }, [contract]);

    const fetchBalances = async () => {
        if (provider && contract) {
            try {
                const balance = await provider.getBalance(account!);
                setTeaBalance(ethers.formatEther(balance));

                const contractAddress = contract.getAddress();
                const contractBal = await provider.getBalance(contractAddress);
                setContractBalance(ethers.formatEther(contractBal));
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        }
    };

    useEffect(() => {

        const fetchAndSetBalances = async () => {
            await fetchBalances();
        };

        fetchAndSetBalances();

        if (contract) {
            const handleEvent = () => {
                fetchBalances();
            };

            contract.on('GameStarted', handleEvent);
            contract.on('CardDealt', handleEvent);
            contract.on('WinnerDetermined', handleEvent);
            contract.on('GameEnded', handleEvent);

            return () => {
                contract.off('GameStarted', handleEvent);
                contract.off('CardDealt', handleEvent);
                contract.off('WinnerDetermined', handleEvent);
                contract.off('GameEnded', handleEvent);
            };
        }
    }, [provider, contract, account]);

    const getCardName = (card: { suit: number, rank: number }) => {
        const suits = ["clubs", "diamonds", "hearts", "spades"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        return `${suits[card.suit]}_${ranks[card.rank]}.png`;
    };

    const handleStartGame = async () => {
        if (contract && signer) {
            setLoadingStart(true);
            setGameStatus('Starting Game...');
            try {
                const tx = await contract.startGame({ value: ethers.parseEther(betAmount) });
                await tx.wait();
                const userScore = await contract.getUserScore();
                const dealerScore = await contract.getDealerScore();
                setUserScore(userScore);
                setDealerScore(dealerScore);
                const userHand = await contract.getUserHand();
                const dealerHand = await contract.getDealerHand();
                setUserHand(userHand.map(getCardName));
                setDealerHand(dealerHand.map(getCardName));
                setGameStatus('Game in Progress');
                fetchBalances();
            } catch (error) {
                setToastMessage('Error starting game: Try again.');
                setToastOpen(true);
                setGameStatus('');
            } finally {
                setLoadingStart(false);
            }
        }
    };

    const handleHit = async () => {
        if (contract && signer) {
            setLoadingHit(true);
            setGameStatus('Dealing Card...');
            try {
                const tx = await contract.hit();
                await tx.wait();
                setToastMessage('Card dealt successfully');
                setToastOpen(true);
                const userScore = await contract.getUserScore();
                if (userScore > 21) {
                    setToastMessage('Busted! You lost!');
                    setToastOpen(true);
                    setGameStatus('Game Ended');
                }
                setUserScore(userScore);
                const userHand = await contract.getUserHand();
                setUserHand(userHand.map(getCardName));
                setGameStatus('Game in Progress');
                fetchBalances();
            } catch (error) {
                setToastMessage('Error hitting: Try again.');
                setToastOpen(true);
                setGameStatus('');
            } finally {
                setLoadingHit(false);
            }
        }
    };

    const handleStand = async () => {
        if (contract && signer) {
            setLoadingStand(true);
            setGameStatus('Standing...');
            try {
                const tx = await contract.stand();
                await tx.wait();
                setToastMessage('Stand successful. Good luck!');
                setToastOpen(true);
                const dealerScore = await contract.getDealerScore();
                setDealerScore(dealerScore);
                const dealerHand = await contract.getDealerHand();
                setDealerHand(dealerHand.map(getCardName));
                if (dealerScore > 21) {
                    setToastMessage('Dealer busted! You won!');
                    setToastOpen(true);
                    setGameStatus('Game Ended');
                }
                if (dealerScore >= 17 && dealerScore <= 21 && dealerScore > userScore) {
                    setToastMessage('Dealer wins!');
                    setToastOpen(true);
                    setGameStatus('Game Ended');
                }
                setGameStatus('Game Ended');
                fetchBalances();
            } catch (error) {
                setToastMessage('Error standing: Try again.');
                setToastOpen(true);
                setGameStatus('');
            } finally {
                setLoadingStand(false);
            }
        }
    };

    return (
        <Flex direction={"column"}>
            {account ? (
                <>
                    <Flex direction="row" justify={"between"} className={"mb-3"}>
                        <Box className={"p-2 rounded-lg bg-gray-100"}>Your Balance: {teaBalance} TEA</Box>
                        <Box className={"p-2 rounded-lg bg-yellow-100"}>Dealer Balance: {contractBalance} TEA</Box>
                        {gameStatus && (
                            <Box className={"p-2 rounded-lg bg-orange-100"}>
                                {gameStatus}
                            </Box>
                        )}
                    </Flex>

                    <Grid gap={"3"}>
                        <Box p={"4"} className={"border-b border-b-gray-200 rounded-xl bg-gray-50"}>
                            <Container size={"3"} gridArea={"2"}>
                                <TextField.Root
                                    placeholder="Bet amount (in TEA)"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                >
                                </TextField.Root>
                                <Button variant={"surface"} color={"grass"} onClick={handleStartGame} disabled={loadingStart}>
                                    {loadingStart ? 'Starting Game...' : 'Start Game'}
                                </Button>
                                <Button variant={"surface"} color={"blue"} onClick={handleHit} disabled={loadingHit}>
                                    {loadingHit ? 'Hitting...' : 'Hit'}
                                </Button>
                                <Button variant={"surface"} color={"orange"} onClick={handleStand} disabled={loadingStand}>
                                    {loadingStand ? 'Standing...' : 'Stand'}
                                </Button>
                            </Container>
                        </Box>

                        {winnerStatus.hasWon !== null && (
                            <Box p={"4"} className={"border-b border-b-gray-200 rounded-xl bg-gray-50"}>
                                <Text>
                                    {winnerStatus.hasWon ? `You won ${winnerStatus.winnings} TEA!` : 'You lost!'}
                                </Text>
                            </Box>
                        )}

                        <Box p={"4"} className={"border-b border-b-gray-200 rounded-xl bg-gray-50 text-center"}>
                            <Text className={"bold mb-3"}>Dealer Hand: {dealerScore !== null ? dealerScore : 'N/A'} points</Text>
                            <Flex justify={"center"} align={"center"}>
                                {dealerHand.map((card, index) => (
                                    <div key={index} className={"rounded-xl bg-black w-32 p-2 mr-3"}>
                                        <img width={"120"} src={`/cards/${card}`} alt={`Card ${card}`} />
                                    </div>
                                ))}
                            </Flex>
                        </Box>

                        <Box p={"4"} className={"border-b border-b-gray-200 rounded-xl bg-gray-50 text-center"}>
                            <Text>Your Hand: {userScore !== null ? userScore : 'N/A'} points</Text>
                            <Flex justify={"center"} align={"center"}>
                                {userHand.map((card, index) => (
                                    <div key={index} className={"rounded-xl bg-black w-32 p-2 mr-3"}>
                                        <img width={"120"} src={`/cards/${card}`} alt={`Card ${card}`} />
                                    </div>
                                ))}
                            </Flex>
                        </Box>
                    </Grid>
                </>
            ) : (
                <Text size={"3"} color={"teal"}>Please connect wallet first!</Text>
            )}
            <ToastComponent open={toastOpen} onOpenChange={setToastOpen} message={toastMessage} />
        </Flex>
    );
};

export default ContractInteraction;