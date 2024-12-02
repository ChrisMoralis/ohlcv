import {
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    Text,
    Box,
    Image,
    useDisclosure,
    useToast 
} from '@chakra-ui/react';
import { useState } from 'react';

const TokenSearchModal = ({ onTokenDataFetched }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tokenAddress, setTokenAddress] = useState('');
    const [chain, setChain] = useState('0x1'); 
    const [tokenMetadata, setTokenMetadata] = useState(null); 
    const toast = useToast(); 

    const fetchTokenMetadata = async () => {
        try {
            const response = await fetch(`/api/token/${tokenAddress}?chain=${chain}`);
            const data = await response.json();
            setTokenMetadata(data); 
            onTokenDataFetched(data); 
        } catch (error) {
            //eslint-disable-next-line
            console.error("Error fetching token metadata:", error);
        }
    };

    const handleCopy = (address) => {
        navigator.clipboard.writeText(address);
        toast({
            title: "Copied to Clipboard",
            description: "The pair address has been copied.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <>
            <Button onClick={onOpen} fontWeight={400} fontSize={'sm'} border={'1px solid #3f444e'}>
                Search Token
            </Button>

            {/* Make it 800 px wide */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Search for Token Metadata</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder="Token Address (e.g., 0x123...)"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            mb={3}
                        />
                        <Select
                            placeholder="Select Chain"
                            value={chain}
                            onChange={(e) => setChain(e.target.value)}
                            mb={3}
                        >
                            <option value="0x1">Ethereum</option>
                            <option value="0x89">Polygon</option>
                            {/* Add more chains as needed */}
                        </Select>

                        {/* Display fetched token metadata */}
                        {tokenMetadata && tokenMetadata.pairs && tokenMetadata.pairs.length > 0 && (
                            <Box mt={4}>
                                <Box borderWidth={1} borderRadius="lg" padding={3} mt={2}>
                                    <Text mb={5} fontWeight="bold" fontSize="2xl">{tokenMetadata.pairs[0].pair_label}</Text>
                                    <Text
                                        mb={5}

                                    >
                                        <strong>Pair Address: </strong> 
                                        <Text as='span'
                                            
                                            onClick={() => handleCopy(tokenMetadata.pairs[0].pair_address)}
                                            cursor="pointer" 
                                            textDecoration="underline" 
                                        >
                                            {tokenMetadata.pairs[0].pair_address}
                                            </Text>
                                    </Text>
                                    <Box display={'flex'} alignItems="center">
                                        <Box mr={5}>
                                            {tokenMetadata.pairs[0].exchange_logo && (
                                                <Image
                                                    src={tokenMetadata.pairs[0].exchange_logo}
                                                    alt="Exchange Logo"
                                                    boxSize="75px"
                                                    mb={2}
                                                />
                                            )}
                                        </Box>
                                        <Box flexGrow={1}>
                                            <Text>
                                                <strong>Exchange:</strong> {tokenMetadata.pairs[0].exchange_name}
                                            </Text>
                                            <Text>
                                                <strong>Pair Label:</strong> {tokenMetadata.pairs[0].pair_label}
                                            </Text>
                                            <Text>
                                                <strong>USD Price:</strong> ${tokenMetadata.pairs[0].usd_price.toFixed(10)}
                                            </Text>
                                        </Box>
                                    </Box>

                                    {/* Display tokens in the pair */}
                                    <Box mt={3}>
                                        {tokenMetadata.pairs[0].pair.map((token) => (
                                            <Box key={token.token_address} display="flex" alignItems="center" mt={2}>
                                                {token.token_logo && (
                                                    <Image
                                                        src={token.token_logo}
                                                        alt={`${token.token_name} Logo`}
                                                        boxSize="30px"
                                                        objectFit="cover"
                                                        display="inline-block"
                                                        mr={2}
                                                    />
                                                )}
                                                <Text>
                                                    <strong>{token.token_name}</strong> ({token.token_symbol})
                                                </Text>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {!tokenMetadata ? <Button onClick={fetchTokenMetadata} colorScheme="blue">FETCH</Button> : ""}
                        <Button onClick={onClose} ml={3} bg={tokenMetadata ? 'green' : 'red.500'}>{tokenMetadata ? "Close" : "Cancel"}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TokenSearchModal;
