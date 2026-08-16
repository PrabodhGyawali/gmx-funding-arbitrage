import {createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
    connected: boolean;
    backendUrl: string;
    setBackendUrl: (url: string) => void;
};


const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};



interface SocketContextProviderProps {
    children: React.ReactNode;
}
export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [backendUrl, setBackendUrl] = useState<string>(() => 
        localStorage.getItem('backendURL') || 'http://localhost:6969'
    );


    useEffect(() => {
        if (socket) {
            socket.disconnect();
        }

        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => setConnected(true));
        newSocket.on('disconnect', () => setConnected(false));

        return () => {
            newSocket.disconnect();
        };
    }, [backendUrl]);

    return (
        <SocketContext.Provider value={{ socket, connected, backendUrl, setBackendUrl}}>
            {children}
        </SocketContext.Provider>
    )
};
