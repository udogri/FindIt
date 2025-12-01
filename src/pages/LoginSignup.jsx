import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Text,
  Link,
} from '@chakra-ui/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import newHero from '../Assets/newHero.jpg';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });

        toast({
          title: 'Account created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        toast({
          title: 'Logged in successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage={`linear-gradient(to right, rgba(24, 23, 23, 0.6) 0%, rgba(0, 0, 0, 0.8) 80%), url(${newHero})`}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      py={10}
    >
      <VStack
        spacing={6}
        p={8}
        boxShadow="xl"
        bg="white"
        borderRadius="xl"
        width={{ base: "90%", sm: "400px" }}
        textAlign="center"
      >
        <Heading size="l" color="rgba(26, 32, 44, 0.85)">
          FindIt
        </Heading>
        <Heading size="xl" color="rgba(26, 32, 44, 0.85)" mb={4}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </Heading>

        {isSignup && (
          <FormControl>
            <FormLabel color="neutral.700">Username</FormLabel>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="lg"
            />
          </FormControl>
        )}

        <FormControl>
          <FormLabel color="neutral.700">Email</FormLabel>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
          />
        </FormControl>

        <FormControl>
          <FormLabel color="neutral.700">Password</FormLabel>
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
          />
        </FormControl>

        <Button colorScheme="rgba(26, 32, 44, 0.85)" width="full" onClick={handleSubmit} size="lg" mt={4}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </Button>

        <Text fontSize="md" color="neutral.600">
          {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
          {' '}
          <Link color="rgba(26, 32, 44, 0.85)" fontWeight="bold" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginSignup;
