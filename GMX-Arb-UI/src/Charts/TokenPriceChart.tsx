import { useEffect, useRef, useState, memo } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';


enum Token {
    BTC = "BINANCE:BTCUSD",
    ETH = "BINANCE:ETHUSD",
    SOL = "BINANCE:SOLUSD",
    ARB = "BINANCE:ARBUSDC",
    DOGE = "BINANCE:DOGEUSD",
    AVAX = "BINANCE:AVAXUSD",
    NEAR = "BINANCE:NEARUSD",
    AAVE = "BINANCE:AAVEUSD",
    ATOM = "BINANCE:ATOMUSD",
    LINK = "BINANCE:LINKUSD",
    UNI = "BINANCE:UNIUSD",
    LTC = "BINANCE:LTCUSD",
    OP = "BINANCE:OPUSD",
    GMX = "BINANCE:GMXUSD"
}

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<Token>(Token.ETH);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${token}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    }
  }, [token]);

  const handleTokenChange = (event: SelectChangeEvent) => {
    setToken(event.target.value as Token);
  };

  return (
    <div style={{height: '50%'}}>
        <Select
          labelId="token-select-label"
          id="token-select"
          value={token}
          onChange={handleTokenChange}
          label="Token"
        >
          {Object.entries(Token).map(([key, value]) => (
            <MenuItem key={key} value={value}>{key}</MenuItem>
          ))}
        </Select>
      <div className="tradingview-widget-container" ref={container} style={{ height: "900px", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);