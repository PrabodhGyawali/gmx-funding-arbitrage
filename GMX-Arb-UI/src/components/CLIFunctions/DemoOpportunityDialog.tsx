import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, styled } from '@mui/material';
import { useSocket } from '../../Context/SocketContext';

// Define the TradingOpportunity type
interface TradingOpportunity {
  long_exchange: string;
  short_exchange: string;
  symbol: string;
  long_exchange_funding_rate_8hr: number;
  short_exchange_funding_rate_8hr: number;
  long_exchange_skew_usd: number;
  short_exchange_skew_usd: number;
  block_number: number;
  trade_duration_estimate: number;
  total_profit_usd: number;
  long_exchange_profit_usd: number;
  short_exchange_profit_usd: number;
}

// Styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
        '&.header': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        },
        '&.positive': {
        color: theme.palette.success.main,
        },
        '&.negative': {
        color: theme.palette.error.main,
        },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        },
        '&:hover': {
        backgroundColor: theme.palette.action.selected,
        },
    }));

function DemoOppDialog(): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);
    const [trades, setTrades] = useState<TradingOpportunity[]>([]);
    const { socket, connected } = useSocket();

    const profitableTrades = useMemo(() => {
        return trades.filter(trade => trade.total_profit_usd > 0); 
    }, [trades]);

    useEffect(() => {
        if (connected && socket) {
        socket.on('demo_opportunity', handleDemoOpportunity);

        return () => {
            socket.off('demo_opportunity', handleDemoOpportunity);
        };
        }
    }, [connected, socket]);

    async function fetchDemoOpportunities(): Promise<TradingOpportunity[]> {
        const backendUrl = localStorage.getItem('backendURL');

        if (!backendUrl) {throw new Error('Backend URL not found in localStorage');}

        try {
            const response = await fetch(`${backendUrl}/get-demo`);
            
            if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
            
            const data: TradingOpportunity[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching demo opportunities:', error);
            throw error;
        }
    }

  const handleDemoOpportunity = async (): Promise<void> => {
    try {
      const demoOpp = await fetchDemoOpportunities();
      setTrades(demoOpp);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching demo opportunities:', error);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'common.white' }} gutterBottom>
        Profitable Trading Opportunities
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        {profitableTrades.length > 0 ? (
          <>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell className="header">Symbol</StyledTableCell>
                    <StyledTableCell className="header">Long Exchange</StyledTableCell>
                    <StyledTableCell className="header">Short Exchange</StyledTableCell>
                    <StyledTableCell className="header">Long Funding Rate (8hr)</StyledTableCell>
                    <StyledTableCell className="header">Short Funding Rate (8hr)</StyledTableCell>
                    <StyledTableCell className="header">Long Skew (USD)</StyledTableCell>
                    <StyledTableCell className="header">Short Skew (USD)</StyledTableCell>
                    <StyledTableCell className="header">Total Profit (USD)</StyledTableCell>
                    <StyledTableCell className="header">Long Profit (USD)</StyledTableCell>
                    <StyledTableCell className="header">Short Profit (USD)</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profitableTrades.map((trade, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{trade.symbol}</StyledTableCell>
                      <StyledTableCell>{trade.long_exchange}</StyledTableCell>
                      <StyledTableCell>{trade.short_exchange}</StyledTableCell>
                      <StyledTableCell className={trade.long_exchange_funding_rate_8hr >= 0 ? 'positive' : 'negative'}>
                        {formatNumber(trade.long_exchange_funding_rate_8hr)}
                      </StyledTableCell>
                      <StyledTableCell className={trade.short_exchange_funding_rate_8hr >= 0 ? 'positive' : 'negative'}>
                        {formatNumber(trade.short_exchange_funding_rate_8hr)}
                      </StyledTableCell>
                      <StyledTableCell>{formatNumber(trade.long_exchange_skew_usd)}</StyledTableCell>
                      <StyledTableCell>{formatNumber(trade.short_exchange_skew_usd)}</StyledTableCell>
                      <StyledTableCell className={trade.total_profit_usd >= 0 ? 'positive' : 'negative'}>
                        {formatNumber(trade.total_profit_usd)}
                      </StyledTableCell>
                      <StyledTableCell className={trade.long_exchange_profit_usd >= 0 ? 'positive' : 'negative'}>
                        {formatNumber(trade.long_exchange_profit_usd)}
                      </StyledTableCell>
                      <StyledTableCell className={trade.short_exchange_profit_usd >= 0 ? 'positive' : 'negative'}>
                        {formatNumber(trade.short_exchange_profit_usd)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ marginTop: 2, display: 'block', color: 'text.secondary' }}>
              Block Number: {profitableTrades[0]?.block_number}, Trade Duration Estimate: {profitableTrades[0]?.trade_duration_estimate} hours
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No profitable trading opportunities available at the moment.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DemoOppDialog;