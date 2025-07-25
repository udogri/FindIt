// src/components/Footer.jsx
import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box bg="#34495e" color="white" py={4} textAlign="center">
      <Text fontSize={{base: "12px", md: "16px"}}>&copy; {new Date().getFullYear()} FindIt. All rights reserved.</Text>
    </Box>
  );
}
