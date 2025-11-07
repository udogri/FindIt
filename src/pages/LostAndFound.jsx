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
  Tag,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { limit, startAfter } from "firebase/firestore";
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
} from "firebase/firestore";
import { SlFolderAlt } from "react-icons/sl";
import { FiMoreVertical } from "react-icons/fi";

export default function LostAndFound() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const toast = useToast();
  const cancelRef = useRef();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingResolve, setPendingResolve] = useState(null);
  const {
    isOpen: isFormOpen,
    onOpen: openFormModal,
    onClose: closeFormModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isResolveOpen,
    onOpen: openResolveModal,
    onClose: closeResolveModal,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: "",
    type: "lost",
    lastSeen: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(10);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const currentUser = auth.currentUser;

  // ✅ Fetch both lost and found items combined
  const fetchItems = async (loadMore = false) => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const lostQuery = query(
        collection(db, "lostItems"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        ...(loadMore && lastVisible ? [startAfter(lastVisible)] : []),
        limit(itemsPerPage)
      );

      const foundQuery = query(
        collection(db, "foundItems"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        ...(loadMore && lastVisible ? [startAfter(lastVisible)] : []),
        limit(itemsPerPage)
      );

      const [lostSnapshot, foundSnapshot] = await Promise.all([
        getDocs(lostQuery),
        getDocs(foundQuery),
      ]);

      const newItems = [
        ...lostSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          collectionName: "lostItems",
        })),
        ...foundSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          collectionName: "foundItems",
        })),
      ];

      newItems.sort(
        (a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()
      );

      setItems((prev) => (loadMore ? [...prev, ...newItems] : newItems));
      setLastVisible(
        newItems.length > 0 ? newItems[newItems.length - 1] : null
      );
      setHasMore(newItems.length === itemsPerPage * 2);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => fetchItems(true);

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
          console.warn("Location permission denied.", error);
        }
      );
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.title || !formData.description) {
      setLoading(false);
      return toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      let imageUrl = formData.imageUrl;
      if (formData.image) {
        const data = new FormData();
        data.append("image", formData.image);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=bc6aa3a9cee7036d9b191018c92c893a`,
          { method: "POST", body: data }
        );
        const file = await res.json();
        imageUrl = file.data.url;
      }

      const collectionName =
        formData.type === "found" ? "foundItems" : "lostItems";
      if (editMode) {
        const docRef = doc(db, editCollectionName, editItemId);
        await updateDoc(docRef, {
          title: formData.title,
          description: formData.description,
          imageUrl,
          lastSeen: formData.lastSeen || "",
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...formData,
          imageUrl,
          userId: currentUser.uid,
          createdAt: new Date(),
          location:
            userLocation.latitude && userLocation.longitude
              ? userLocation
              : null,
        });
      }

      resetForm();
      await fetchItems();
    } catch (err) {
      console.error("Error submitting:", err);
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditItemId(item.id);
    setEditCollectionName(item.collectionName);
    setFormData({
      title: item.title,
      description: item.description,
      image: null,
      imageUrl: item.imageUrl || "",
      type: item.collectionName === "foundItems" ? "found" : "lost",
      lastSeen: item.lastSeen || "",
    });
    openFormModal();
  };

  const handleDelete = (item) => {
    setPendingDelete(item);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteDoc(
        doc(db, pendingDelete.collectionName, pendingDelete.id)
      );
      await fetchItems();
      toast({
        title: "Item deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      closeDeleteModal();
      setPendingDelete(null);
    }
  };

  const handleMarkAsResolved = (item) => {
    setPendingResolve(item);
    openResolveModal();
  };

  const confirmResolve = async () => {
    if (!pendingResolve) return;
    try {
      const docRef = doc(
        db,
        pendingResolve.collectionName,
        pendingResolve.id
      );
      await updateDoc(docRef, { status: "resolved" });
      await fetchItems();
      toast({
        title: "Item marked as resolved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      closeResolveModal();
      setPendingResolve(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      imageUrl: "",
      type: "lost",
      lastSeen: "",
    });
    setEditMode(false);
    setEditItemId(null);
    closeFormModal();
  };

  return (
    <Box p={8} textAlign="center" bg="neutral.50" minH="100vh">
      <Heading mb={4} fontSize={{ base: "2xl", md: "4xl" }} color="brand.700">
        Lost & Found - My Reports
      </Heading>
      <Text mb={8} fontSize="lg" color="neutral.700">
        Manage all your reports in one place.
      </Text>

      <Button bg="rgba(26, 32, 44, 0.85)" mb={8} onClick={() => {
        resetForm();
        openFormModal();
      }}>
        Report Lost or Found Item
      </Button>

      {/* Skeleton Loader */}
      {loading && items.length === 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} p={4} bg="white" rounded="md" shadow="sm">
              <Skeleton height="150px" borderRadius="md" />
              <SkeletonText mt="4" noOfLines={3} spacing="3" />
            </Box>
          ))}
        </SimpleGrid>
      ) : items.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {items.map((item) => (
            <Box
              key={item.id}
              p={4}
              bg="white"
              shadow="sm"
              rounded="lg"
              textAlign="left"
              position="relative"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  borderRadius="md"
                  mb={3}
                  objectFit="cover"
                  width="100%"
                  height="180px"
                />
              )}
              <Text fontWeight="bold" color="brand.700" noOfLines={1}>
                {item.title}
              </Text>
              <Text fontSize="sm" color="gray.600" noOfLines={3}>
                {item.description}
              </Text>
              {item.status === "resolved" && (
                <Tag
                  size="sm"
                  colorScheme="green"
                  position="absolute"
                  top={3}
                  right={3}
                >
                  Resolved
                </Tag>
              )}

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  top={3}
                  right={3}
                />
                <MenuList fontSize="sm">
                  <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                  <MenuItem
                    onClick={() => handleDelete(item)}
                    color="red.500"
                  >
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => handleMarkAsResolved(item)}>
                    Mark as Resolved
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <VStack py={10} bg="white" rounded="xl" shadow="md">
          <Icon as={SlFolderAlt} boxSize={16} color="gray.400" />
          <Text color="gray.600">No lost or found items yet.</Text>
        </VStack>
      )}

      {hasMore && (
        <Button mt={8} onClick={loadMore} isLoading={loading} variant="outline">
          Load More
        </Button>
      )}

      {/* Form Modal, Delete & Resolve Dialogs (same as before) */}
      {/* ... (keep same modal and alert dialog code from your version) */}
    </Box>
  );
}
