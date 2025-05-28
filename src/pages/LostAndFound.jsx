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
  Center,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export default function LostAndFound() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [editCollectionName, setEditCollectionName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    type: 'lost',
    lastSeen: '',
  });

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  const fetchItems = async () => {
    if (!currentUser) {
      setLostItems([]);
      setFoundItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Query lostItems by current user
      const lostQuery = query(
        collection(db, 'lostItems'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const lostSnapshot = await getDocs(lostQuery);

      // Query foundItems by current user
      const foundQuery = query(
        collection(db, 'foundItems'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const foundSnapshot = await getDocs(foundQuery);

      setLostItems(lostSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFoundItems(foundSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [currentUser]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in the title and description.');
      return;
    }

    if (!currentUser) {
      alert('You must be logged in to submit a report.');
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const data = new FormData();
        data.append('image', formData.image);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=bc6aa3a9cee7036d9b191018c92c893a`,
          {
            method: 'POST',
            body: data,
          }
        );

        if (!res.ok) throw new Error('Image upload failed');
        const file = await res.json();
        imageUrl = file.data.url;
      }

      const collectionName = formData.type === 'found' ? 'foundItems' : 'lostItems';

      if (editMode) {
        const docRef = doc(db, editCollectionName, editItemId);
        await updateDoc(docRef, {
          title: formData.title,
          description: formData.description,
          imageUrl,
          lastSeen: formData.lastSeen || '',
        });
      } else {
        await addDoc(collection(db, collectionName), {
          title: formData.title,
          description: formData.description,
          imageUrl,
          lastSeen: formData.lastSeen || '',
          userId: currentUser.uid, // Store user ID
          createdAt: new Date(),
        });
      }

      resetForm();
      await fetchItems();
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Error submitting item. Please try again.');
    }
  };

  const handleEdit = (item, collectionName) => {
    if (!currentUser || item.userId !== currentUser.uid) return; // Only owner can edit

    setEditMode(true);
    setEditItemId(item.id);
    setEditCollectionName(collectionName);
    setFormData({
      title: item.title,
      description: item.description,
      image: null,
      imageUrl: item.imageUrl || '',
      type: collectionName === 'foundItems' ? 'found' : 'lost',
      lastSeen: item.lastSeen || '',
    });
    onOpen();
  };

  const handleDelete = async (id, collectionName, userId) => {
    if (!currentUser || userId !== currentUser.uid) return; // Only owner can delete

    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        await fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image: null, imageUrl: '', type: 'lost', lastSeen: '' });
    setEditMode(false);
    setEditItemId(null);
    setEditCollectionName('');
    onClose();
  };

  return (
    <Box p={8}>
      <Heading mb={4} fontSize="50px">
        Lost & Found - My Reports
      </Heading>
      <Text mb={8}>Browse or report lost and found items in your community.</Text>

      <Button
        background="#34495e"
        color="white"
        mb={8}
        onClick={() => {
          resetForm();
          onOpen();
        }}
      >
        Report Lost or Found Item
      </Button>

      {/* Modal for form */}
      <Modal isOpen={isOpen} onClose={resetForm} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editMode ? 'Edit Item' : 'Report Lost or Found Item'}</ModalHeader>
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
                <FormLabel>By</FormLabel>
                <Input name="by" value={formData.by} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Last seen</FormLabel>
                <Textarea name="lastSeen" value={formData.lastSeen} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input type="file" name="image" accept="image/*" onChange={handleChange} />
              </FormControl>

              {/* Image preview */}
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
              {!formData.image && formData.imageUrl && (
                <Box boxSize="150px" mt={2}>
                  <Image
                    src={formData.imageUrl}
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
              {editMode ? 'Update' : 'Submit'}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          {/* Show message and CTA if no reports */}
          {lostItems.length === 0 && foundItems.length === 0 ? (
            <Center flexDirection="column" py={20}>
              <Text fontSize="xl" mb={4}>
                You have not reported any lost or found items yet.
              </Text>
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => {
                  resetForm();
                  onOpen();
                }}
              >
                Report an Item
              </Button>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {/* LOST ITEMS */}
              <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4} minH="300px">
                <Heading size="md">Lost Items</Heading>
                {lostItems.length === 0 && <Text>No lost items reported yet.</Text>}
                {lostItems.map(item => (
                  <Box
                    key={item.id}
                    p={3}
                    bg="white"
                    shadow="sm"
                    rounded="md"
                    w="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        borderRadius="md"
                        mb={2}
                        maxH="200px"
                        objectFit="cover"
                        width="100%"
                      />
                    )}
                    <Text fontWeight="bold" noOfLines={1}>
                      {item.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={3} mb={2}>
                      {item.description}
                    </Text>

                    {/* Only show buttons if user owns this item */}
                    {currentUser && item.userId === currentUser.uid && (
                      <Box mt="auto" display="flex" gap={2}>
                        <Button size="sm" colorScheme="blue" onClick={() => handleEdit(item, 'lostItems')}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(item.id, 'lostItems', item.userId)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>

              {/* FOUND ITEMS */}
              <VStack align="start" bg="green.50" p={4} borderRadius="md" spacing={4} minH="300px">
                <Heading size="md">Found Items</Heading>
                {foundItems.length === 0 && <Text>No found items reported yet.</Text>}
                {foundItems.map(item => (
                  <Box
                    key={item.id}
                    p={3}
                    bg="white"
                    shadow="sm"
                    rounded="md"
                    w="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        borderRadius="md"
                        mb={2}
                        maxH="200px"
                        objectFit="cover"
                        width="100%"
                      />
                    )}
                    <Text fontWeight="bold" noOfLines={1}>
                      {item.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={3} mb={2}>
                      {item.description}
                    </Text>

                    {/* Only show buttons if user owns this item */}
                    {currentUser && item.userId === currentUser.uid && (
                      <Box mt="auto" display="flex" gap={2}>
                        <Button size="sm" colorScheme="blue" onClick={() => handleEdit(item, 'foundItems')}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(item.id, 'foundItems', item.userId)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            </SimpleGrid>
          )}
        </>
      )}
    </Box>
  );
}
