// theme.js

import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

/*
      150: "#09182a", // Lighter dark background
      200: "#68738d", // Text color
      250: "#1a3656", // Border color
      300: "#45d15d", // Moralis green
      350: "#eb7070", // Moralis red
      400: "#0e253c",
      450: "#122a45",
      500: "#07111c",
      550: "#0c2034",
      600: "#0e2137",
      650: "#11263f",
      700: "#073664",
      750: "#85b3db" // White text color
*/

const theme = extendTheme({
  config,
  colors: {
    moralis: {
      100: "#06111d",
      150: "#09182a",
      200: "#68738d",
      250: "#1a3656",
      300: "#45d15d",
      350: "#eb7070",
      400: "#0e253c",
      450: "#122a45",
      500: "#07111c",
      550: "#0c2034",
      600: "#0e2137",
      650: "#11263f",
      700: "#073664",
      750: "#85b3db"
    },
  },
});

export default theme;
