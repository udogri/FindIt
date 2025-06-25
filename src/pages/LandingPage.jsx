// src/pages/LandingPage.jsx
import { Box, VStack, Text, Button, Stack, Flex, SimpleGrid, HStack, Img } from '@chakra-ui/react';
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
      <Flex h={16} bg="#34495e" px={4} align="center" justify="space-between">
        <Box color="white" fontWeight="bold" fontSize="lg">FindIt</Box>
        <Button
          
          onClick={() => navigate('/login/signup')}          color="#34495e"
          background="#FFFF"
          _hover={{ bg: "grey", color: "#FFFF" }}
          fontWeight="500"
          fontSize="sm"
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
        bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(41, 41, 41, 0.75) 80%), url(${LandingPageImage})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minHeight="100vh"
        color="white"
      >
        <Text fontSize={{ base: "30px", md: "50px" }} fontWeight="600">
          The meeting point between{" "}
          <Text as="span" color="#8C9492">
            who's looking for a lost item and who's found it
          </Text>
        </Text>
        <Button
          as={RouterLink}
          to="/login/signup"
          color="white"
          background="#34495e"
          _hover={{ bg: "transparent", color: "white", border: "1px solid white" }}
          size="lg"
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
  bg="white"
  minH="100vh"

>
  {/* Left: Text Content */}
  <Stack
  justify="center"
    spacing={6}
    maxW={{ base: "100%", md: "50%" }}
    align={{ base: "center", md: "flex-start" }}
    textAlign={{ base: "center", md: "left" }}
  >
    <Text fontSize="15px" color="#FAA51C" fontWeight="700">
      about FindIt
    </Text>

    <Text fontSize={{ base: "28px", md: "40px" }} fontWeight="600" color="black" lineHeight="1.2">
      Helping you find{" "}
      <Text as="span" color="#8C9492">
        your lost items
      </Text>
    </Text>

    <Text
      fontSize={{ base: "15px", md: "17px" }}
      color="#71717A"
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
      <Box bg="#1f2832" textAlign="center" py="80px" px={{ base: "30px", md: "60px" }} color="white">
        <Box display={{ base: "grid", md: "flex" }} justifyContent="center" alignItems="center">
          <Text
            fontSize={{ base: "20px", md: "30px", lg: "50px" }}
            fontWeight="700"
            textAlign="center"
            mr={{ base: 0, md: "50px", lg: "150px" }}
            mb={{ base: "20px", md: 0 }}
          >
            Our{" "}
            <Text as="span" color="#8C9492">
              Impact
            </Text>
          </Text>
          <Box>
            <Flex direction={{ base: "column", md: "row" }} gap="10px" justify="center">
              {[
                { count: '100+', label: 'Items found' },
                { count: '50+', label: 'Items recovered' },
                { count: '160+', label: 'Satisfied people' }
              ].map((item, idx) => (
                <VStack
                  key={idx}
                  borderRadius="15px"
                  borderLeft="3px solid #27333f"
                  p="30px"
                  mb={{ base: "20px", md: "0" }}
                >
                  <Text fontSize={{ base: "30px", md: "35px", lg: "48px" }} fontWeight="600" color="#98ACA3">
                    {item.count}
                  </Text>
                  <Text fontSize={{ base: "13px", md: "15px", lg: "17px" }} fontWeight="400" color="white">
                    {item.label}
                  </Text>
                </VStack>
              ))}
            </Flex>
          </Box>
        </Box>


      </Box>
      <Box py="80px" px={{ base: "30px", md: "60px" }} bg="gray.100">
  <Text textAlign="center" fontSize={{ base: "25px", md: "40px" }} fontWeight="700" mb={10}>
    What Our Users Say
  </Text>
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
      <Box key={idx} bg="white" p={6} borderRadius="md" boxShadow="md">
        <Text fontSize="md" color="gray.700" mb={4}>"{testimonial.text}"</Text>
        <Text fontWeight="bold" color="#34495e">{testimonial.name}</Text>
      </Box>
    ))}
  </SimpleGrid>
</Box>

{/* Call to Action Section */}
<Box bg="#27333f" minH="100vh" color="white" py="60px" px={{ base: "20px", md: "40px" }} alignContent="center" textAlign="center" bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(41, 41, 41, 0.75) 80%), url(${lostBag})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover">
  <Text fontSize={{ base: "24px", md: "40px" }} fontWeight="bold" mb={6}>
    Help us reunite more people with their lost items
  </Text>
  <Text fontSize="lg" mb={8}>
    Your small action can make a big difference. Join the FindIt community today!
  </Text>
  <Button
          as={RouterLink}
          to="/login/signup"
          color="white"
          background="#34495e"
          _hover={{ bg: "transparent", color: "white", border: "1px solid white" }}
          size="lg"
        >
          Get Started
        </Button>
</Box>

{/* Contact Us Section */}
{/* Contact Us Section */}
<Box py="60px" px={{ base: "30px", md: "80px" }} bg="gray.50" textAlign="center">
  <Text fontSize={{ base: "25px", md: "35px" }} fontWeight="bold" mb={10}>
    Contact Us
  </Text>

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
    <Box flex="1" minW={{ base: "100%", md: "400px" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Message sent successfully!");
        }}
      >
        <FormControl isRequired mb={4}>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Your name" />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Your email" />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Message</FormLabel>
          <Textarea placeholder="Your message" />
        </FormControl>

        <Button
          type="submit"
          bg="#34495e"
          color="white"
          _hover={{ bg: "#2c3e50" }}
          w="full"
        >
          Send Message
        </Button>
      </form>
    </Box>

    {/* Social Media */}
    <Box flex="1" minW={{ base: "100%", md: "300px" }} textAlign="center">
      <Text fontWeight="bold" mb={4}>
        Connect with us:
      </Text>
      <HStack spacing={4} justify="center">
        <IconButton as="a" href="https://facebook.com" icon={<FaFacebook />} aria-label="Facebook" variant="ghost" />
        <IconButton as="a" href="https://twitter.com" icon={<FaTwitter />} aria-label="Twitter" variant="ghost" />
        <IconButton as="a" href="https://instagram.com" icon={<FaInstagram />} aria-label="Instagram" variant="ghost" />
        <IconButton as="a" href="https://linkedin.com" icon={<FaLinkedin />} aria-label="LinkedIn" variant="ghost" />
      </HStack>
    </Box>
  </Stack>
</Box>


    </Box>
  );
}
