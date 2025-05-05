// src/pages/LandingPage.jsx
import { Box, Heading, Text, Button, Image, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import LandingPageImage from '../assets/LandingPageImage.jpg'; // Adjust the path as necessary


export default function LandingPage() {
  return (
    <Box >
      <Stack 
      spacing={8}
       justifyItems="center"

       bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(41, 41, 41, 0.75) 80%), url(${LandingPageImage})`}
       bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      h="100vh"
       >
        <Box flex={1} p={8} mt="50px" color="white" align="center"  textAlign="center">
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
          
        </Box>
      </Stack>
    </Box>
  );
}
