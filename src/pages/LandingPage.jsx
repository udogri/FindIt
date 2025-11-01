// src/pages/LandingPage.jsx
import { Box, VStack, Text, Button, Stack, Flex, SimpleGrid, HStack, Img, Heading } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LandingPageImage from '../Assets/LandingPageImage.jpg';
import LostItem from '../Assets/LostItem.png';
import lostBag from '../Assets/lostBag.webp';
import { Input, Textarea, FormControl, FormLabel, IconButton } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top Bar */}
      <Flex h={16} bg="brand.700" px={4} align="center" justify="space-between" shadow="md">
        <Box color="white" fontWeight="bold" fontSize="xl">FindIt</Box>
        <Button
          onClick={() => navigate('/login/signup')}
          colorScheme="brand"
          variant="solid"
          size="sm"
        >
          Login
        </Button>
      </Flex>

      {/* Hero Section */}
      <Stack
        spacing={8}
        justify="center"
        align="center"
        textAlign="center"
        px={6}
        py={20}
        bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 80%), url(${LandingPageImage})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minHeight="100vh"
        color="white"
      >
        <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="extrabold" lineHeight="shorter">
          The meeting point between{" "}
          <Text as="span" color="accent.300">
            who's looking for a lost item and who's found it
          </Text>
        </Heading>
        <Button
          as={RouterLink}
          to="/login/signup"
          colorScheme="brand"
          size="lg"
          px={8}
          py={6}
        >
          Get Started
        </Button>
      </Stack>

      {/* About Section */}
      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
        justify="space-between"
        px={{ base: 6, md: 16 }}
        py={{ base: 10, md: 20 }}
        gap={{ base: 10, md: 16 }}
        bg="neutral.50"
      >
        {/* Left: Text Content */}
        <Stack
          justify="center"
          spacing={6}
          maxW={{ base: "100%", md: "50%" }}
          align={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
        >
          <Text fontSize="sm" color="accent.500" fontWeight="bold" textTransform="uppercase">
            about FindIt
          </Text>

          <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" color="neutral.900" lineHeight="1.2">
            Helping you find{" "}
            <Text as="span" color="brand.500">
              your lost items
            </Text>
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="neutral.700"
            maxW={{ base: "100%", sm: "400px", md: "500px" }}
          >
            FindIt is a community-driven platform dedicated to helping people find lost items and return
            found belongings. Whether it's a misplaced phone, a lost pet, or a found wallet, FindIt connects
            people in need with those who can help.
          </Text>
        </Stack>

        {/* Right: Image */}
        <Box w={{ base: "100%", md: "80%" }} textAlign="center">
          <Img
            src={LostItem}
            alt="Lost Item Box"
            maxW="100%"
            h="auto"
            mx="auto"
            objectFit="contain"
          />
        </Box>
      </Flex>

      {/* Impact Section */}
      <Box bg="brand.800" textAlign="center" py="80px" px={{ base: "30px", md: "60px" }} color="white">
        <Flex direction={{ base: "column", md: "row" }} justifyContent="center" alignItems="center" gap={10}>
          <Heading
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="extrabold"
            textAlign="center"
            mb={{ base: "20px", md: 0 }}
          >
            Our{" "}
            <Text as="span" color="accent.300">
              Impact
            </Text>
          </Heading>
          <Flex direction={{ base: "column", md: "row" }} gap="20px" justify="center">
            {[
              { count: '100+', label: 'Items found' },
              { count: '50+', label: 'Items recovered' },
              { count: '160+', label: 'Satisfied people' }
            ].map((item, idx) => (
              <VStack
                key={idx}
                borderRadius="xl"
                borderLeft="4px solid"
                borderColor="brand.600"
                p="30px"
                bg="brand.700"
                shadow="lg"
                mb={{ base: "20px", md: "0" }}
              >
                <Text fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="accent.300">
                  {item.count}
                </Text>
                <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="medium" color="whiteAlpha.800">
                  {item.label}
                </Text>
              </VStack>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* Testimonials Section */}
      <Box py="80px" px={{ base: "30px", md: "60px" }} bg="neutral.100">
        <Heading textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" mb={10}>
          What Our Users Say
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {[
            {
              name: 'Ibenye J.',
              text: "I found my lost Dog through FindIt in just 2 days. Unbelievable! I'm so grateful."
            },
            {
              name: 'Musa B.',
              text: "Returned a found wallet through this app. The joy on the owner's face was priceless!"
            },
            {
              name: 'Fatima L.',
              text: "Simple, fast, and effective. I always check here first when something’s lost."
            }
          ].map((testimonial, idx) => (
            <Box key={idx} bg="white" p={8} borderRadius="xl" boxShadow="xl" _hover={{ transform: 'translateY(-5px)', transition: '0.2s' }}>
              <Text fontSize="lg" color="neutral.700" mb={4} fontStyle="italic">"{testimonial.text}"</Text>
              <Text fontWeight="bold" color="brand.600" fontSize="md">{testimonial.name}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Call to Action Section */}
      <Box
        bg="brand.900"
        minH="70vh"
        color="white"
        py="60px"
        px={{ base: "20px", md: "40px" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 80%), url(${lostBag})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
      >
        <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="extrabold" mb={6}>
          Help us reunite more people with their lost items
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl" }} mb={8} maxW="800px">
          Your small action can make a big difference. Join the FindIt community today!
        </Text>
        <Button
          as={RouterLink}
          to="/login/signup"
          colorScheme="accent"
          size="lg"
          px={10}
          py={7}
        >
          Get Started
        </Button>
      </Box>

      {/* Contact Us Section */}
      <Box py="80px" px={{ base: "30px", md: "80px" }} bg="neutral.50" textAlign="center">
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" mb={10}>
          Contact Us
        </Heading>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={10}
          justify="center"
          align="center"
          maxW="1000px"
          mx="auto"
          textAlign="left"
        >
          {/* Contact Form */}
          <Box flex="1" minW={{ base: "100%", md: "400px" }} bg="white" p={8} borderRadius="xl" boxShadow="xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent successfully!");
              }}
            >
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Your name" size="lg" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Your email" size="lg" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea placeholder="Your message" size="lg" />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  w="full"
                  size="lg"
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Social Media */}
          <Box flex="1" minW={{ base: "100%", md: "300px" }} textAlign="center">
            <Text fontWeight="bold" mb={4} fontSize="xl" color="neutral.800">
              Connect with us:
            </Text>
            <HStack spacing={6} justify="center">
              <IconButton as="a" href="https://facebook.com" icon={<FaFacebook />} aria-label="Facebook" variant="ghost" color="brand.500" fontSize="3xl" _hover={{ color: 'brand.600' }} />
              <IconButton as="a" href="https://twitter.com" icon={<FaTwitter />} aria-label="Twitter" variant="ghost" color="brand.500" fontSize="3xl" _hover={{ color: 'brand.600' }} />
              <IconButton as="a" href="https://instagram.com" icon={<FaInstagram />} aria-label="Instagram" variant="ghost" color="brand.500" fontSize="3xl" _hover={{ color: 'brand.600' }} />
              <IconButton as="a" href="https://linkedin.com" icon={<FaLinkedin />} aria-label="LinkedIn" variant="ghost" color="brand.500" fontSize="3xl" _hover={{ color: 'brand.600' }} />
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
