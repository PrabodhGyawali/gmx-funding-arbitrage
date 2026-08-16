export interface Position {
    id: number;
    strategy_execution_id: string;
    exchange: string;
    symbol: string;
    side: string;
    is_hedge: boolean;
    size_in_asset: number;
    liquidation_price: number;
    open_close: string;
    open_time: Date;
    close_time?: Date;
    pnl?: number;
    accrued_funding?: number;
    close_reason?: string;
}