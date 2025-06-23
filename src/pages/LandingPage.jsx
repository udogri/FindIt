// src/pages/LandingPage.jsx
import { Box, VStack, Text, Button, Stack, Flex } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LandingPageImage from '../Assets/LandingPageImage.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top Bar */}
      <Flex h={16} bg="#34495e" px={4} align="center" justify="space-between">
        <Box color="white" fontWeight="bold" fontSize="lg">FindIt</Box>
        <Button
          
          onClick={() => navigate('/login/signup')}          color="white"
          background="#FAA51C"
          _hover={{ bg: "white", color: "#34495e" }}
          fontWeight="500"
          fontSize="sm"
        >
          Login
        </Button>
      </Flex>

      {/* Hero Section */}
      <Stack
        spacing={8}
        justify="center"
        align="center"
        textAlign="center"
        px={6}
        py={20}
        bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(41, 41, 41, 0.75) 80%), url(${LandingPageImage})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        color="white"
      >
        <Text fontSize={{ base: "30px", md: "50px" }} fontWeight="600">
          The meeting point between{" "}
          <Text as="span" color="#8C9492">
            who's looking for a lost item and who's found it
          </Text>
        </Text>
        <Button
          as={RouterLink}
          to="/login/signup"
          color="white"
          background="#34495e"
          _hover={{ bg: "transparent", color: "white", border: "1px solid white" }}
          size="lg"
        >
          Get Started
        </Button>
      </Stack>

      {/* About Section */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="left"
        justify="left"
        gap={10}
        px={8}
        py={20}
        bg="white"
        color="white"
      >
        <Stack maxW="661px" align="left" textAlign="left">
          <Text fontSize="15px" w="fit-content" color="#FAA51C" fontWeight="700">
            about FindIt
          </Text>
          <Text fontSize={{ base: "25px", md: "50px" }} fontWeight="600" color="black">
            Helping you find{" "}
            <Text as="span" color="#8C9492">
              your lost items
            </Text>
          </Text>
          <Text fontSize={{ base: "10px", md: "17px" }} color="#71717A" w={{ base: "300px", md: "500px" }}>
            FindIt is a community-driven platform dedicated to helping people find lost items and return
            found belongings. Whether it's a misplaced phone, a lost pet, or a found wallet, FindIt
            connects people in need with those who can help.
          </Text>
          <Flex>
            <Button
              w={{ base: "150px", md: "171px" }}
              bg="#34495e"
              fontWeight="400"
              fontSize={{ base: "12px", md: "14px" }}
              px="28px"
              py="10px"
              color="white"
              _hover={{ bg: "transparent", color: "#34495e", border: "1px solid #34495e" }}
            >
              Learn more about us
            </Button>
          </Flex>
        </Stack>
      </Flex>

      {/* Impact Section */}
      <Box bg="#091C13" textAlign="center" py="80px" px={{ base: "30px", md: "60px" }} color="white">
        <Box display={{ base: "grid", md: "flex" }} justifyContent="center" alignItems="center">
          <Text
            fontSize={{ base: "20px", md: "30px", lg: "50px" }}
            fontWeight="700"
            textAlign="center"
            mr={{ base: 0, md: "50px", lg: "150px" }}
            mb={{ base: "20px", md: 0 }}
          >
            Our{" "}
            <Text as="span" color="#8C9492">
              Impact
            </Text>
          </Text>
          <Box>
            <Flex direction={{ base: "column", md: "row" }} gap="10px" justify="center">
              {[
                { count: '100+', label: 'Items found' },
                { count: '50+', label: 'Items recovered' },
                { count: '160+', label: 'Satisfied people' }
              ].map((item, idx) => (
                <VStack
                  key={idx}
                  borderRadius="15px"
                  borderLeft="3px solid #39996B29"
                  p="30px"
                  mb={{ base: "20px", md: "0" }}
                >
                  <Text fontSize={{ base: "30px", md: "35px", lg: "48px" }} fontWeight="600" color="#98ACA3">
                    {item.count}
                  </Text>
                  <Text fontSize={{ base: "13px", md: "15px", lg: "17px" }} fontWeight="400" color="white">
                    {item.label}
                  </Text>
                </VStack>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
