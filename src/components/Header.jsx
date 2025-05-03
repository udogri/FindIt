// src/components/Header.jsx
import { Box, Flex, HStack, IconButton, useDisclosure, Stack, Link } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const Links = [
  { name: 'Home', path: '/' },
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
    _hover={{ textDecoration: 'none', bg: 'gray.200' }}
    onClick={onClose} // call onClose to close the dropdown on click
  >
    {name}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="teal.500" px={4} position="relative">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box color="white" fontWeight="bold">FindIt</Box>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link.name} name={link.name} path={link.path} />
          ))}
        </HStack>
      </Flex>

      {isOpen && (
        <Box
          pb={4}
          display={{ md: 'none' }}
          position="absolute"
          top="63px" // adjust based on your header height
          bg="teal.500"
          zIndex="10"
          left="0"
          w="100%"
        >
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} onClose={onClose} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
