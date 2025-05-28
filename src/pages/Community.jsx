import React, { useState, useEffect } from 'react';
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
  Spinner,
} from '@chakra-ui/react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ReportDetailsModal from '../components/ReportDetails';

const Community = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const openDetails = (report) => {
    if (report) {
      setSelectedReport(report);
      onOpen();
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const lostSnapshot = await getDocs(collection(db, 'lostItems'));
        const foundSnapshot = await getDocs(collection(db, 'foundItems'));

        const lostData = lostSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: 'Lost',
        }));

        const foundData = foundSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: 'Found',
        }));

        setLostItems(lostData);
        setFoundItems(foundData);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const allReports = [...lostItems, ...foundItems];

  return (
    <Box px={8} py={12} bg="gray.50">
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">Join the Community</Heading>
        <Text fontSize="lg" color="gray.600" maxW="600px">
          Help reunite people with their lost belongings. Whether you've found something or lost an item, we're here to make connection easier.
        </Text>
        <HStack spacing={4}>
          <Button colorScheme="red">Report Lost Item</Button>
          <Button colorScheme="green" variant="outline">Report Found Item</Button>
        </HStack>
      </VStack>

      <Box mt={12}>
        <Heading size="lg" mb={6}>Recent Reports</Heading>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4} color="gray.500">Loading reports...</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {allReports.map((report) => (
              <Box
                key={report.id}
                bg="white"
                p={4}
                shadow="md"
                borderRadius="md"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                borderLeft="6px solid"
                borderColor={report.status === 'Lost' ? 'red.400' : 'green.400'}
                onClick={() => openDetails(report)}
              >
                {report.imageUrl && (
                  <Image
                    src={report.imageUrl}
                    alt={report.title || 'Report Image'}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                    borderRadius="md"
                    mb={4}
                  />
                )}
                <Heading size="md">{report.title || 'Untitled Report'}</Heading>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {report.description || 'No description provided.'}
                </Text>
                <Text
                  fontSize="xs"
                  mt={2}
                  fontWeight="bold"
                  color={report.status === 'Lost' ? 'red.500' : 'green.500'}
                >
                  Status: {report.status}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      <ReportDetailsModal isOpen={isOpen} onClose={onClose} report={selectedReport} />

      <Box mt={16} textAlign="center">
        <Heading size="md" mb={4}>Your Help Matters</Heading>
        <Text maxW="600px" mx="auto" color="gray.600">
          Every shared post, every report, every watchful eye counts. Be part of the solution — help others and let others help you.
        </Text>
      </Box>
    </Box>
  );
};

export default Community;
