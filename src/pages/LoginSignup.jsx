// components/LoginSignup.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
  useToast,
  Divider,
} from '@chakra-ui/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    try {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: username });
        }
      
        toast({
          title: 'Success',
          description: isLogin ? 'Signed in successfully!' : 'Account created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      
        navigate('/'); // 👈 redirect to home
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: 'Authentication Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Signed in with Google', status: 'success' });
    } catch (error) {
      toast({
        title: 'Google Sign-In Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading size="lg" mb={4}>
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Heading>
      <VStack spacing={4}>
        {!isLogin && (
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button colorScheme="teal" w="full"  onClick={handleEmailAuth}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>

        <Divider />

        <Button colorScheme="red" w="full" onClick={handleGoogleSignIn}>
          Continue with Google
        </Button>

        <Text fontSize="sm" color="gray.600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Button variant="link" colorScheme="blue" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginSignup;
// components/LoginSignup.jsx   