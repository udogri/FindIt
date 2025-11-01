import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Button,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const HomePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
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
    <Box bg="neutral.50" minH="100vh" p={{ base: 4, md: 10 }}>
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        <Box
          textAlign="center"
          py={16}
          px={6}
          bg="brand.600"
          color="white"
          borderRadius="2xl"
          shadow="xl"
        >
          <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold">
            Welcome, {user?.displayName || 'User'} 👋
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} mt={4} maxW="700px" mx="auto" color="whiteAlpha.800">
            This is <b>FindIt</b> — a platform that connects people in your locality to
            report lost items or post found belongings. Let's help each other!
          </Text>
          <Button
            mt={8}
            colorScheme="accent"
            size="lg"
            px={8}
            py={6}
            onClick={() => navigate('/lost-and-found')}
          >
            Get Started
          </Button>
        </Box>

        {/* Feature Highlights */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          justify="center"
          align="stretch"
        >
          {features.map((f, i) => (
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
            >
              <Image
                src={f.image}
                alt={f.title}
                boxSize="120px"
                mx="auto"
                mb={6}
                objectFit="contain"
              />
              <Heading fontSize={{ base: "lg", md: "xl" }} mb={3} color="brand.700">
                {f.title}
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="neutral.600">
                {f.text}
              </Text>
            </MotionBox>
          ))}
        </Stack>
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
