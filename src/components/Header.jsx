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
import { auth } from '../firebase';
import NotificationBell from './NotificationBell';

const Links = [
  { name: 'Home', path: '/home' },
  { name: 'Lost & Found', path: '/lost-and-found' },
  { name: 'Places', path: '/places' },
  { name: 'Community', path: '/community' },
];

const NavLink = ({ name, path, onClose }) => (
  <Link
    as={RouterLink}
    to={path}
    px={3}
    py={2}
    rounded="md"
    fontSize="md"
    fontWeight="medium"
    color="white"
    _hover={{ bg: 'brand.600' }}
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
    <Box bg="brand.700" px={4} position="relative" shadow="md">
      <Flex h={16} align="center" justifyContent="space-between">
        <Box color="white" fontWeight="bold" fontSize="xl">FindIt</Box>
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
        <HStack
          spacing={4}
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          {Links.map((link) => (
            <NavLink key={link.name} name={link.name} path={link.path} />
          ))}
          <NotificationBell />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdLogout />}
              fontSize="xl"
              color="white"
              bg="transparent"
              _hover={{ bg: 'brand.600' }}
              _focus={{ boxShadow: 'none' }}
            />
            <MenuList bg="brand.700" border="none" shadow="lg">
              <MenuItem
                onClick={handleLogout}
                bg="brand.700"
                _hover={{ bg: 'brand.600', color: 'white' }}
                color="white"
              >
                Confirm Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {isOpen && (
        <Box
          pb={4}
          display={{ md: 'none' }}
          position="absolute"
          bg="brand.700"
          top="64px"
          zIndex="10"
          left="0"
          w="100%"
          shadow="lg"
        >
          <Stack as="nav" spacing={4} px={4}>
            {Links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} onClose={onClose} />
            ))}
            <NotificationBell />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MdLogout />}
                fontSize="xl"
                color="white"
                bg="transparent"
                _hover={{ bg: 'brand.600' }}
                _focus={{ boxShadow: 'none' }}
              />
              <MenuList bg="brand.700" border="none" shadow="lg">
                <MenuItem
                  onClick={handleLogout}
                  bg="brand.700"
                  _hover={{ bg: 'brand.600', color: 'white' }}
                  color="white"
                >
                  Confirm Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
