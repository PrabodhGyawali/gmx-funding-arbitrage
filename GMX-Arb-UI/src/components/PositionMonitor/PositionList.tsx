import React, { useState, useEffect, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
  Tabs,
  Tab,
  Typography,
  styled,
  CircularProgress,
  Button, 
} from '@mui/material';
import { usePosition } from '../../Context/PositionContext';
import { Position } from '../Settings/Position';
import ClosePositionDialog from './ClosePositionDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  borderBottom: `1px solid ${theme.palette.grey[700]}`,
}));

const StyledTableRow = styled(TableRow)<{ isEvenGroup: boolean }>(({ theme, isEvenGroup }) => ({
  '&:hover': {
    backgroundColor: theme.palette.grey[800],
  },
  backgroundColor: isEvenGroup ? theme.palette.grey[900] : theme.palette.grey[800],
}));

const TradingPositionsTable: React.FC = () => {
  const { positions, loading, error, closePosition, closePositionPair, fetchPositions } = usePosition();
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const groupedPositions = useMemo(() => {
    const grouped = positions.reduce((acc, position) => {
      if (!acc[position.strategy_execution_id]) {
        acc[position.strategy_execution_id] = [];
      }
      acc[position.strategy_execution_id].push(position);
      return acc;
    }, {} as Record<string, Position[]>);

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [positions]);

  const filteredGroupedPositions = groupedPositions.filter(([_, group]) => 
    group.some(position => tabValue === 0 ? position.open_close === 'open' : position.open_close === 'close')
  );

  const openPositionsCount = positions.filter(p => p.open_close === 'open').length;
  const closedPositionsCount = positions.filter(p => p.open_close === 'close').length;

  if (loading) {
    return (
      <Paper sx={{ width: '100%', backgroundColor: '#1e222d', display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: '100%', backgroundColor: '#1e222d', padding: '20px' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  const handleCloseButtonClick = (position: Position) => {
    setSelectedPosition(position);
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPosition(null);
  }

  const handleClosePosition = (closeEntirePair: boolean) => {
    if (selectedPosition) {
      if (closeEntirePair) {
        // TODO: Check whether best to use symbol or strategy_execution_id
        closePositionPair(selectedPosition.symbol, selectedPosition.strategy_execution_id);
      } else {
        closePosition(selectedPosition.id);
      }
    }
    handleDialogClose();
  };

  const getOtherPosition = async (strategyExecutionId: string): Promise<Position | null> => {
    const otherPosition = positions.find(
      p => p.strategy_execution_id === strategyExecutionId && p.id !== selectedPosition?.id
    );
    return otherPosition || null;
  };

  return (
    <Paper sx={{ width: '100%', backgroundColor: '#1e222d' }}>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => handleTabChange(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            color: 'white',
            opacity: 0.7,
            '&.Mui-selected': {
              color: 'white',
              opacity: 1,
            },
          },
        }}
      >
        <Tab label={`Open (${openPositionsCount})`} />
        <Tab label={`Closed (${closedPositionsCount})`} />
      </Tabs>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Symbol</StyledTableCell>
              <StyledTableCell>Strategy</StyledTableCell>
              <StyledTableCell>Side</StyledTableCell>
              <StyledTableCell>Size</StyledTableCell>
              <StyledTableCell>Liq Price</StyledTableCell>
              {tabValue === 0 && <>
                <StyledTableCell>Open Time</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </>}
              {tabValue === 1 && (
                <>
                  <StyledTableCell>Close Time</StyledTableCell>
                  <StyledTableCell>PNL</StyledTableCell>
                  <StyledTableCell>Accrued Funding</StyledTableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroupedPositions.length === 0 ? (
              <StyledTableRow isEvenGroup={false}>
                <StyledTableCell colSpan={tabValue === 0 ? 12 : 14} align="center">
                  <Typography>You have no {tabValue === 0 ? 'open' : 'closed'} positions</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredGroupedPositions.map(([strategyId, group], groupIndex) => (
                <React.Fragment key={strategyId}>
                  {group
                    .filter((position) => tabValue === 0 ? position.open_close === 'open' : position.open_close === 'close')
                    .map((position) => (
                      <StyledTableRow key={position.id} isEvenGroup={groupIndex % 2 === 0}>
                        <StyledTableCell>{position.symbol}</StyledTableCell>
                        <StyledTableCell>{position.strategy_execution_id}</StyledTableCell>
                        <StyledTableCell>{position.side}</StyledTableCell>
                        <StyledTableCell>{position.size_in_asset}</StyledTableCell>
                        <StyledTableCell>{position.liquidation_price}</StyledTableCell>
                        {tabValue === 0 && (
                            <>
                                <StyledTableCell>{position.open_time.toLocaleString()}</StyledTableCell>
                                <StyledTableCell>
                                    <Button sx={{fontWeight:800}} onClick={() => handleCloseButtonClick(position)}>Close</Button>
                                </StyledTableCell>
                            </>
                        )}
                        {tabValue === 1 && (
                          <>
                            <StyledTableCell>{position.close_time?.toLocaleString()}</StyledTableCell>
                            <StyledTableCell>{position.pnl}</StyledTableCell>
                            <StyledTableCell>{position.accrued_funding}</StyledTableCell>
                          </>
                        )}
                      </StyledTableRow>
                    ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ClosePositionDialog 
        open={dialogOpen} 
        position={selectedPosition} 
        onClose={handleDialogClose} 
        onClosePosition={handleClosePosition}
        getOtherPosition={getOtherPosition}
      />
    </Paper>
  );
};

export default TradingPositionsTable;