import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LandingPageHeader() {
  const navigate = useNavigate();

  return (
    <Flex
      h={16}
      bg="rgba(26, 32, 44, 0.85)"
      backdropFilter="blur(6px)"
      px={{ base: 4, md: 10 }}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={2000}
      align="center"
      justify="space-between"
      shadow="md"
    >
      {/* Logo */}
      <Text
        color="white"
        fontWeight="bold"
        fontSize="xl"
        cursor="pointer"
        onClick={() => navigate("/")}
        letterSpacing="wide"
      >
        FindIt
      </Text>

      {/* Login Button */}
      <Text
        as="button"
        onClick={() => navigate("/login/signup")}
        fontWeight="600"
        fontSize="sm"
        color="white"
        position="relative"
        transition="transform 0.25s ease"
        _hover={{
          transform: "scale(1.15)",
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-3px",
          left: 0,
          width: "100%",
          height: "2px",
          bg: "blue.400",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease",
        }}
        _hover={{
          _after: {
            transform: "scaleX(1)",
          },
        }}
      >
        Login
      </Text>
    </Flex>
  );
}
