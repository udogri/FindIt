import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Button,
  Image,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const HomePage = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();
  const featureBg = useColorModeValue('white', 'gray.700');

  // 👇 Simulated loading delay for better UX
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [loadingAuth]);

  const handleFeatureClick = (index) => {
    switch (index) {
      case 0:
        navigate('/lost-and-found');
        break;
      case 1:
        navigate('/places'); // 👈 Now correct for "Find Nearby Locations"
        break;
      case 2:
        navigate('/community');
        break;
      default:
        break;
    }
  };
  
  

  return (
    <Box bg="neutral.50" minH="100vh" p={{ base: 4, md: 10 }}>
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <MotionBox
            textAlign="center"
            py={16}
            px={6}
            bg="rgba(26, 32, 44, 0.85)"
            color="white"
            borderRadius="2xl"
            shadow="xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="extrabold">
              Welcome, {user?.displayName || 'User'} 👋
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              mt={4}
              maxW="700px"
              mx="auto"
              color="whiteAlpha.800"
            >
              This is <b>FindIt</b> — a platform that connects people in your locality to
              report lost items or post found belongings. Let's help each other!
            </Text>
            <Button
              mt={8}
              bg="rgba(21, 24, 30, 0.85)"
              size="lg"
              px={8}
              py={6}
              onClick={() => navigate('/lost-and-found')}
            >
              Get Started
            </Button>
          </MotionBox>
        )}

        {/* Feature Highlights */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          justify="center"
          align="stretch"
        >
          {isLoading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : features.map((f, i) => (
                <MotionBox
                  key={i}
                  bg={featureBg}
                  p={8}
                  borderRadius="2xl"
                  shadow="lg"
                  textAlign="center"
                  flex="1"
                  cursor="pointer"
                  whileHover={{ scale: 1.03, boxShadow: '2xl' }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleFeatureClick(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transitionDelay={`${i * 0.15}s`}
                >
                  <Image
                    src={f.image}
                    alt={f.title}
                    boxSize="120px"
                    mx="auto"
                    mb={6}
                    objectFit="contain"
                  />
                  <Heading fontSize={{ base: 'lg', md: 'xl' }} mb={3} color="brand.700">
                    {f.title}
                  </Heading>
                  <Text fontSize={{ base: 'sm', md: 'md' }} color="neutral.600">
                    {f.text}
                  </Text>
                </MotionBox>
              ))}
        </Stack>
      </VStack>
    </Box>
  );
};

// 🦴 Skeleton for Hero Section
const SkeletonHero = () => (
  <Box
    py={16}
    px={6}
    bg="gray.100"
    borderRadius="2xl"
    shadow="md"
    textAlign="center"
  >
    <Skeleton height="30px" width="60%" mx="auto" mb={4} />
    <SkeletonText noOfLines={3} spacing="4" width="70%" mx="auto" mb={8} />
    <Skeleton height="45px" width="160px" mx="auto" borderRadius="full" />
  </Box>
);

// 🦴 Skeleton for Feature Cards
const SkeletonCard = () => (
  <Box
    p={8}
    bg="white"
    borderRadius="2xl"
    shadow="sm"
    textAlign="center"
    flex="1"
  >
    <SkeletonCircle size="120px" mx="auto" mb={6} />
    <Skeleton height="20px" width="70%" mx="auto" mb={3} />
    <SkeletonText noOfLines={2} spacing="3" width="80%" mx="auto" />
  </Box>
);

const features = [
  {
    title: 'Report Lost Items',
    text: 'Easily post reports of items you’ve lost to alert your community.',
    image: 'https://cdn-icons-png.flaticon.com/512/10080/10080431.png',
  },
  {
    title: 'Find Nearby Locations',
    text: 'Looking for a place nearby? Quickly search and discover barbershops, cafes, and other local spots around you.',
    image: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  },  
  {
    title: 'Chat & Connect',
    text: 'Use in-app messaging to reach out and coordinate item returns safely.',
    image: 'https://cdn-icons-png.flaticon.com/512/542/542638.png',
  },
];

export default HomePage;
