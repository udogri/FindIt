

import React from 'react';
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
} from '@chakra-ui/react';

const mockReports = [
  {
    id: 1,
    title: "Lost Dog - Golden Retriever",
    description: "Last seen around GRA Phase 2, Port Harcourt.",
    image: "/assets/lost-dog.jpg",
    status: "Lost",
  },
  {
    id: 2,
    title: "Found Backpack",
    description: "Found near Yaba bus stop, contains school books.",
    image: "/assets/found-backpack.jpg",
    status: "Found",
  },
];

const Community = () => {
  return (
    <Box px={8} py={12} bg="gray.50">
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">Join the Community</Heading>
        <Text fontSize="lg" color="gray.600" maxW="600px">
          Help reunite people with their lost belongings. Whether you've found
          something or lost an item, we're here to make connection easier.
        </Text>
        <HStack spacing={4}>
          <Button colorScheme="teal">Report Lost Item</Button>
          <Button variant="outline" colorScheme="teal">
            Report Found Item
          </Button>
        </HStack>
      </VStack>

      <Box mt={12}>
        <Heading size="lg" mb={6}>Recent Reports</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {mockReports.map((report) => (
            <Box
              key={report.id}
              bg="white"
              p={4}
              shadow="md"
              borderRadius="md"
              borderLeft="6px solid"
              borderColor={report.status === "Lost" ? "red.400" : "green.400"}
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
              <Text fontSize="xs" mt={2} fontWeight="bold" color={report.status === "Lost" ? "red.500" : "green.500"}>
                Status: {report.status}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box mt={16} textAlign="center">
        <Heading size="md" mb={4}>Your Help Matters</Heading>
        <Text maxW="600px" mx="auto" color="gray.600">
          Every shared post, every report, every watchful eye counts.
          Be part of the solution — help others and let others help you.
        </Text>
      </Box>
    </Box>
  );
};

export default Community;
