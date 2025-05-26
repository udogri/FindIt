// src/pages/LandingPage.jsx
import { Box, VStack, Text, Button, Image, Stack, Flex } from '@chakra-ui/react';
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
      h="70vh"
       >
        <Box  p={8} mt="50px" color="white" align="center"  textAlign="center">
          <Text fontSize={{base:"30px", md:"50px"}} fontWeight="600" color="white" >
          The meeting point between{" "}
                <Text as="span" color="#8C9492">
                who's looking for a lost item and who's found it
                </Text>
            </Text>
          
          <Button mt="10px" mb="10px" as={RouterLink} to="/login/signup" color="white" background="#34495e" _hover={{ bg: "transparent", color: "white", border: "1px solid white" }} size="lg">
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
                Helping you find{" "}
                <Text as="span" color="#8C9492">
                  your lost items
                </Text>
              </Text>
              <Text  fontSize={{base:"10px", md:"17px"}} color="#71717A" w={{base: "300px", md: "500px"}}>
              FindIt is a community-driven platform dedicated to helping people find lost items
               and return found belongings. Whether it's a misplaced phone, a lost pet, or a found
              wallet, FindIt connects people in need with those who can help.
              </Text>
              <Flex >
                <Button w={{base:"150px", md: "171px"}} bg="#34495e" fontWeight="400" fontSize={{base:"12px", md:"14px"}} px="28px" py="10px" color="#ffff" _hover={{ bg: "transparent", color: "#34495e", border: "1px solid #34495e" }} >learn more about us </Button>
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
          <Box bg="#091C13" align="center" justifyContent="center" py="80px" px={{base: "30px", md: "60px"}} color="white" >
            <Box align="center" justifyContent="center" display={{base: "grid", md: "flex"}}>
              <Text fontSize={{base: "20px", md: "30px", lg: "50px"}} fontWeight="700" textAlign="center" mr={{base: "none", md: "50px", lg: "150px" }} mb={{base: "20px", md: "none"}}>
                Our{" "}
                <Text as="span" color="#8C9492">
                  Impact
                </Text>
              </Text>
              <Box >
                <Box display={{base: "grid", md: "flex"}} gap="10px" >
                  <VStack borderRadius="15px" mb={{base: "20px", md: "none"}} borderLeftWidth="3px" borderLeftStyle="solid" borderLeftColor="#39996B29" p={{base: "20px", md: "25px", lg: "30px"}}  >
                    <Text fontSize={{base: "30px", md: "35px", lg: "48px"}} fontWeight="600" color="#98ACA3">100+</Text>
                    <Text fontSize={{base: "13px", md: "15px", lg: "17px"}} fontWeight="400" color="white" >Items found</Text>
                  </VStack>
                  <VStack borderRadius="15px" mb={{base: "20px", md: "none"}} borderLeftWidth="3px" borderLeftStyle="solid" borderLeftColor="#39996B29" p="30px"  >
                    <Text fontSize={{base: "30px", md: "35px", lg: "48px"}} fontWeight="600" color="#98ACA3">50+</Text>
                    <Text fontSize={{base: "13px", md: "15px", lg: "17px"}} fontWeight="400" color="white" >Items recovered</Text>
                  </VStack>
                  <VStack borderRadius="15px" mb={{base: "20px", md: "none"}} borderLeftWidth="3px" borderLeftStyle="solid" borderLeftColor="#39996B29" p="30px"  >
                    <Text fontSize={{base: "30px", md: "35px", lg: "48px"}} fontWeight="600" color="#98ACA3">160+</Text>
                    <Text fontSize={{base: "13px", md: "15px", lg: "17px"}} fontWeight="400" color="white" >Satisfied people</Text>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </Box>
    </Box>
  );
}
