import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';

const mockReports = [
  {
    id: 1,
    title: 'Lost Dog - Golden Retriever',
    description: 'Last seen around GRA Phase 2, Port Harcourt.',
    image: '/assets/lost-dog.jpg',
    status: 'Lost',
  },
  {
    id: 2,
    title: 'Found Backpack',
    description: 'Found near Yaba bus stop, contains school books.',
    image: '/assets/found-backpack.jpg',
    status: 'Found',
  },
];

const Community = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reports, setReports] = useState(mockReports);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Lost',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newReport = {
      ...formData,
      id: reports.length + 1,
    };
    setReports((prev) => [newReport, ...prev]);
    setFormData({ title: '', description: '', status: 'Lost', image: '' });
    onClose();
  };

  return (
    <Box px={8} py={12} bg="gray.50">
      {/* Header Section */}
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">Join the Community</Heading>
        <Text fontSize="lg" color="gray.600" maxW="600px">
          Help reunite people with their lost belongings. Whether you've found something or lost an item, we're here to make connection easier.
        </Text>
        <HStack spacing={4}>
          <Button colorScheme="red" onClick={() => {
            setFormData((prev) => ({ ...prev, status: 'Lost' }));
            onOpen();
          }}>
            Report Lost Item
          </Button>
          <Button colorScheme="green" variant="outline" onClick={() => {
            setFormData((prev) => ({ ...prev, status: 'Found' }));
            onOpen();
          }}>
            Report Found Item
          </Button>
        </HStack>
      </VStack>

      {/* Reports Section */}
      <Box mt={12}>
        <Heading size="lg" mb={6}>Recent Reports</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {reports.map((report) => (
            <Box
              key={report.id}
              bg="white"
              p={4}
              shadow="md"
              borderRadius="md"
              borderLeft="6px solid"
              borderColor={report.status === 'Lost' ? 'red.400' : 'green.400'}
            >
              <Image
                src={report.image}
                alt={report.title}
                objectFit="cover"
                w="100%"
                h="200px"
                borderRadius="md"
                mb={4}
              />
              <Heading size="md">{report.title}</Heading>
              <Text fontSize="sm" color="gray.600" mt={2}>
                {report.description}
              </Text>
              <Text fontSize="xs" mt={2} fontWeight="bold" color={report.status === 'Lost' ? 'red.500' : 'green.500'}>
                Status: {report.status}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Footer Message */}
      <Box mt={16} textAlign="center">
        <Heading size="md" mb={4}>Your Help Matters</Heading>
        <Text maxW="600px" mx="auto" color="gray.600">
          Every shared post, every report, every watchful eye counts. Be part of the solution — help others and let others help you.
        </Text>
      </Box>

      {/* Modal Form */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report {formData.status} Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Lost iPhone 12" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description..." />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Upload Image</FormLabel>
                <Input name="image" type="file" accept="image/*" onChange={handleInputChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit} mr={3}>
              Submit Report
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Community;
