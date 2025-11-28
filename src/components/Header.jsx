// src/components/Header.jsx
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Link,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  SlideFade,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { MdLogout } from 'react-icons/md';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import NotificationBell from './NotificationBell';

const Links = [
  { name: 'Home', path: '/home' },
  { name: 'Lost & Found', path: '/lost-and-found' },
  { name: 'Community', path: '/community' },
  { name: 'Places', path: '/places' },
];

const NavLink = ({ name, path, isActive, onClose }) => (
  <Link
    as={RouterLink}
    to={path}
    position="relative"
    px={3}
    py={2}
    rounded="md"
    fontSize="md"
    fontWeight="medium"
    color={isActive ? 'brand.300' : 'white'}
    transition="all 0.3s"
    _hover={{
      color: 'brand.300',
      textDecoration: 'none',
    }}
    onClick={onClose}
    _after={{
      content: '""',
      position: 'absolute',
      left: '0',
      bottom: '-2px',
      width: isActive ? '100%' : '0',
      height: '2px',
      bg: 'brand.300',
    }}
    
  >
    {name}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      backdropFilter="blur(8px)"
      bg="rgba(26, 32, 44, 0.85)"
      shadow="md"
      transition="all 0.3s ease"
    >
      <Flex h={16} align="center" justifyContent="space-between" px={4}>
        {/* Logo */}
        <Box
          color="white"
          fontWeight="bold"
          fontSize="xl"
          _hover={{
            color: 'brand.300',
            transform: 'scale(1.05)',
          }}
          transition="all 0.2s"
        >
          <RouterLink to="/home">FindIt</RouterLink>
        </Box>

        {/* Mobile Hamburger */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="transparent"
          _hover={{ bg: 'brand.600' }}
        />

        {/* Desktop Nav */}
        <HStack spacing={4} alignItems="center" display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              path={link.path}
              isActive={location.pathname === link.path}
            />
          ))}
          <NotificationBell />
          <Button
  onClick={handleLogout}
  size="md"
  px={5}
  fontWeight="semibold"
  color="white"
  bg="transparent"
  border="1px solid"
  borderColor="white"
  rounded="lg"
  transition="all 0.25s ease"
  _hover={{
    bg: "red.500",
    color: "white",
    transform: "scale(1.05)",
    shadow: "lg",
    border:"none"
  }}
  _active={{
    transform: "scale(0.98)",
    bg: "red.600",
  }}
  leftIcon={<MdLogout size={18} />}
>
  Logout
</Button>



        </HStack>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <SlideFade in={isOpen} offsetY="20px">
          <Box
            pb={4}
            display={{ md: 'none' }}
            bg="rgba(26, 32, 44, 0.85)"
            zIndex="10"
            w="100%"
            shadow="lg"
            position="absolute"
          >
            <Stack as="nav" spacing={4} px={4}>
              {Links.map((link) => (
                <NavLink
                  key={link.name}
                  name={link.name}
                  path={link.path}
                  onClose={onClose}
                  isActive={location.pathname === link.path}
                />
              ))}
              <Button
  onClick={handleLogout}
  w="100%"
  justifyContent="flex-start"
  size="md"
  px={4}
  fontWeight="semibold"
  color="white"
  bg="transparent"
  border="1px solid"
  borderColor="white"
  rounded="lg"
  transition="all 0.25s ease"
  leftIcon={<MdLogout size={18} />}
  _hover={{
    bg: "red.500",
    color: "white",
    transform: "scale(1.03)",
    shadow: "md",
    border:"none"
  }}
  _active={{
    transform: "scale(0.97)",
    bg: "red.600",
  }}
>
  Logout
</Button>



            </Stack>
          </Box>
        </SlideFade>
      )}
    </Box>
  );
}
