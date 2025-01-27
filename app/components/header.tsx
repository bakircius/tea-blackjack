"use client";

import React from 'react';
import {Button, Heading} from "@radix-ui/themes";

interface HeaderProps {
    account: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ account, connectWallet, disconnectWallet }) => {
    return (
        <header className="bg-gray-100 text-gray-800 p-4 flex justify-between items-center">
            <div className="logo">
                <Heading>TEA BLACKJACK. GAME</Heading>
            </div>
            <div>
                {account ? (
                    <div className="flex items-center">
                        <p className="mr-4">Connected: {account.substring(0,4) + ".." + account.substring(account.length-2, account.length)}</p>
                        <Button variant={"soft"} color={"red"} onClick={disconnectWallet}>
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <Button variant={"soft"} color={"green"} onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;