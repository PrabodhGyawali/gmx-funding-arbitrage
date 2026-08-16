import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useSocket } from "./SocketContext";

interface BotContextType {
  isRunning: boolean;
  isDemoRunning: boolean;
  isTradeExecuting: boolean;
  serverRun: () => void;
  serverStop: () => void;
  runDemo: () => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const useBotContext = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
};

interface BotProviderProps {
  children: ReactNode;
}

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
  const { connected } = useSocket();
  const [isRunning, setIsRunning] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isTradeExecuting, setIsTradeExecuting] = useState(false);

  const serverDemo = () => {
    const backendUrl = localStorage.getItem('backendURL');
    fetch(`${backendUrl}/demo`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(error => {
        alert(`Error: ${error}`);
      });
  };

  const serverStop = () => {
    console.log('Stopping bot');
    const backendUrl = localStorage.getItem('backendURL');
    fetch(`${backendUrl}/stop`, {
      method: 'POST',
    }).then(response => {
      if (response.ok) {
        setIsRunning(false);
      }
      console.log(response);
    })
      .catch(error => {
        alert(`serverStop Error: ', ${error}`);
      });
  };

  const serverRun = () => {
    if (isRunning) {
      serverStop();
    } else {
      const backendUrl = localStorage.getItem('backendURL');
      fetch(`${backendUrl}/run`, {
        method: 'POST',
      }).then(response => {
        if (response.ok) {
          setIsRunning(true);
        } else {
          alert(`Error starting bot: ${response.statusText}`);
        }
      })
        .catch(error => {
          alert(`serverRun Error: ', ${error}`);
        });
    }
  };

  const runDemo = () => {
    setIsDemoRunning(true);
    serverDemo();
    // Simulate demo running for 5 seconds
    setTimeout(() => {
      setIsDemoRunning(false);
    }, 3000);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkBotStatus = () => {
      const backendUrl = localStorage.getItem('backendURL');
      fetch(`${backendUrl}/status`)
        .then(response => response.json())
        .then(data => {
          setIsRunning(data.is_running);
          setIsDemoRunning(data.demo_running);
          setIsTradeExecuting(data.is_executing_trade);
        })
        .catch(error => {
          console.error('Error checking bot status:', error);
        });
    };

    if (connected) {
      // Initial check
      checkBotStatus();
      // Set up polling every 5 seconds
      intervalId = setInterval(checkBotStatus, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connected]);

  const value = {
    isRunning,
    isDemoRunning,
    isTradeExecuting,
    serverRun,
    serverStop,
    runDemo,
  };

  return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
};