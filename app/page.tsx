"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractInteraction from './components/contract-interaction';
import Header from "./components/header";
import { Text } from "@radix-ui/themes";

export default function Page() {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0] || null);
            });
        }
    }, []);

    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
        } else {
            console.error('MetaMask is not installed');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    return (
        <>
            <Header account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
            <main className="p-4">
                <ContractInteraction account={account} />
            </main>
            <footer className="bg-gray-100 text-black p-4 text-center">

                <Text size={"5"} weight="bold">BLACKJACK. GAME</Text>

                <p>MUST WAIT NETWORK PLEASE!</p>
                <p>IF YOU DON'T SEE ANY ACTION, RELOAD THE PAGE.</p>
                <p>Put an amount of TEA - Start Game - Hit or Stand!</p>
                <p>21 or nearest to 21 against Dealer, wins!</p>
                <p>GOOD LUCK!</p>
                <p>Dealer needs your cup of TEA!</p>


            </footer>
        </>
    );
}