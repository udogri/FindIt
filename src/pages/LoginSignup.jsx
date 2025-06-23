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
} from '@chakra-ui/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
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
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
    {/* <text>FindIt</text> */}
      <VStack spacing={4} p={6} boxShadow="md" bg="white" borderRadius="md" width="sm">
        <Heading>{isSignup ? 'Sign Up' : 'Log In'}</Heading>

        {isSignup && (
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
        )}

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" width="full" onClick={handleSubmit}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </Button>

        <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginSignup;
