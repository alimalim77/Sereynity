import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

const ProfileDetails = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    experienceLevel: "",
    totalMeditationMinutes: 0,
    streakCount: 0,
    notificationPreferences: {
      reminderEnabled: false,
      emailNotifications: false,
    },
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("Fetching details...");
      try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);

        const response = await axios.get(
          `${process.env.REACT_APP_URI}/v1/details/get-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.details) {
          setName(response.data.details.name);
          setDetails(response.data.details);
        }
      } catch (err) {
        console.error("API Error:", err);
        const errorMessage =
          err.response?.data?.message || "Error fetching details";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchDetails();
  }, [navigate, toast]);

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg={bgColor}
      >
        <Text color="red.500" fontSize="lg">
          Error: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={bgColor}
      p={4}
    >
      <VStack
        spacing={4}
        width="full"
        maxW="md"
        boxShadow="lg"
        p={6}
        borderRadius="md"
        bg={cardBgColor}
      >
        <Heading color={colorMode === "light" ? "black" : "white"} size="lg">
          Profile Details
        </Heading>
        <Text
          fontSize="lg"
          color={colorMode === "light" ? "gray.700" : "gray.200"}
        >
          Name: {name}
        </Text>
      </VStack>
    </Box>
  );
};

export default ProfileDetails;
