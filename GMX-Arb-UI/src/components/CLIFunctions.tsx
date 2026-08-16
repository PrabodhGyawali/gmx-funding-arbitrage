import { Box, Button } from "@mui/material";
// import DeploySection from "./CLIFunctions/DeploySection";
import { useState, useEffect } from "react";
import { useSocket } from "../Context/SocketContext";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import DemoOppDialog from "./CLIFunctions/DemoOpportunityDialog"
import TradeIcon from '@mui/icons-material/ShowChart';
import { useBotContext } from "../Context/BotContext";

// Styles
const sxButtons = {width: '5em', fontSize: '1.5em', position: 'relative'};

const textAnimation = keyframes`
  0% { content: ""; }
  33% { content: "."; }
  66% { content: ".."; }
  100% { content: "..."; }
`;

const AnimatedButton = styled(Button)`
  &.running {
    background-color: #4caf50;
    &::after {
      content: "Running";
      animation: ${textAnimation} 1.5s infinite;
    }
  }
  &.demo-running {
    background-color: #ff9800;
    &::after {
      content: "Demo";
      animation: ${textAnimation} 1.5s infinite;
    }
  }
`;

export const Run = () => {
    const { isRunning, isDemoRunning, isTradeExecuting, serverRun, runDemo } = useBotContext();
    const { connected } = useSocket();

    const [buttonText, setButtonText] = useState("Run");
    const [demoButtonText, setDemoButtonText] = useState("Demo");

    
    useEffect(() => {
        if (isRunning) {
            setButtonText("");
        } else {
            setButtonText("Run");
        }
    }, [isRunning]);

    useEffect(() => {
        if (isDemoRunning) {
            setDemoButtonText("");
        } else {
            setDemoButtonText("Demo");
        }
    }, [isDemoRunning]);


    return (
        <Box sx={{display: 'flex', gap: '1em', justifyContent: 'space-around', width: '100%'}}>
            <AnimatedButton 
                sx={sxButtons} 
                color="primary" 
                variant="contained" 
                onClick={serverRun}
                disabled={!connected}   
                className={isRunning ? 'running' : ''}
            >
                {buttonText}
                {isTradeExecuting && (
                    <TradeIcon 
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                        }}
                    />
                )}
            </AnimatedButton>
            <AnimatedButton 
                sx={sxButtons} 
                color="secondary" 
                variant="contained" 
                onClick={runDemo}
                disabled={!connected}
                className={isDemoRunning ? 'demo-running' : ''}
            >
                {demoButtonText}
            </AnimatedButton>
            <DemoOppDialog />
        </Box>
    );
}