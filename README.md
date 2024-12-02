
# **OHLCV Charting Tool**

A web application built with **Next.js** and **Chakra UI** that fetches and visualizes OHLCV (Open, High, Low, Close, Volume) candlestick chart data. The tool supports adding custom trading pairs, searching for a pair address with a given token address, date filtering, and adding basic charting options like a moving average combo.

Here is a link to a similar app: [Candlesticks Demo](https://success-tools.vercel.app/demo/candlesticksv2)
- **API Key required** to use the demo app, this is different to the repo below
---

## **Features**

- **Advanced Candlestick Data for ANY ERC20 or Solana token pair**: Moralis OHLCV API for historical pricing data served as OHLCV
- **Candlestick Charting**: Visualize OHLCV data using `lightweight-charts`.
- **Custom Trading Pairs**: Moralis Token Pairs API to fetch any custom token pairs.
- **Token Metadata Search**:  Moralis ERC20 Metadata API to view metadata for custom token pairs.
- **Responsive UI**: Built with Chakra UI for a modern, mobile-friendly interface.

---

## **Requirements**

1. **Moralis API Key**:
   - Sign up or log in at [Moralis](https://developers.moralis.com/).
   - Or if you have an account, visit [API Keys](https://admin.moralis.com/api-keys) in your admin dashboard
   - Generate or fetch your API key from the dashboard.

2. **Environment Variables**:
   - Later you will need to create a `.env.local` file in the root directory of your project.
   - Add the following environment variables:
     ```env
     NEXT_PUBLIC_MORALIS_API_KEY=your-moralis-api-key
     ```
   - Replace `your-moralis-api-key` with your actual API key.

3. **Node.js and npm**:
   - Ensure Node.js (v18+) and npm are installed.

4. **Version Compatibility**:
   - The project uses these versions in the `package.json` file, you need need to use the same to avoid compatibility issues:
     - `next`: `^13.3.0`
     - `react`: `^18.2.0`
     - `react-dom`: `^18.2.0`
     - `@chakra-ui/react`: `^2.8.2`
     - `lightweight-charts`: `^4.1.2`

---

## **Getting Started**

### **Installation**

1. Clone the repository:
   ```bash
   create your folder
   cd into it
   git clone https://github.com/ChrisMoralis/ohlcv.git
   cd ohlcv 
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env.local` file in the project root.
   - Add your Moralis API key as shown as above:
     ```env
     NEXT_PUBLIC_MORALIS_API_KEY=your-moralis-api-key
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000 
   ```
   - assuming that is the port which is available

---

## **Folder Structure**

```
ohlcv/
├── src/
│   └── components/
│       ├── TradingViewChart.js
│       ├── ChartJSONModal.js
│       ├── TokenSearchModal.js
├── pages/
│   ├── index.js           # Main application page
│   └── api/
│       └── token/         # Fetching token pair data
│       ├── candlesticks   # Fetching OHLCV
├── public/                # Static assets
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

---

## **Usage**

### **1. Select a Token Pair & Chain**
- Choose from the predefined token pairs or add a custom pair by selecting "Custom Pair."
- Choose chain, currently only Eth and Polygon are coded, but we support EVM mainnet chains and Solana (https://docs.moralis.com/supported-chains)

### **2. Set the Date Range**
- Use the date picker to specify a start and end date for the candlestick data.

### **3. Fetch Data**
- Click the **GO!** button to retrieve and display OHLCV data in the candlestick chart.

### **4. Toggle Moving Averages**
- Enable or disable SMA-8 and SMA-21 overlays on the chart.

### **5. View Token Metadata**
- Use the **Search Token** feature to fetch metadata for a specific token.

---

## **API Endpoints**

### **Candlestick Data**
Fetch OHLCV candlestick data:
```http
GET /api/moralis-api/ohlc/candlesticksv2
```
- **Query Parameters**:
  - `pairAddress`: Address of the token pair.
  - `chainId`: Blockchain ID (e.g., Ethereum: `0x1`).
  - `fromTimestamp`: Start date (UNIX timestamp).
  - `toTimestamp`: End date (UNIX timestamp).

---

## **Customization**

### **Adding Predefined Pairs**
Modify the `initialPairs` array in `pages/index.js` to add or update predefined trading pairs:
```javascript
const initialPairs = [
  {
    value: '0xa43fe16908251ee70ef74718545e4fe6c5ccec9f',
    label: 'PEPE/WETH',
    precision: 7,
  },
];
```

### **Chart Appearance**
Update the chart options in `TradingViewChart.js` to customize colors, grid lines, and styles.

---

## **Development**

### Running in Development Mode
Start the development server:
```bash
npm run dev
```

### Building for Production
Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

---

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Contact**

For questions or support, contact:
- **GitHub**: [ChrisMoralis](https://github.com/ChrisMoralis)
- **Email**: chris@moralis.io
