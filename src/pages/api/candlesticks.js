import axios from 'axios';

const timeframeMapping = {
  604800: '1w',
  86400: '1d',
  3600: '1h',
  60: '1m'
}

// eslint-disable-next-line
export default async function handler(req, res) {

  const { chainId, pairAddress, fromTimestamp, toTimestamp, limit, span } = req.query;
  const theTimeframeChosen = timeframeMapping[span];

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const todayDate = new Date();

  // Convert timestamps to numbers
  let adjustedFromTimestamp = Number(fromTimestamp);
  let adjustedToTimestamp = Number(toTimestamp);

  // Check if timestamps are valid
  if (isNaN(adjustedFromTimestamp) || adjustedFromTimestamp <= 0) {
    return res.status(400).json({ message: 'Invalid fromTimestamp provided' });
  }

  if (isNaN(adjustedToTimestamp) || adjustedToTimestamp <= 0) {
    return res.status(400).json({ message: 'Invalid toTimestamp provided' });
  }

  // Ensure toTimestamp is not in the future
  if (adjustedToTimestamp > currentTimestamp) {
    adjustedToTimestamp = currentTimestamp;
  }

  // Ensure fromTimestamp is before toTimestamp
  if (adjustedFromTimestamp > adjustedToTimestamp) {
    adjustedFromTimestamp = adjustedToTimestamp - 24 * 3600; 
  }

  const toTimestampDate = new Date(adjustedToTimestamp * 1000);
  const isToday =
    toTimestampDate.getDate() === todayDate.getDate() &&
    toTimestampDate.getMonth() === todayDate.getMonth() &&
    toTimestampDate.getFullYear() === todayDate.getFullYear();

    // eslint-disable-next-line
    console.log('isToday:', isToday);
  // Prepare the request parameters using regular timestamps divided by 1000
  const params = {
    chain: chainId,
    timeframe: theTimeframeChosen,
    currency: 'usd', 
    fromDate: adjustedFromTimestamp, 
    toDate: adjustedToTimestamp, 
    limit,
  };

  const url = `https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/ohlcv`;
  // Attempt to fetch data, with retries
  let successful = false;
  let attempts = 0;
  const MAXATTEMPTS = 3; 
  let rawResponse = null;

  // What is the best way to get the most 'recent candle' for a given timeframe? 
  if (isToday) {
    // Maybe some adjustment is needed here
    // I'll adjust it to one hour less and introduce retries if it fails
    adjustedToTimestamp -= 3600; 
  }

  while (!successful && attempts < MAXATTEMPTS) {
    try {
      
      // eslint-disable-next-line
      const moralisResponse = await axios.get(url, {
        params,
        headers: {
          "X-API-Key": process.env.NEXT_MORALIS_API_KEY,
        },
      });
      rawResponse = moralisResponse.data; 
      successful = true; 
      // eslint-disable-next-line
      console.log(`Got it! On attempt ${attempts + 1} @ ${new Date()}`);
    } catch (error) {
      // eslint-disable-next-line
      console.error(`Error on attempt ${attempts + 1}:`, error.message);
      attempts++;

      // Decrement the to_date by 3600 seconds for the next attempt
      adjustedToTimestamp -= 3600; 
      params.toDate = adjustedToTimestamp; 

      if (attempts >= MAXATTEMPTS) {
        return res.status(500).json({ message: 'Could not fetch data from Moralis API' });
      }
    }
  }

  // Process raw data into candlestick format
  const candlestickData = rawResponse.result.map((item) => ({
    time: new Date(item.timestamp).getTime() / 1000, 
    open: parseFloat(item.open),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    close: parseFloat(item.close),
    volume: parseFloat(item.volume),
  }));

  // Send both raw and processed data in the response
  return res.status(200).json({ candlestickData, rawData: rawResponse });
}
