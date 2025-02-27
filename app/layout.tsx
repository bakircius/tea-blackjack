import React from 'react';
import './globals.css';
import { Theme } from "@radix-ui/themes";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Theme>
                    {children}
                </Theme>
            </body>
        </html>
    )
}