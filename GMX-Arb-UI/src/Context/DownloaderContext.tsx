import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

type OsType = 'mac' | 'windows';

interface OsContextType {
  os: OsType;
  setOs: React.Dispatch<React.SetStateAction<OsType>>;
}

export const OsContext = createContext<OsContextType | null>(null);

interface OsProviderProps {
  children: ReactNode;
}

export const OsProvider: React.FC<OsProviderProps> = ({ children }) => {
  const [os, setOs] = useState<OsType>('windows');

  return (
    <OsContext.Provider value={{ os, setOs }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => {
    const context = useContext(OsContext);
    if (!context) {
      throw new Error('useOs must be used within an OsProvider');
    }
    return context;
};

export const ToggleOS: React.FC = () => {
    const { os, setOs } = useOs();
  
    const handleOsChange = (
        _event: React.MouseEvent<HTMLElement>,
        newOs: OsType | null,
    ) => {
        if (newOs !== null) {
            setOs(newOs);
        }
    };

    return (
        <>
            <Box mb={2}>
                <Typography variant='body1' mb={0.75} gutterBottom>Select your operating system:</Typography>
                <ToggleButtonGroup
                    value={os}
                    exclusive
                    onChange={handleOsChange}
                    aria-label="operating system"
                >
                    <ToggleButton value="windows" aria-label="windows">
                        Windows
                    </ToggleButton>
                    <ToggleButton value="mac" aria-label="mac">
                        Mac
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </>
    );
};