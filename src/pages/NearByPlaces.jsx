import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Icon,
  Select,
  useToast,
  Stack,
  Flex,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaStore,
  FaUtensils,
  FaCoffee,
  FaBeer,
  FaShoppingCart,
  FaHospital,
  FaSchool,
  FaDumbbell,
  FaChurch,
  FaGasPump,
  FaHotel,
  FaTree,
  FaFilm,
} from "react-icons/fa";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyPlaces() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const toast = useToast();

  useEffect(() => {
    const successCallback = async (pos) => {
      const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      setLocation(loc);
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${loc.lat}&lon=${loc.lon}&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await res.json();
        const cityName =
          data.features?.[0]?.properties?.city ||
          data.features?.[0]?.properties?.state ||
          "Your area";
        setCity(cityName);
      } catch (error) {
        console.error("Error during reverse geocoding:", error);
        setCity("your area");
      }
    };

    const errorCallback = (err) => {
      console.error('Error getting location:', err);
      let errorMessage = "Please enable location access to find nearby places.";
      if (err.code === err.PERMISSION_DENIED) {
        errorMessage = "Location access denied. Please grant permission in your browser settings.";
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        errorMessage = "Location information is unavailable.";
      } else if (err.code === err.TIMEOUT) {
        errorMessage = "The request to get user location timed out.";
      }
      toast({
        title: "Location error",
        description: errorMessage,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLocation(null); // Ensure location is null if there's an error
      setCity(""); // Clear city on error
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 0, // No cached positions
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [toast]); // Include toast in dependency array to avoid lint warnings

  const categoryMap = {
    "": "",
    restaurant: "catering.restaurant",
    cafe: "catering.cafe",
    bar: "catering.bar",
    pub: "catering.pub",
    fastfood: "catering.fast_food",
    supermarket: "commercial.supermarket",
    mall: "commercial.shopping_mall",
    hotel: "accommodation.hotel",
    hospital: "healthcare.hospital",
    pharmacy: "healthcare.pharmacy",
    gym: "sport.sports_centre",
    spa: "building.spa",
    park: "leisure.park",
    cinema: "entertainment.cinema",
    church: "religion.christian",
    mosque: "religion.muslim",
    school: "education.school",
    bank: "service.bank",
    gas: "service.gas_station",
  };

  const iconMap = {
    restaurant: FaUtensils,
    cafe: FaCoffee,
    bar: FaBeer,
    pub: FaBeer,
    fastfood: FaUtensils,
    supermarket: FaShoppingCart,
    mall: FaShoppingCart,
    hotel: FaHotel,
    hospital: FaHospital,
    pharmacy: FaHospital,
    gym: FaDumbbell,
    spa: FaStore,
    park: FaTree,
    cinema: FaFilm,
    church: FaChurch,
    mosque: FaChurch,
    school: FaSchool,
    bank: FaStore,
    gas: FaGasPump,
    default: FaStore,
  };

  const findPlaces = async () => {
    if (!location) {
      toast({
        title: "Location unavailable",
        description: "Please allow location access and try again.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!query && !category) {
      toast({
        title: "Nothing to search",
        description: "Enter a name or select a category to search.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    setPlaces([]);

    try {
      let url = "";

      if (category) {
        const catCode = categoryMap[category.toLowerCase()] || category;
        url = `https://api.geoapify.com/v2/places?categories=${catCode}&filter=circle:${location.lon},${location.lat},5000&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
      } else {
        url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          query
        )} ${encodeURIComponent(city)}&bias=proximity:${location.lon},${location.lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Geoapify request failed");

      const data = await res.json();
      let results = data.features || [];
      results = results.filter((place) => {
        const name = place.properties.name;
        const address =
          place.properties.address_line2 ||
          place.properties.address_line1 ||
          place.properties.formatted;
        return name && name !== "Unnamed Place" && address;
      });

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No nearby results for "${query || category}" in ${city}.`,
          status: "info",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }

      setPlaces(results);
    } catch (err) {
      console.error("API error:", err);
      toast({
        title: "Error fetching places",
        description: "Something went wrong while fetching data.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (place) => {
    const lat = place.properties.lat || place.geometry.coordinates[1];
    const lon = place.properties.lon || place.geometry.coordinates[0];
    const name = place.properties.name || "Location";
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        name
      )}+@${lat},${lon}`,
      "_blank"
    );
  };

  // 🔹 Skeleton loader cards
  const SkeletonGrid = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} borderRadius="xl" shadow="lg" p={6}>
          <HStack spacing={4} align="start">
            <SkeletonCircle size="10" />
            <VStack align="start" spacing={2} flex="1">
              <Skeleton height="20px" width="70%" />
              <SkeletonText mt="2" noOfLines={2} spacing="2" />
              <Skeleton height="14px" width="50%" />
            </VStack>
          </HStack>
        </Card>
      ))}
    </SimpleGrid>
  );

  return (
    <Box p={[4, 6, 8]} maxW="1200px" mx="auto" bg="neutral.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Heading
          size={{ base: "xl", md: "2xl" }}
          textAlign="center"
          color="brand.700"
          lineHeight="1.3"
          fontWeight="extrabold"
        >
          🌍 Find Places Near You{" "}
          {city && (
            <Text as="span" fontSize={{ base: "md", md: "xl" }} color="accent.600">
              in {city}
            </Text>
          )}
        </Heading>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="stretch"
          justify="center"
          p={4}
          bg="white"
          borderRadius="xl"
          shadow="md"
        >
          <Input
            placeholder="Search by name (e.g. pizza, gym, barber)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            borderRadius="lg"
            flex="1"
            size="lg"
            onKeyDown={(e) => e.key === "Enter" && findPlaces()}
          />
          <Select
            placeholder="Select Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            borderRadius="lg"
            w={{ base: "100%", md: "250px" }}
            size="lg"
          >
            {Object.keys(categoryMap)
              .filter((k) => k !== "")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
          </Select>
          <Button
            bg="rgba(26, 32, 44, 0.85)"
            borderRadius="lg"
            leftIcon={<FaSearch />}
            onClick={findPlaces}
            isDisabled={loading}
            w={{ base: "100%", md: "auto" }}
            size="lg"
            px={8}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Stack>

        {/* Skeleton grid while loading */}
        {loading && <SkeletonGrid />}

        {/* Show actual places */}
        {!loading && places.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
            {places.map((place, i) => {
              const iconKey =
                Object.keys(categoryMap).find((key) =>
                  (place.properties.categories || []).some((c) =>
                    categoryMap[key]
                      ? c.includes(categoryMap[key].split(".")[1])
                      : false
                  )
                ) || "default";

              const PlaceIcon = iconMap[iconKey] || iconMap.default;
              const placeLat =
                place.properties.lat || place.geometry.coordinates[1];
              const placeLon =
                place.properties.lon || place.geometry.coordinates[0];
              const distance =
                location && placeLat && placeLon
                  ? (
                      Math.round(
                        getDistanceFromLatLonInKm(
                          location.lat,
                          location.lon,
                          placeLat,
                          placeLon
                        ) * 10
                      ) / 10
                    ).toFixed(1)
                  : null;

              return (
                <Card
                  key={i}
                  borderRadius="xl"
                  shadow="lg"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "0.2s",
                    cursor: "pointer",
                    shadow: "xl",
                  }}
                  onClick={() => openInMaps(place)}
                >
                  <CardBody p={6}>
                    <HStack spacing={4} align="start">
                      <Icon as={PlaceIcon} boxSize={7} color="brand.500" />
                      <VStack align="start" spacing={1} flex="1">
                        <Text
                          fontWeight="bold"
                          fontSize="lg"
                          noOfLines={1}
                          color="neutral.800"
                        >
                          {place.properties.name}
                        </Text>
                        <HStack align="start" spacing={2}>
                          <Icon as={FaMapMarkerAlt} color="neutral.500" mt="2px" />
                          <Text fontSize="sm" color="neutral.600" noOfLines={[2, 3]}>
                            {place.properties.address_line2 ||
                              place.properties.address_line1 ||
                              place.properties.formatted}
                          </Text>
                        </HStack>
                        {distance && (
                          <Text fontSize="sm" color="neutral.500">
                            {distance} km away
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        )}

        {!loading && places.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            borderRadius="xl"
          >
            <Icon as={FaSearch} boxSize={12} color="neutral.400" mb={4} />
            <Text textAlign="center" color="neutral.600" fontSize="lg">
              Try searching for a place name or select a category.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
