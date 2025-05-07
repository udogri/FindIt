// src/pages/LostAndFound.jsx
import { Box, Heading, Text, Button, SimpleGrid, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function LostAndFound() {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Example data (you'll eventually fetch this from your backend or Firebase)
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

      <Button
        colorScheme="teal"
        mb={8}
        onClick={() => navigate('/report-item')}
      >
        Report Lost or Found Item
      </Button>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Lost Items Section */}
        <VStack align="start" bg="red.50" p={4} borderRadius="md" spacing={4}>
          <Heading size="md">Lost Items</Heading>
          {lostItems.map(item => (
            <Box key={item.id} p={3} bg="white" shadow="sm" rounded="md" w="100%">
              <Text fontWeight="bold">{item.title}</Text>
              <Text fontSize="sm" color="gray.600">{item.description}</Text>
            </Box>
          ))}
        </VStack>

        {/* Found Items Section */}
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
