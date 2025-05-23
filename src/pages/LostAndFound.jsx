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
  Select,
  useDisclosure,
  FormControl,
  FormLabel,
  Image,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function LostAndFound() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state including type (lost or found)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    type: 'lost', // either 'lost' or 'found'
  });

  // State to hold fetched items from Firestore
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from Firestore on mount
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const lostSnapshot = await getDocs(collection(db, 'lostItems'));
        const foundSnapshot = await getDocs(collection(db, 'foundItems'));

        setLostItems(lostSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFoundItems(foundSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit handler: upload image and save document
  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in the title and description.');
      return;
    }

    try {
      let imageUrl = '';
      if (formData.image) {
        const imageRef = ref(storage, `lostfound/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Choose collection based on type
      const collectionName = formData.type === 'found' ? 'foundItems' : 'lostItems';

      await addDoc(collection(db, collectionName), {
        title: formData.title,
        description: formData.description,
        imageUrl,
        createdAt: new Date()
      });

      // Clear form and close modal
      setFormData({ title: '', description: '', image: null, type: 'lost' });
      onClose();

      // Refresh items after submission
      setLoading(true);
      const lostSnapshot = await getDocs(collection(db, 'lostItems'));
      const foundSnapshot = await getDocs(collection(db, 'foundItems'));
      setLostItems(lostSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFoundItems(foundSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);

    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Error submitting item. Please try again.');
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Lost & Found</Heading>
      <Text mb={8}>Browse or report lost and found items in your community.</Text>

      <Button background="#34495e" color="white" mb={8} onClick={onOpen}>
        Report Lost or Found Item
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Lost or Found Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </Select>
              </FormControl>
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
              {formData.image && (
                <Box boxSize="150px" mt={2}>
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    boxSize="150px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              )}
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

      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4}>
            <Heading size="md">Lost Items</Heading>
            {lostItems.length === 0 && <Text>No lost items reported yet.</Text>}
            {lostItems.map(item => (
              <Box key={item.id} p={3} bg="white" shadow="sm" rounded="md" w="100%">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} borderRadius="md" mb={2} maxH="200px" objectFit="cover" />
                )}
                <Text fontWeight="bold">{item.title}</Text>
                <Text fontSize="sm" color="gray.600">{item.description}</Text>
              </Box>
            ))}
          </VStack>

          <VStack align="start" bg="green.50" p={4} borderRadius="md" spacing={4}>
            <Heading size="md">Found Items</Heading>
            {foundItems.length === 0 && <Text>No found items reported yet.</Text>}
            {foundItems.map(item => (
              <Box key={item.id} p={3} bg="white" shadow="sm" rounded="md" w="100%">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} borderRadius="md" mb={2} maxH="200px" objectFit="cover" />
                )}
                <Text fontWeight="bold">{item.title}</Text>
                <Text fontSize="sm" color="gray.600">{item.description}</Text>
              </Box>
            ))}
          </VStack>
        </SimpleGrid>
      )}
    </Box>
  );
}
