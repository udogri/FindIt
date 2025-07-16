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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
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
import { SlFolderAlt } from "react-icons/sl";

export default function LostAndFound() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [editCollectionName, setEditCollectionName] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const toast = useToast();
  const cancelRef = useRef();
  const [pendingDelete, setPendingDelete] = useState(null);
  const {
    isOpen: isFormOpen,
    onOpen: openFormModal,
    onClose: closeFormModal,
  } = useDisclosure(); // For FORM modal

  const {
    isOpen: isDeleteOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure(); // For DELETE modal



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
  const [loading, setLoading] = useState(false);

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location permission denied or unavailable.", error);
          setUserLocation({ latitude: null, longitude: null });
        }
      );
    }
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
    setLoading(true);
    if (!formData.title || !formData.description) {
      setLoading(false);
      toast({
        title: 'Missing fields.',
        description: 'Please fill in the title and description.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (!currentUser) {
      setLoading(false);
      toast({
        title: 'Unauthorized',
        description: 'You must be logged in to submit a report.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
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
          location: userLocation.latitude && userLocation.longitude
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }
    : null,
        });
      }

      resetForm();
      await fetchItems();
    } catch (error) {
      setLoading(false);
      console.error('Error submitting item:', error);
      toast({
        title: 'Submission failed',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleEdit = (item, collectionName) => {
    // setLoading(true);
    if (!currentUser || item.userId !== currentUser.uid) {
      setLoading(false);
      toast({
        title: 'Permission denied.',
        description: 'You can only edit your own items.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

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
    openFormModal();
  };


  const handleDelete = (id, collectionName, userId) => {
    console.log("Delete clicked");

    if (!currentUser || userId !== currentUser.uid) {
      toast({
        title: 'Permission denied.',
        description: 'You can only delete your own items.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    } 
    

    setPendingDelete({ id, collectionName, userId });
    openDeleteModal(); // opens modal
    
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
  
    setLoading(true);
    try {
      await deleteDoc(doc(db, pendingDelete.collectionName, pendingDelete.id));
      await fetchItems();
      setLoading(false);

      toast({
        title: 'Item deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      setLoading(false);

      console.error('Error deleting item:', error);
      toast({
        title: 'Delete failed',
        description: 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      closeDeleteModal();
      setPendingDelete(null);
      setLoading(false);
    }
  };
  


  const resetForm = () => {
    setFormData({ title: '', description: '', image: null, imageUrl: '', type: 'lost', lastSeen: '' });
    setEditMode(false);
    setEditItemId(null);
    setEditCollectionName('');
    closeFormModal();
  };

  return (
    <Box p={8} textAlign="center">
      <Heading mb={4} fontSize="50px">
        Lost & Found - My Reports
      </Heading>
      <Text mb={8}>Report lost and found items in your community.</Text>

      <Button
        background="#34495e"
        color="white"
        mb={8}
        _hover={{ bg: '#3c5a70' }}
        onClick={() => {
          resetForm();
          openFormModal();
        }}
      >
        Report Lost or Found Item
      </Button>

      {/* Modal for form */}
      <Modal isOpen={isFormOpen} onClose={resetForm} size="lg" scrollBehavior="inside">
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
            <Button onClick={handleSubmit} colorScheme="blue" isLoading={loading} mr={3}>
              {editMode ? 'Update' : 'Submit'}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {lostItems.length === 0 && foundItems.length === 0 ? (
        <Box textAlign="center" py={10} w="100%">
          <Icon as={SlFolderAlt} boxSize={55} color="gray.400" mt={4} />
          <Text fontSize="lg" color="gray.600" mt={4}>
            No lost or found items have been reported yet.
          </Text>
        </Box>
      ) : lostItems.length > 0 && foundItems.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} w="100%">
          {/* LOST ITEMS */}
          <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4} minH="300px">
            <Heading size="md">Lost Items</Heading>
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
                {currentUser && item.userId === currentUser.uid && (
                  <Box mt="auto" display="flex" gap={2}>
                    <Button size="sm" colorScheme="blue" onClick={() => handleEdit(item, 'lostItems')}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setPendingDelete({ id: item.id, collectionName: 'lostItems', userId: item.userId });
                        openDeleteModal(); // 🛠️ Make sure this opens the delete modal, not the form modal
                      }}
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
      ) : (
        // Only one of the categories has items – center it
        <Flex justify="center" w="100%">
          {lostItems.length > 0 ? (
            <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4} minH="300px" w={{ base: "100%", md: "60%" }}>
              <Heading size="md">Lost Items</Heading>
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
          ) : (
            <VStack align="start" bg="green.50" p={4} borderRadius="md" spacing={4} minH="300px" w={{ base: "100%", md: "60%" }}>
              <Heading size="md">Found Items</Heading>
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
          )}
        </Flex>
      )}
      <AlertDialog
            isOpen={isDeleteOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => {
              setPendingDelete(null);
              closeDeleteModal(); // ✅ Proper close function
            }}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Item
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this item? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={closeDeleteModal}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    isLoading={loading} // 🛠️ Show loading state
                    onClick={confirmDelete}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
    </Box>
  );
}
