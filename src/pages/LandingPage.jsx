// src/pages/LandingPage.jsx
import { Box, Heading, Text, Button, Image, Stack, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import LandingPageImage from '../assets/LandingPageImage.jpg'; // Adjust the path as necessary



export default function LandingPage() {
  return (
    <Box >
      <Stack 
      spacing={8}
       justifyItems="center"

       bgImage={`linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(41, 41, 41, 0.75) 80%), url(${LandingPageImage})`}
       bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      h="100vh"
       >
        <Box flex={1} p={8} mt="50px" color="white" align="center"  textAlign="center">
          <Text fontSize={{base:"30px", md:"71px"}} fontWeight="600" color="white" >
          The first online meeting point between{" "}
                <Text as="span" color="#8C9492">
                who's looking for a lost item and who's found it
                </Text>
            </Text>
          
          <Button as={RouterLink} to="/lost-and-found" colorScheme="teal" size="lg">
            Get Started
          </Button>
        </Box>
        <Box flex={1}>
          
        </Box>
      </Stack>

      <Flex
            direction={{ base: 'column', md: 'row' }}
            align="left"
            justify="left"
            gap={10}
            px={8}
            py={20}
            bg="white"
            color="white"
          >
            <Stack maxW="661px" align="left" textAlign="left">
              <Text fontSize="15px" w="fit-content" color="#FAA51C" fontWeight="700">
                about FindIt
              </Text>
              <Text  fontSize={{base:"25px", md:"50px"}} fontWeight="600" color="black" >
                Transforming Lives Through{" "}
                <Text as="span" color="#8C9492">
                  Education & Mentorship
                </Text>
              </Text>
              <Text  fontSize={{base:"10px", md:"17px"}} color="#71717A" w={{base: "300px", md: "500px"}}>
                At One by One, we believe in the power of individual impact. Our
                mission is simple: to connect promising students from
                underserved communities with sponsors and mentors who can change their lives.
              </Text>
              <Flex >
                <Button w={{base:"150px", md: "171px"}} bg="#39996B" fontWeight="400" fontSize={{base:"12px", md:"14px"}} px="28px" py="10px" color="#ffff" >learn more about us </Button>
              </Flex>
            </Stack>
            {/* <Image
              src={AboutUsImg}
              alt="About Us"
              w={{base:"300px", md: "400px"}}
              h={{base:"300px", md: "400px"}}
            /> */}
            {/* <Image
              src={AboutProp}
              position="absolute"
              top="45%"
              right="0"
              transform="translate(40%, -40%) rotate(45deg)"
              alt="About Us Decorative"
              maxW="300px"
              maxH="300px"
              zIndex="0"
              pointerEvents="none"
            /> */}

          </Flex>
    </Box>
  );
}
