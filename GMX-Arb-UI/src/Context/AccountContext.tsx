import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { usePosition } from "./PositionContext";
import { useSocket } from "./SocketContext";

interface AccountInfo {
    balance: {
        GMX: number;
        ByBit: number;
    };
    margin: number;
    total: number;
    realized_pnl: number;
}

interface AccountContextType {
    account: AccountInfo;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {positions} = usePosition();
    const {socket, connected} = useSocket();
    const [account, setAccount] = useState<AccountInfo>({
        balance: {GMX: 0, ByBit: 0},
        margin: 0,
        total: 0,
        realized_pnl: 0
    })
  
    const fetchProfit = useCallback(async () => {
        if (positions.length === 0) {
          return;
        }
        let profit = 0;
        let total = 0;
        positions.forEach(position => {
            if (position.pnl) {
              profit += position.pnl;
            }
            total += position.size_in_asset;
        });
        setAccount((prev) => {
            return {
                ...prev,
                realized_pnl: profit
            }
        });
    }, [positions]);

    const fetchCollateral = useCallback(async () => {
        const backendURL = localStorage.getItem('backendURL');
        Object.keys(account.balance).forEach(async (exchange) => {
            const response = await fetch(`${backendURL}/collateral/${exchange}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAccount((prev) => ({
                ...prev,
                balance: {
                    ...prev.balance,
                    [exchange]: data
                },
            }));
        });
    }, []);

    useEffect(() => {
        if (!connected) {
            return;
        }

        fetchProfit();
        fetchCollateral();
        if (socket) {
            socket.on('trade_logged', fetchProfit);
        }
    }, [socket, connected]);

    return (
        <AccountContext.Provider value={{account: account}}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within a AccountProvider');
    }
    return context;
}