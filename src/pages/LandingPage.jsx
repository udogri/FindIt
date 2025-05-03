// src/pages/LandingPage.jsx
import { Box, Heading, Text, Button, Image, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function LandingPage() {
  return (
    <Box p={8}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="center">
        <Box flex={1}>
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to FindIt
          </Heading>
          <Text fontSize="lg" mb={6}>
            Your community-driven platform to report and find lost items.
          </Text>
          <Button as={RouterLink} to="/lost-and-found" colorScheme="teal" size="lg">
            Get Started
          </Button>
        </Box>
        <Box flex={1}>
          <Image
            src="https://source.unsplash.com/600x400/?lost,found"
            alt="Lost and Found"
            borderRadius="md"
          />
        </Box>
      </Stack>
    </Box>
  );
}
