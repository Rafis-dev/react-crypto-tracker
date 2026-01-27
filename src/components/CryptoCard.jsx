import { formatPrice } from '../utils/formatter';

export const CryptoCard = ({ crypto }) => {
  return (
    <div className="crypto-card">
      <div className="crypto-header">
        <div className="crypto-info">
          <img src={crypto.image} alt={crypto.name} />
          <div>
            <h3>{crypto.name}</h3>
            <p className="symbol">{crypto.symbol.toUpperCase()}</p>
            <span className="rank">#{crypto.market_cap_rank}</span>
          </div>
        </div>
      </div>

      <div className="crypto-price">
        <p className="price">{formatPrice(crypto.current_price)}</p>
      </div>
    </div>
  );
};
