import { useEffect, useState } from 'react';
import { fetchCryptos } from '../api/coinGecko';
import { CryptoCard } from '../components/CryptoCard';

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
      setCryptoList(data);
    } catch (e) {
      console.error('Error fetching data: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className="crypto-container">
          {cryptoList.map((crypto, key) => {
            return <CryptoCard crypto={crypto} key={key} />;
          })}
        </div>
      )}
    </div>
  );
};
