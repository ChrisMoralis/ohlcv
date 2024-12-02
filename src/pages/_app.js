import "@/styles/globals.css";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '../../theme';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
