import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  useDisclosure,
  Spinner,
  Tag,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ReportDetailsModal from '../components/ReportDetails';
import { SlFolderAlt } from "react-icons/sl";
import { formatDistanceToNowStrict } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Import getDoc and doc

const Community = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation(); // Get current URL location

  const [allReports, setAllReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const openDetails = (report) => {
    if (report) {
      setSelectedReport(report);
      onOpen();
    }
  };

  // Effect to open modal if reportId is in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reportId = queryParams.get('reportId');

    const fetchAndOpenReport = async (id) => {
      setLoading(true);
      try {
        const lostDoc = await getDoc(doc(db, 'lostItems', id));
        const foundDoc = await getDoc(doc(db, 'foundItems', id));

        let reportData = null;
        if (lostDoc.exists()) {
          reportData = { id: lostDoc.id, ...lostDoc.data(), type: 'lost', status: lostDoc.data().status || 'Lost' };
        } else if (foundDoc.exists()) {
          reportData = { id: foundDoc.id, ...foundDoc.data(), type: 'found', status: foundDoc.data().status || 'Found' };
        }

        if (reportData) {
          setSelectedReport(reportData);
          onOpen();
        } else {
          console.warn('Report not found for ID:', id);
        }
      } catch (error) {
        console.error('Error fetching report for modal:', error);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchAndOpenReport(reportId);
    }
  }, [location.search, onOpen]); // Re-run when URL search params change

  // Haversine formula to calculate distance in km
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation(null); // fallback to show all if user denies
        }
      );
    }
  }, []);

  // Fetch data after location is available
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const lostSnapshot = await getDocs(collection(db, 'lostItems'));
        const foundSnapshot = await getDocs(collection(db, 'foundItems'));

        const lostData = lostSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'lost', // Add type for consistent handling
          status: doc.data().status || 'Lost', // Use actual status or default to 'Lost'
        }));

        const foundData = foundSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'found', // Add type for consistent handling
          status: doc.data().status || 'Found', // Use actual status or default to 'Found'
        }));

        let combined = [...lostData, ...foundData];

        // ✅ Filter based on distance if user location is available
        if (userLocation) {
          combined = combined.filter((item) => {
            const loc = item.location;
            if (loc?.latitude && loc?.longitude) {
              const distance = getDistanceFromLatLonInKm(
                userLocation.latitude,
                userLocation.longitude,
                loc.latitude,
                loc.longitude
              );
              return distance <= 20; // show reports within 20km
            }
            return true; // allow items without location (for debugging)
          });
        }

        // ✅ Sort by createdAt (latest first)
        combined.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });

        setAllReports(combined);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userLocation]);

  return (
    <Box px={{ base: 4, md: 8 }} py={12} bg="neutral.50" minH="100vh">
      <VStack spacing={6} textAlign="center" mb={10}>
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" color="brand.700">
          Join the Community
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="neutral.700" maxW="700px">
          Help reunite people with their lost belongings. Whether you've found something or lost an item, we're here to make connection easier.
        </Text>
      </VStack>

      <Box mt={12}>
        <Heading fontSize={{ base: "xl", md: "2xl" }} mb={6} color="neutral.800" textAlign="center">Recent Reports Nearby</Heading>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.500" />
            <Text mt={4} color="neutral.600">Loading reports...</Text>
          </Box>
        ) : allReports.length === 0 ? (
          <VStack textAlign="center" py={10} w="100%">
            <Icon as={SlFolderAlt} boxSize={65} color="neutral.400" mt={4} />
            <Text fontSize={{ base: "md", md: "lg" }} color="neutral.600" mt={4}>
              No recent reports in your area.
            </Text>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {allReports.map((report) => (
              <Box
                key={report.id}
                bg="white"
                p={6}
                shadow="lg"
                borderRadius="xl"
                cursor="pointer"
                _hover={{ boxShadow: '2xl', transform: 'translateY(-5px)', transition: '0.2s' }}
                onClick={() => openDetails(report)}
                position="relative"
                overflow="hidden"
              >
                {report.imageUrl && (
                  <Image
                    src={report.imageUrl}
                    alt={report.title || 'Report Image'}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                    borderRadius="lg"
                    mb={4}
                  />
                )}
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Heading fontSize={{ base: "md", md: "lg" }} color="brand.700" noOfLines={1}>{report.title || 'Untitled Report'}</Heading>
                  <Tag
                    size="md"
                    colorScheme={report.status === 'resolved' ? 'green' : (report.type === 'lost' ? 'red' : 'green')}
                    variant="solid"
                    borderRadius="full"
                    px={3}
                  >
                    {report.status === 'resolved' ? (report.type === 'lost' ? 'Found' : 'Returned') : report.status}
                  </Tag>
                </Flex>
                <Text fontSize={{ base: "sm", md: "md" }} color="neutral.700" noOfLines={2} mb={3}>
                  {report.description || 'No description provided.'}
                </Text>
                {report.createdAt?.toDate && (
                  <Text fontSize="xs" color="neutral.500">
                    Posted {formatDistanceToNowStrict(report.createdAt.toDate(), { addSuffix: true })}
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      <ReportDetailsModal isOpen={isOpen} onClose={onClose} report={selectedReport} />
    </Box>
  );
};

export default Community;
