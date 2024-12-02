
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Text,
    Box,
    useDisclosure,
    Button,
  } from '@chakra-ui/react';
  
  import 'react-json-pretty/themes/monikai.css'; 
  
  import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
  import 'react-json-view-lite/dist/index.css';
  
  function SimpleModal({ tokenData,  buttonWidth = '', label }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    function handleCopyToClipboard() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(tokenData))
          .then(() => {
            // eslint-disable-next-line
            console.log('Content copied to clipboard');
          })
          .catch((err) => {
            // eslint-disable-next-line
            console.error('Error in copying text: ', err);
          });
      } else {
        // eslint-disable-next-line
        console.log('Clipboard API not available');
      }
    }
  
    return (
      <Box>
        <Button onClick={onOpen} width={buttonWidth} fontSize={'sm' } fontWeight={400} border={'1px solid #3f444e'}>
          {label}
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{ width: 'auto', maxWidth: '90%' }}>
            <ModalHeader>
              <Text>API data for this token</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <JsonView data={tokenData} shouldExpandNode={allExpanded} style={defaultStyles} ></JsonView>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  }
  
  export default SimpleModal;
  