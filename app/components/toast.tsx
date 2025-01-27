import React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Box, Text } from '@radix-ui/themes';

interface ToastProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: string;
}

const ToastComponent: React.FC<ToastProps> = ({ open, onOpenChange, message }) => {
    return (
        <Toast.Provider>
            <Toast.Root open={open} onOpenChange={onOpenChange} className="bg-red-500 text-white p-4 rounded-md">
                <Box>
                    <Text>{message}</Text>
                </Box>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
        </Toast.Provider>
    );
};

export default ToastComponent;