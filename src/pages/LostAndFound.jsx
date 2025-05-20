import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useState } from 'react';

export default function LostAndFound() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    console.log(formData); // Send this to backend
    onClose();
    setFormData({ title: '', description: '', image: null });
  };

  const lostItems = [
    { id: 1, title: 'Lost Wallet', description: 'Black leather wallet lost near community park.' },
    { id: 2, title: 'Missing Dog', description: 'Brown Labrador missing since yesterday.' },
  ];

  const foundItems = [
    { id: 1, title: 'Found Keys', description: 'Bunch of car keys found outside library.' },
    { id: 2, title: 'Found Phone', description: 'iPhone 12 found on street corner.' },
  ];

  return (
    <Box p={8}>
      <Heading mb={4}>Lost & Found</Heading>
      <Text mb={8}>Browse or report lost and found items in your community.</Text>

      <Button background="#34495e" color="white" mb={8} onClick={onOpen}>
        Report Lost or Found Item
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Lost or Found Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={formData.title} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input type="file" name="image" accept="image/*" onChange={handleChange} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4}>
          <Heading size="md">Lost Items</Heading>
          {lostItems.map(item => (
            <Box key={item.id} p={3} bg="white" shadow="sm" rounded="md" w="100%">
              <Text fontWeight="bold">{item.title}</Text>
              <Text fontSize="sm" color="gray.600">{item.description}</Text>
            </Box>
          ))}
        </VStack>

        <VStack align="start" bg="green.50" p={4} borderRadius="md" spacing={4}>
          <Heading size="md">Found Items</Heading>
          {foundItems.map(item => (
            <Box key={item.id} p={3} bg="white" shadow="sm" rounded="md" w="100%">
              <Text fontWeight="bold">{item.title}</Text>
              <Text fontSize="sm" color="gray.600">{item.description}</Text>
            </Box>
          ))}
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
