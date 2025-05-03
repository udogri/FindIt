// src/components/Footer.jsx
import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box bg="teal.500" color="white" py={4} textAlign="center">
      <Text>&copy; {new Date().getFullYear()} FindIt. All rights reserved.</Text>
    </Box>
  );
}
