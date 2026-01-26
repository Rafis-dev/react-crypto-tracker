'CG-sSYrhuagWv3xNzB8aqvfpgUz';
'https://api.coingecko.com/api/v3';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptos = async () => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
  );

  if (!response.ok) {
    throw new Error('Failes to fetched cryptos');
  }

  return response.json();
};
