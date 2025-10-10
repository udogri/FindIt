import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { MapPin, Search } from "lucide-react";

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 🔒 replace with your key

export default function NearbyPlacesFinder() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  // ✅ Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Please enable location access.");
        console.error(err);
      }
    );
  }, []);

  // 🔍 Search for nearby places
  const searchPlaces = async () => {
    if (!query.trim()) return;
    if (!location) {
      setError("Location not found. Please enable GPS.");
      return;
    }

    setLoading(true);
    setError("");
    setPlaces([]);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=3000&keyword=${query}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        setPlaces(data.results);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to fetch places.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={5}>
      <Heading mb={4} fontSize="2xl" textAlign="center">
        Find Nearby Places 🌍
      </Heading>

      <Flex gap={3} mb={5}>
        <Input
          placeholder="Search for barbershop, mall, bookshop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          borderRadius="full"
        />
        <Button
          colorScheme="green"
          borderRadius="full"
          onClick={searchPlaces}
          leftIcon={<Search size={18} />}
        >
          Search
        </Button>
      </Flex>

      {loading && (
        <Flex justify="center" align="center">
          <Spinner size="lg" color="green.500" />
        </Flex>
      )}

      {error && (
        <Text color="red.500" textAlign="center" mb={3}>
          {error}
        </Text>
      )}

      <VStack spacing={4} align="stretch">
        {places.map((place) => (
          <Card key={place.place_id} shadow="md" borderRadius="lg">
            <CardHeader>
              <Flex align="center" gap={2}>
                <Icon as={MapPin} color="green.500" />
                <Text fontWeight="600">{place.name}</Text>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Text fontSize="sm" color="gray.600">
                {place.vicinity || "Address not available"}
              </Text>
              {place.rating && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                  ⭐ {place.rating} / 5
                </Text>
              )}
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}
