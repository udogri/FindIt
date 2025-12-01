// src/pages/LandingPage.jsx
import {
  Box,
  VStack,
  Text,
  Button,
  Stack,
  Flex,
  SimpleGrid,
  HStack,
  Img,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useToast,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import newHero from "../Assets/newHero.jpg";
import LostItem from "../Assets/LostItem.png";
import locationPin from "../Assets/locationPin.png";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import LandingPageHeader from "../components/LandingPageHeader";
import { useState } from "react";
import Footer from "../components/Footer";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStack = motion(Stack);

export default function LandingPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast({
      title: "Message sent!",
      description: "We'll get back to you shortly.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  // Simple fade-up animation
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      {/* Top Bar */}
      <LandingPageHeader />

      {/* Hero Section */}
      <MotionFlex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        px={{ base: "20px", lg: "30px" }}
        py={20}
        bgImage={`linear-gradient(to right, rgba(24, 23, 23, 0.6) 0%, rgba(0, 0, 0, 0.8) 80%), url(${newHero})`}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minHeight="100vh"
        color="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
        <Stack spacing={6} maxW="846px" align="center" textAlign="center">
          <Text fontSize={{ base: "30px", md: "50px" }} fontWeight="600" color="white">
            Looking for a lost item or places of interest around you?{" "}
            <Text as="span" color="accent.500">
              Look no further!
            </Text>
          </Text>
          <Text fontSize={{ base: "12px", md: "18px" }}>
            Join us in helping people find missing items and locate places of interest around the city.
          </Text>
          <Button
            _focus={{ boxShadow: "none" }}
            w={{ base: "100%", md: "171px" }}
            bg="white"
            fontSize="14px"
            px="28px"
            py="10px"
            color="#2E2B24"
            _hover={{ bg: "transparent", color: "white", border: "1px solid" }}
            onClick={() => navigate("/login/signup")}
          >
            Get started
          </Button>
        </Stack>
      </MotionFlex>

      {/* About Section */}
      <MotionFlex
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
        justify="space-between"
        px={6}
        py={{ base: 10, md: 20 }}
        gap={{ base: 10, md: 16 }}
        bg="neutral.50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
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
            <Text as="span" color="accent.500">
              your lost items
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="neutral.700" maxW={{ base: "100%", sm: "400px", md: "500px" }}>
            FindIt is a community-driven platform dedicated to helping people find lost items and return
            found belongings. Whether it's a misplaced phone, a lost pet, or a found wallet, FindIt connects
            people in need with those who can help.
          </Text>
        </Stack>

        <Box w={{ base: "100%", md: "80%" }} textAlign="center">
          <Img src={LostItem} alt="Lost Item Box" w="100" h="auto" mx="auto" objectFit="contain" />
        </Box>
      </MotionFlex>

      {/* Location Finder Section */}
      <MotionFlex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        px={4}
        py={{ base: 10, md: 20 }}
        gap={{ base: 10, md: 16 }}
        bg="neutral.100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
        <Box w={{ base: "100%", md: "80%" }} textAlign="center">
          <Img src={locationPin} alt="Location Finder" w="70%" h="auto" mx="auto" objectFit="contain" />
        </Box>
        <Stack
          justify="center"
          spacing={6}
          maxW={{ base: "100%", md: "50%" }}
          align={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
        >
          <Text fontSize="sm" color="accent.500" fontWeight="bold" textTransform="uppercase">
            Discover Places
          </Text>
          <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" color="neutral.900" lineHeight="1.2">
            Explore and find{" "}
            <Text as="span" color="accent.500">
              places of interest
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="neutral.700" maxW={{ base: "100%", sm: "400px", md: "500px" }}>
            Beyond lost and found, FindIt also offers a powerful location finder. Search for places you're interested in,
            discover new spots, and get directions. It's your go-to tool for exploring your surroundings.
          </Text>
        </Stack>
      </MotionFlex>

      {/* Impact Section */}
      <MotionBox
        bg="rgba(26, 32, 44, 0.85)"
        textAlign="center"
        py="80px"
        px={6}
        color="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
        <Flex direction={{ base: "column", md: "row" }} justifyContent="center" alignItems="center" gap={10}>
          <Heading fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight="extrabold" textAlign="center" mb={{ base: "20px", md: 0 }}>
            Our{" "}
            <Text as="span" color="accent.500">
              Impact
            </Text>
          </Heading>
          <Flex align="stretch" direction={{ base: "column", md: "row" }} gap="20px" w="100%">
            {[
              { count: "100+", label: "Items found" },
              { count: "50+", label: "Items recovered" },
              { count: "160+", label: "Satisfied people" },
            ].map((item, idx) => (
              <VStack
                key={idx}
                borderRadius="xl"
                borderLeft="4px solid"
                borderColor="rgba(0, 0, 0, 0.85)"
                p="30px"
                w="100%"
                bg="rgba(26, 32, 44, 0.4)"
                shadow="lg"
                mb={{ base: "20px", md: "0" }}
              >
                <Text fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold" color="accent.500">
                  {item.count}
                </Text>
                <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="medium" color="whiteAlpha.800">
                  {item.label}
                </Text>
              </VStack>
            ))}
          </Flex>
        </Flex>
      </MotionBox>

      {/* Testimonials Section */}
      <MotionBox py="80px" px={{ base: "20px", md: "30px" }} bg="neutral.100" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Heading textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" mb={12} color="neutral.900">
          What Our Users Say
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} maxW="1200px" mx="auto">
          {[
            { name: "Ibenye J.", text: "I found my lost Dog through FindIt in just 2 days. Unbelievable! I'm so grateful." },
            { name: "Musa B.", text: "Returned a found wallet through this app. The joy on the owner's face was priceless!" },
            { name: "Fatima L.", text: "Simple, fast, and effective. I always check here first when something’s lost." },
          ].map((t, idx) => (
            <MotionBox
              key={idx}
              bg="white"
              p={8}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="neutral.200"
              transition="0.25s ease"
              _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <HStack spacing={4} mb={4} align="center">
                <Box w="50px" h="50px" borderRadius="full" bg="neutral.300" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="lg" color="neutral.700">
                  {t.name.charAt(0)}
                </Box>
                <Text fontWeight="bold" fontSize="lg" color="accent.500">
                  {t.name}
                </Text>
              </HStack>
              <Text fontSize="md" color="neutral.700" lineHeight="1.7" fontStyle="italic">
                "{t.text}"
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>

      {/* FAQ Section */}
      <MotionBox bg="neutral.200" py="80px" px={{ base: "20px", md: "60px" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Heading textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" mb={10} color="neutral.900">
          Frequently Asked Questions
        </Heading>

        <Box mx="auto">
          <Accordion allowToggle>
            {[
              { q: "How does FindIt work?", a: "FindIt lets users report lost or found items, browse listings, and connect with owners or finders quickly and safely." },
              { q: "Is FindIt free to use?", a: "Yes. All core features such as reporting, searching, and recovering items are free." },
              { q: "How do I report a lost item?", a: "Create an account, click 'Report Lost Item', fill in the details, and upload an image if possible to improve visibility." },
              { q: "Can I search for places of interest?", a: "Yes! FindIt includes a location discovery feature that helps you explore important or useful places around your city." },
              { q: "Is my data safe on FindIt?", a: "Yes. Only essential information is shared to help match items to their owners. Your information is handled securely." },
            ].map((faq, idx) => (
              <AccordionItem key={idx} borderRadius="lg" overflow="hidden" mb={4} bg="white" boxShadow="md">
                <h2>
                  <AccordionButton _expanded={{ bg: "accent.500", color: "white" }}>
                    <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                      {faq.q}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color="neutral.700" fontSize="md">
                  {faq.a}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </MotionBox>

      {/* Contact Section */}
      <MotionBox py="80px" px={{ base: "30px", md: "80px" }} bg="neutral.50" textAlign="center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" mb={10}>
          Contact Us
        </Heading>

        <Stack direction={{ base: "column", md: "row" }} spacing={10} justify="center" align="center" maxW="1000px" mx="auto" textAlign="left">
          <Box flex="1" minW={{ base: "100%", md: "400px" }} bg="white" p={8} borderRadius="xl" boxShadow="xl">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" placeholder="Your name" size="lg" value={formData.name} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" placeholder="Your email" size="lg" value={formData.email} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea name="message" placeholder="Your message" size="lg" value={formData.message} onChange={handleChange} />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full" size="lg">
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>

          <Box flex="1" minW={{ base: "100%", md: "300px" }} textAlign="center">
            <Text fontWeight="bold" mb={4} fontSize="xl" color="neutral.800">
              Connect with us:
            </Text>
            <HStack spacing={6} justify="center">
              <IconButton as="a" href="https://facebook.com" icon={<FaFacebook />} aria-label="Facebook" variant="ghost" color="rgba(26, 32, 44, 0.85)" fontSize="3xl" _hover={{ color: "rgba(0, 0, 0, 0.85)" }} />
              <IconButton as="a" href="https://twitter.com" icon={<FaTwitter />} aria-label="Twitter" variant="ghost" color="rgba(26, 32, 44, 0.85)" fontSize="3xl" _hover={{ color: "rgba(0, 0, 0, 0.85)" }} />
              <IconButton as="a" href="https://instagram.com" icon={<FaInstagram />} aria-label="Instagram" variant="ghost" color="rgba(26, 32, 44, 0.85)" fontSize="3xl" _hover={{ color: "rgba(0, 0, 0, 0.85)" }} />
              <IconButton as="a" href="https://linkedin.com" icon={<FaLinkedin />} aria-label="LinkedIn" variant="ghost" color="rgba(26, 32, 44, 0.85)" fontSize="3xl" _hover={{ color: "rgba(0, 0, 0, 0.85)" }} />
            </HStack>
          </Box>
        </Stack>
      </MotionBox>

      <Footer />
    </Box>
  );
}
