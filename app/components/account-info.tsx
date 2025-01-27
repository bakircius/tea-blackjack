"use client";

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {Box, Flex, Text} from "@radix-ui/themes";

interface AccountInfoProps {
    provider: ethers.BrowserProvider | null;
    contract: ethers.Contract | null;
    address: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ provider, contract, address }) => {
    const [teaBalance, setTeaBalance] = useState<string>('');
    const [contractBalance, setContractBalance] = useState<string>('');

    const fetchBalances = async () => {
        if (provider && contract) {
            try {
                const balance = await provider.getBalance(address);
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
        fetchBalances();

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
    }, [provider, contract, address]);

    return (
            <Flex direction="row" gap={"3"}>
                <Box className={"p-4 mx-4 rounded-lg"}>Your Balance: {teaBalance} TEA</Box>
                <Box className={"p-4 mx-4 rounded-lg"}>Dealer Balance: {contractBalance} TEA</Box>
            </Flex>
    );
};

export default AccountInfo;