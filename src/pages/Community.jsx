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
} from '@chakra-ui/react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ReportDetailsModal from '../components/ReportDetails';

const Community = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          status: 'Lost',
        }));

        const foundData = foundSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: 'Found',
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
            return false; // discard items without location
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
    <Box px={8} py={12} bg="gray.50">
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">Join the Community</Heading>
        <Text fontSize="lg" color="gray.600" maxW="600px">
          Help reunite people with their lost belongings. Whether you've found something or lost an item, we're here to make connection easier.
        </Text>
      </VStack>

      <Box mt={12}>
        <Heading size="lg" mb={6}>Recent Reports Nearby</Heading>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4} color="gray.500">Loading reports...</Text>
          </Box>
        ) : allReports.length === 0 ? (
          <Text textAlign="center" color="gray.600" mt={8}>
            No recent reports in your area.
          </Text>
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
