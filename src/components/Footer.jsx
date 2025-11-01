// src/components/Footer.jsx
import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box bg="brand.800" color="white" py={6} textAlign="center" shadow="inner">
      <Text fontSize={{ base: "sm", md: "md" }}>&copy; {new Date().getFullYear()} FindIt. All rights reserved.</Text>
    </Box>
  );
}
