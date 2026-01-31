import { useNavigate, useParams } from 'react-router';
import { fetchChartData, fetchCoinData } from '../api/coinGecko';
import { useEffect, useState } from 'react';
import { formatMarketCap, formatPrice } from '../utils/formatter';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Footer } from '../components/Footer';

export const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (e) {
      console.error('Error fetching data: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id);

      const formattedData = data.prices.map(price => ({
        time: new Date(price[0]).toLocaleDateString('en-Us', {
          month: 'short',
          day: 'numeric',
        }),
        price: price[1].toFixed(2),
      }));
      setChartData(formattedData);
    } catch (e) {
      console.error('Error fetching data: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загружаем данные...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Монета не найдена</p>
          <button onClick={() => navigate('/')}>Назад</button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Крипто Трекер</h1>
            <p>Курс криптовалют и рыночные данные в реальном времени</p>
          </div>
          <button onClick={() => navigate('/')} className="back-button">
            ← Обратно к списку
          </button>
        </div>
      </header>

      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank">Ранг #{coin.market_data.market_cap_rank}</span>
        </div>

        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>

            <span
              className={`change-badge ${isPositive ? 'positive' : 'negative'}`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div>
            <div className="price-ranges">
              <div className="price-range">
                <span className="range-label">Суточный максимум</span>
                <span className="range-value">
                  {formatPrice(coin.market_data.high_24h.usd)}
                </span>
              </div>
              <div className="price-range">
                <span className="range-label">Суточный минимум</span>
                <span className="range-value">
                  {formatPrice(coin.market_data.low_24h.usd)}
                </span>
              </div>
            </div>
          </div>
          <div className="chart-section">
            <h3>Диаграмма Курса (7 дней)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 40, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#e0e0e0',
                  }}
                />
                <YAxis
                  dataKey="price"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  domain={['auto', 'auto']}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#ADD8E6"
                  strokeWith={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Капитализация</span>
              <span className="stat-value">
                ${formatMarketCap(coin.market_data.market_cap.usd)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Объем торгов</span>
              <span className="stat-value">
                ${formatMarketCap(coin.market_data.total_volume.usd)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Монет в обращении</span>
              <span className="stat-value">
                {coin.market_data.circulating_supply?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Общее количество монет</span>
              <span className="stat-value">
                {coin.market_data.total_supply?.toLocaleString() ||
                  'Нет данных'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
