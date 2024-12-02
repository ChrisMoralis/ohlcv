import axios from 'axios';

export default async function handler(req, res) {
  const { tokenAddress } = req.query;
  // Extract chain from the query
  const { chain } = req.query; 

  try {
    const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/pairs`, {
      headers: {
        "accept": "application/json",
        "X-API-Key": process.env.NEXT_MORALIS_API_KEY,
      },
      params: {
        chain,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    //eslint-disable-next-line
    console.error("Error fetching token metadata:", error.message);
    return res.status(500).json({ message: 'Error fetching token metadata' });
  }
}
