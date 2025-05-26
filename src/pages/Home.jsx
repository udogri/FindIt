// pages/HomePage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Button,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const HomePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.800');
  const featureBg = useColorModeValue('white', 'gray.700');

  const handleFeatureClick = (index) => {
    switch (index) {
      case 0:
        navigate('/lost-and-found');
        break;
      case 1:
        navigate('/lost-and-found');
        break;
      case 2:
        navigate('/community');
        break;
      default:
        break;
    }
  };

  return (
    <Box bg={bg} minH="100vh" p={{ base: 4, md: 10 }}>
      <VStack spacing={8} align="stretch">
        {/* Hero Section */}
        <Box
          textAlign="center"
          py={10}
          px={6}
          bgGradient="linear(to-r, teal.400, teal.600)"
          color="white"
          borderRadius="lg"
        >
          <Heading fontSize={{ base: '2xl', md: '4xl' }}>
            Welcome, {user?.displayName || 'User'} 👋
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} mt={4} maxW="600px" mx="auto">
            This is <b>FindIt</b> — a platform that connects people in your locality to
            report lost items or post found belongings. Let's help each other!
          </Text>
          <Button
            mt={6}
            colorScheme="whiteAlpha"
            variant="outline"
            size="lg"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={() => navigate('/lost-and-found')}
          >
            Get Started
          </Button>
        </Box>

        {/* Feature Highlights */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={6}
          justify="space-between"
        >
          {features.map((f, i) => (
            <MotionBox
              key={i}
              bg={featureBg}
              p={6}
              borderRadius="xl"
              shadow="md"
              textAlign="center"
              flex="1"
              cursor="pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleFeatureClick(i)}
            >
              <Image
                src={f.image}
                alt={f.title}
                boxSize="100px"
                mx="auto"
                mb={4}
                objectFit="contain"
              />
              <Heading fontSize="xl" mb={2}>
                {f.title}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {f.text}
              </Text>
            </MotionBox>
          ))}
        </Stack>

        {/* Call-to-action Section */}
        <Box textAlign="center" mt={10}>
          <Heading fontSize="2xl" mb={3}>
            Start Making a Difference
          </Heading>
          <Text mb={4}>Post a missing or found item to help others in your area.</Text>
          <Button colorScheme="teal" size="lg" onClick={() => navigate('/report-lost')}>
            Report Now
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

const features = [
  {
    title: 'Report Lost Items',
    text: 'Easily post reports of items you’ve lost to alert your community.',
    image: 'https://cdn-icons-png.flaticon.com/512/10080/10080431.png',
  },
  {
    title: 'Post Found Belongings',
    text: 'Found something? Help reunite it with its rightful owner by reporting it.',
    image: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
  },
  {
    title: 'Chat & Connect',
    text: 'Use in-app messaging to reach out and coordinate item returns safely.',
    image: 'https://cdn-icons-png.flaticon.com/512/542/542638.png',
  },
];

export default HomePage;
