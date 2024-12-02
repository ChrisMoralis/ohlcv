import {
  Button,
  Box,
  Flex,
  Select,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TradingViewChart from '../components/TradingViewChart';
import ChartJSONModal from '../components/ChartJSONModal';
import TokenSearchModal from '../components/TokenSearchModal';

// Pairs with their respective 'precision of digits' for trading view price axis
const initialPairs = [
  {
    value: '0xa43fe16908251ee70ef74718545e4fe6c5ccec9f',
    label: 'PEPE/WETH',
    precision: 7,
  },
  {
    value: '0x69c7bd26512f52bf6f76fab834140d13dda673ca',
    label: 'NPC/WETH',
    precision: 7,
  },
  {
    value: '0xdd949d1fe117744a38319c7b7dcc045d630bcc8d',
    label: 'BERRY/WETH',
    precision: 4,
  },
  {
    value: '0x1f9b4a5ddd586f8471cda36262c52e5872a7d257',
    label: 'SAI/WETH',
    precision: 4,
  },
];

export default function Home() {
  const [candleData, setCandleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState(initialPairs); 
  
  const today = new Date();
  const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
  
  const [params, setParams] = useState({
    chainId: '0x1',
    pairAddress: pairs[0].value,
    span: '86400',
    fromTimestamp: threeMonthsAgo,
    toTimestamp: new Date(),
    limit: '300',
    precision: pairs[0].precision,
  });
  
  const [showSMA8, setShowSMA8] = useState(false);
  const [showSMA21, setShowSMA21] = useState(false);
  
  // States for displaying token metadata
  // eslint-disable-next-line
  const [tokenMetadata, setTokenMetadata] = useState(null);

  // New states for adding a new pair
  const [newPair, setNewPair] = useState({ value: '', label: '', precision: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Store the token metadata for rendering
  const handleTokenDataFetched = (data) => {
    setTokenMetadata(data); 
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pairAddress') {
      if (value === 'custom') {
        onOpen(); 
      } else {
        const selectedPair = pairs.find((pair) => pair.value === value);
        if (selectedPair) {
          setParams((prev) => ({
            ...prev,
            [name]: value,
            precision: selectedPair.precision,
          }));
        }
      }
    } else {
      setParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (field, date) => {
    setParams((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      ...params,
      fromTimestamp: Math.floor(params.fromTimestamp.getTime() / 1000),
      toTimestamp: Math.floor(params.toTimestamp.getTime() / 1000),
    }).toString();

    
    try {
      const response = await fetch(`/api/candlesticks?${query}`);
      const data = await response.json();

      // Set both candlestick data and raw data
      setCandleData(data.candlestickData); 

    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPair = () => {
    if (newPair.value && newPair.label && newPair.precision) {
      const newPairsList = [
        ...pairs,
        {
          value: newPair.value,
          label: newPair.label,
          precision: parseInt(newPair.precision), 
        },
      ];
      setPairs(newPairsList);
      setNewPair({ value: '', label: '', precision: '' }); 
      setParams((prev) => ({
        ...prev,
        pairAddress: newPairsList[newPairsList.length - 1].value,
        precision: newPairsList[newPairsList.length - 1].precision,
      })); 
      onClose(); 
    }
  };

  return (
    <Box p={4}>
      <Flex gap={2} mb={4} flexWrap="wrap" justifyContent={'space-between'}>
        <Select
          name="pairAddress"
          value={params.pairAddress}
          onChange={handleChange}
          width="500px"
        >
          {pairs.map((pair) => (
            <option key={pair.value} value={pair.value}>
              {pair.label} ({pair.value})
            </option>
          ))}
          <option value="custom">Custom Pair</option>
        </Select>
        <Select
          placeholder="Select Chain"
          name="chainId"
          value={params.chainId}
          onChange={handleChange}
          width="150px"
        >
          <option value="0x1">Eth (0x1)</option>
          <option value="0x89">Polygon (0x89)</option>
        </Select>
        <Select
          placeholder="Select Timeframe"
          name="span"
          value={params.span}
          onChange={handleChange}
          width="150px"
          zIndex={10000}
        >
          <option value="1">1 second</option>
          <option value="10">10 second</option>
          <option value="60">1 minute</option>
          <option value="3600">Hourly</option>
          <option value="86400">Daily</option>
          <option value="604800">Weekly</option>
        </Select>

        <Box border={'1px solid #3f444e'} borderRadius={5} display={'flex'} alignItems={'center'} py={1.2} px={3} zIndex={1000}>
          <Text mr={2}>From:</Text>
          <DatePicker
            maxDate={new Date()}
            selected={params.fromTimestamp}
            onChange={(date) => handleDateChange('fromTimestamp', date)}
            dateFormat="MMMM d, yyyy"
            className="input"
            wrapperClassName="datePicker"

          />
        </Box>
        <Box border={'1px solid #3f444e'} borderRadius={5} display={'flex'} alignItems={'center'} py={1.2} px={3} zIndex={1000}>
          <Text mr={2}>To:</Text>
          <DatePicker
            maxDate={new Date()}
            selected={params.toTimestamp}
            onChange={(date) => handleDateChange('toTimestamp', date)}
            dateFormat="MMMM d, yyyy"
            className="input"
            wrapperClassName="datePicker"
          />
        </Box>

        <Button onClick={fetchData} isLoading={loading} fontWeight={400} fontSize={'sm'} border={'1px solid #3f444e'} bg={'green'}>
          GO!
        </Button>

        <TokenSearchModal onTokenDataFetched={handleTokenDataFetched} />

        {/* Toggle Buttons */}
        <Button onClick={() => {
          setShowSMA8((prev) => !prev);
          setShowSMA21((prev) => !prev);
        }}
          fontWeight={400} fontSize={'sm'} border={'1px solid #3f444e'}>
          SMAs ?
        </Button>

        <ChartJSONModal tokenData={candleData} label={'Candle JSON'} />
      </Flex>

      {/* Modal for Adding Custom Pair */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter the details for a custom pair</ModalHeader>
          <ModalBody>
            <Input
              placeholder="*Pair Address (e.g., 0x123...)"
              value={newPair.value}
              onChange={(e) => setNewPair({ ...newPair, value: e.target.value })}
              required
            />
            <Input
              placeholder="Label (e.g., CUSTOM/ETH)"
              value={newPair.label}
              onChange={(e) => setNewPair({ ...newPair, label: e.target.value })}
              required
              mt={2}
            />
            <Input
              placeholder="Y axis precision (0.005 is 3 & 0.000005 is 7)"
              value={newPair.precision}
              onChange={(e) => setNewPair({ ...newPair, precision: e.target.value })}
              required
              mt={2}
              type="number"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAddPair} colorScheme="blue">Add Pair</Button>
            <Button onClick={onClose} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

{candleData && (
      <TradingViewChart
        candleData={candleData}
        precision={params.precision}
        showSMA8={showSMA8}
        showSMA21={showSMA21}
      />
)}  
    </Box>
  );
}
