// NearbyPlaces.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
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
  FaChevronDown,
} from "react-icons/fa";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../utils/fixLeafletIcons";




const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

// Haversine distance
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
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
  const [radiusKm, setRadiusKm] = useState(5); // default 5km
  const [page, setPage] = useState(0); // for pagination (v2 /places)
  const [hasMore, setHasMore] = useState(false);
  const toast = useToast();
  const abortControllerRef = useRef(null);

  // --- CATEGORY MAP (valid Geoapify categories) ---
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
    worship: "religion.place_of_worship", // groups church + mosque
    school: "education.school",
    bank: "finance.bank",
    gas: "service.gas_station",
  };

  // --- ICON MAP for UI only (keys are the same as categoryMap keys) ---
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
    worship: FaChurch,
    school: FaSchool,
    bank: FaStore,
    gas: FaGasPump,
    default: FaStore,
  };

  // --- get user location and reverse geocode city name ---
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
      console.error("Error getting location:", err);
      let errorMessage = "Please enable location access to find nearby places.";
      if (err.code === err.PERMISSION_DENIED) {
        errorMessage =
          "Location access denied. Please grant permission in your browser settings.";
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
      setLocation(null);
      setCity("");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- HELPER: determine icon key safely for a place ---
  // Prefer the selected category; otherwise try to infer from place properties
  const detectIconKey = (place) => {
    if (category) return category; // choose the user's selected category

    const cats = place?.properties?.categories || [];
    if (!Array.isArray(cats)) return "default";

    // keywords to search for inside returned category strings (robust to truncation)
    const keywordToKey = [
      ["restaurant", "restaurant"],
      ["catering", "restaurant"],
      ["cafe", "cafe"],
      ["coffee", "cafe"],
      ["bar", "bar"],
      ["pub", "pub"],
      ["fast_food", "fastfood"],
      ["supermarket", "supermarket"],
      ["shopping_mall", "mall"],
      ["accommodation", "hotel"],
      ["hotel", "hotel"],
      ["healthcare", "hospital"],
      ["pharmacy", "pharmacy"],
      ["sport", "gym"],
      ["park", "park"],
      ["cinema", "cinema"],
      ["religion", "worship"],
      ["place_of_worship", "worship"],
      ["education", "school"],
      ["finance", "bank"],
      ["gas_station", "gas"],
      ["gas", "gas"],
    ];

    for (const c of cats) {
      const str = String(c).toLowerCase();
      for (const [kw, mappedKey] of keywordToKey) {
        if (str.includes(kw)) return mappedKey;
        // also check for common truncation: check the first 7 characters
        if (str.slice(0, 7).includes(kw.slice(0, 7))) return mappedKey;
      }
    }

    return "default";
  };

  // --- FETCH PLACES ---
  // - If category is selected: use v2/places with pagination (limit + offset)
  // - If query is used: use v1/geocode/search with circle filter (no pagination)
  const findPlaces = async ({ reset = true, nextPage = false } = {}) => {
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

    // cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    if (reset) {
      setPlaces([]);
      setPage(0);
      setHasMore(false);
    }

    try {
      let url = "";
      const radiusMeters = Math.round(radiusKm * 1000);
      const limit = 20;

      if (category) {
        const catCode = categoryMap[category] || category;
        // calculate offset
        const currPage = nextPage ? page + 1 : 0;
        const offset = currPage * limit;

        url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(
          catCode
        )}&filter=circle:${location.lon},${location.lat},${radiusMeters}&limit=${limit}&offset=${offset}&apiKey=${GEOAPIFY_API_KEY}`;
        console.log("Geoapify v2 URL:", url);

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          const errorBody = await res.text();
          console.error("Geoapify v2 error:", res.status, errorBody);
          throw new Error(
            `Geoapify request failed (NearByPlaces v2): ${res.status}. Body: ${errorBody}`
          );
        }
        const data = await res.json();
        const results = data.features || [];
        // append or replace depending on reset/nextPage
        setPlaces((prev) => (nextPage ? [...prev, ...results] : results));
        setPage(currPage);
        setHasMore(results.length === limit); // if we got `limit` results, there may be more
      } else if (query) {
        // geocode search for text within circle - v1
        url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          query
        )}&filter=circle:${location.lon},${location.lat},${radiusMeters}&limit=50&apiKey=${GEOAPIFY_API_KEY}`;
        console.log("Geoapify v1 URL:", url);

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          const errorBody = await res.text();
          console.error("Geoapify v1 error:", res.status, errorBody);
          throw new Error(
            `Geoapify request failed (NearByPlaces v1): ${res.status}. Body: ${errorBody}`
          );
        }
        const data = await res.json();
        const results = data.features || [];
        setPlaces(results);
        setHasMore(false); // the v1 geocode endpoint used here isn't paginated in this usage
        setPage(0);
      }

      if (!abortControllerRef.current.signal.aborted) {
        const resultsCount = category ? places.length : places.length; // for debugging only
        console.log("Fetched results:", resultsCount);
        if ((category ? places.length : places.length) === 0 && !query) {
          toast({
            title: "No results found",
            description: `No nearby results in ${city}.`,
            status: "info",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("API error (NearByPlaces):", err);
        toast({
          title: "Error fetching places",
          description: "Something went wrong while fetching data. Check console for details.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Open Google Maps for place ---
  const openInMaps = (place) => {
    const lat = place.properties.lat || place.geometry.coordinates[1];
    const lon = place.properties.lon || place.geometry.coordinates[0];
    const name = place.properties.name || "Location";
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+@${lat},${lon}`,
      "_blank"
    );
  };

  // --- Skeleton grid ---
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

  // --- UI render ---
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
            onKeyDown={(e) => e.key === "Enter" && findPlaces({ reset: true })}
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
            onClick={() => findPlaces({ reset: true })}
            isDisabled={loading}
            w={{ base: "100%", md: "auto" }}
            size="lg"
            px={8}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Stack>

        {/* Radius slider */}
        <Box bg="white" p={4} borderRadius="xl" shadow="sm" zIndex="100">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="neutral.600">
              Search radius: {radiusKm} km
            </Text>
            <Button
              size="sm"
              variant="ghost"
              rightIcon={<FaChevronDown />}
              onClick={() => {
                setRadiusKm(5);
                toast({
                  title: "Radius reset",
                  description: "Radius set to 5 km",
                  status: "info",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Reset
            </Button>
          </HStack>
          <Slider
            zIndex="100"
            aria-label="radius"
            min={1}
            max={20}
            value={radiusKm}
            onChange={(val) => setRadiusKm(val)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        {/* Map */}
        <Box bg="white" borderRadius="xl" shadow="md" overflow="hidden" minH="260px">
          {location ? (
            <MapContainer
              center={[location.lat, location.lon]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* user position marker */}
              <Marker position={[location.lat, location.lon]}>
                <Popup>You are here</Popup>
              </Marker>

              {/* place markers */}
              {places.map((place, idx) => {
                const lat = place.properties.lat || place.geometry.coordinates[1];
                const lon = place.properties.lon || place.geometry.coordinates[0];
                const iconKey = detectIconKey(place);
                const PlaceIcon = iconMap[iconKey] || iconMap.default;
                return (
                  <Marker key={idx} position={[lat, lon]}>
                    <Popup>
                      <Box>
                        <HStack spacing={2}>
                          <Icon as={PlaceIcon} />
                          <Text fontWeight="bold">{place.properties.name}</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {place.properties.address_line2 ||
                            place.properties.address_line1 ||
                            place.properties.formatted}
                        </Text>
                        <Button
                          size="sm"
                          mt={2}
                          onClick={() => openInMaps(place)}
                          colorScheme="teal"
                        >
                          Open in Maps
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <Flex align="center" justify="center" p={6}>
              <Text color="neutral.500">Location needed to show map.</Text>
            </Flex>
          )}
        </Box>

        {/* Skeleton grid while loading */}
        {loading && <SkeletonGrid />}

        {/* Show actual places */}
        {!loading && places.length > 0 && (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
              {places.map((place, i) => {
                const iconKey = detectIconKey(place);
                const PlaceIcon = iconMap[iconKey] || iconMap.default;
                const placeLat = place.properties.lat || place.geometry.coordinates[1];
                const placeLon = place.properties.lon || place.geometry.coordinates[0];
                const distance =
                  location && placeLat && placeLon
                    ? Math.round(
                      getDistanceFromLatLonInKm(
                        location.lat,
                        location.lon,
                        placeLat,
                        placeLon
                      ) * 10
                    ) / 10
                    : null;

                // friendly category badge
                const badgeText = (place.properties?.categories || []).join(", ") || "";

                return (
                  <Card
                    key={i}
                    borderRadius="xl"
                    shadow="lg"
                    overflow="hidden"
                    maxW="100%"
                    _hover={{
                      transform: "translateY(-5px)",
                      transition: "0.2s",
                      cursor: "pointer",
                      shadow: "xl",
                    }}
                    onClick={() => openInMaps(place)}
                  >
                    <CardBody p={6} overflow="hidden">
                      <HStack spacing={4} align="start">
                        <Icon as={PlaceIcon} boxSize={7} color="brand.500" />

                        <VStack align="start" spacing={1} flex="1" minWidth={0}>
                          <HStack justify="space-between" w="100%">
                            <Text
                              fontWeight="bold"
                              fontSize="lg"
                              noOfLines={1}
                              color="neutral.800"
                              wordBreak="break-word"
                            >
                              {place.properties.name}
                            </Text>

                            {distance && (
                              <Text fontSize="sm" color="neutral.500" whiteSpace="nowrap">
                                {distance} km
                              </Text>
                            )}
                          </HStack>

                          <HStack align="start" spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="neutral.500" mt="2px" />
                            <Text
                              fontSize="sm"
                              color="neutral.600"
                              noOfLines={[2, 3]}
                              wordBreak="break-word"
                            >
                              {place.properties.address_line2 ||
                                place.properties.address_line1 ||
                                place.properties.formatted}
                            </Text>
                          </HStack>

                          {/* {badgeText && (
                            <Badge mt={2} colorScheme="gray" variant="subtle" maxW="100%" whiteSpace="normal">
                              {badgeText}
                            </Badge>
                          )} */}
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>

                );
              })}
            </SimpleGrid>

            {/* Pagination / Load more only for category (v2) requests */}
            {category && hasMore && (
              <Flex mt={6} justify="center">
                <Button
                  onClick={() => findPlaces({ reset: false, nextPage: true })}
                  isLoading={loading}
                  colorScheme="teal"
                >
                  Load more
                </Button>
              </Flex>
            )}
          </>
        )}

        {!loading && places.length === 0 && (
          <Flex direction="column" align="center" justify="center" py={10} borderRadius="xl">
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
