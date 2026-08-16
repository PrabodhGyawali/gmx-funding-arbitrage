export interface ExchangeConfig {
    bybit: {
        apiKey: string;
        apiSecret: string;
        enabled: boolean;
    };
    binance: {
        apiKey: string;
        apiSecret: string;
        enabled: boolean;
    };
}


export interface BotConfig {
    max_allowable_percentage_away_from_liquidation_price: number;
    trade_leverage: number;
    percentage_capital_per_trade: number;
    default_trade_duration_hours: number;
    default_trade_size_usd: number;
}


export enum NetworkType {
    Mainnet = 42161,
    Sepolia = 421614,
  }

export interface WalletConfig {
    address: string;
    arbitrum_rpc: string;
    base_rpc: string;
    network: NetworkType | null;
}

export interface UserData {
    walletSettings: WalletConfig;
    exchangeSettings: ExchangeConfig;
    botSettings: BotConfig;
}
