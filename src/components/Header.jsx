// src/components/Header.jsx
import {
  Box, Flex, HStack, IconButton, useDisclosure, Stack, Link, Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { MdLogout } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // adjust the path to your Firebase config

const Links = [
  { name: 'Home', path: '/home' },
  { name: 'Lost & Found', path: '/lost-and-found' },
  { name: 'Community', path: '/community' },
];

const NavLink = ({ name, path, onClose }) => (
  <Link
    as={RouterLink}
    to={path}
    px={2}
    py={1}
    rounded="md"
    _hover={{ bg: '#3c5a70' }}
    onClick={onClose}
  >
    {name}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <Box bg="#34495e" px={4} position="relative">
      <Flex h={16} align="center" justifyContent="space-between">
        <Box color="white" fontWeight="bold">FindIt</Box>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack
          color="white"
          fontWeight="600"
          background="#34495e"
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          {Links.map((link) => (
            <NavLink key={link.name} name={link.name} path={link.path} />
          ))}
          <Flex  flex="1">
          <Menu>
  <MenuButton
    as={IconButton}
    icon={<MdLogout />}
    fontSize="24px"
    color="white"
    bg="transparent"
    _hover={{
      transform: 'scale(1.2)',
      transition: 'transform 0.2s ease-in-out',
      bg: 'transparent',
    }}
    _focus={{ boxShadow: 'none', bg: 'transparent' }}
    _active={{ bg: 'transparent' }}
    _expanded={{ bg: 'transparent' }} // when dropdown is open
  />
  <MenuList bg="#34495e" border="none">
    <MenuItem
      onClick={handleLogout}
      bg="#34495e"
      _hover={{ bg: '#2c3e50', color: 'white' }}
      color="white"
    >
      Confirm Logout
    </MenuItem>
  </MenuList>
</Menu>


      </Flex>
        </HStack>
      </Flex>

      {isOpen && (
        <Box
          pb={4}
          display={{ md: 'none' }}
          position="absolute"
          bg="#34495e"
          top="63px"
          bg="#34495e"
          zIndex="10"
          left="0"
          w="100%"
        >
          <Stack as="nav" bg="#34495e" color="white" fontWeight="600" spacing={4} px={4}>
            {Links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} onClose={onClose} />
            ))}
            <Flex justify="flex-start" flex="1">
            <Menu>
  <MenuButton
    as={IconButton}
    icon={<MdLogout />}
    fontSize="24px"
    color="white"
    bg="transparent"
    _hover={{
      transform: 'scale(1.2)',
      transition: 'transform 0.2s ease-in-out',
      bg: 'transparent',
    }}
    _focus={{ boxShadow: 'none', bg: 'transparent' }}
    _active={{ bg: 'transparent' }}
    _expanded={{ bg: 'transparent' }} // when dropdown is open
  />
  <MenuList bg="#34495e" border="none">
    <MenuItem
      onClick={handleLogout}
      bg="#34495e"
      _hover={{ bg: '#2c3e50', color: 'white' }}
      color="white"
    >
      Confirm Logout
    </MenuItem>
  </MenuList>
</Menu>



      </Flex>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
