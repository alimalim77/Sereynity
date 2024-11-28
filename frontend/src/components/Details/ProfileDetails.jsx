import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  FaUser,
  FaStar,
  FaClock,
  FaStopwatch,
  FaBell,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  HStack,
  Switch,
  Button,
  Input,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import MeditationSessions from "./MeditationSessions";

const ProfileDetails = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    experienceLevel: "",
    totalMeditationMinutes: 0,
    streakCount: 0,
    notificationPreferences: {
      reminderEnabled: false,
      reminderTime: "",
      emailNotifications: false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [sessions, setSessions] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const [detailsResponse, sessionsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_URI}/v1/details/get-details`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_URI}/v1/meditation/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("Details Response:", detailsResponse.data);

        if (detailsResponse.data.details) {
          setName(detailsResponse.data.details.name);
          setDetails({
            ...detailsResponse.data.details,
            notificationPreferences: {
              reminderEnabled: false,
              reminderTime: "",
              emailNotifications: false,
              ...detailsResponse.data.details.notificationPreferences,
            },
          });
        }

        if (sessionsResponse.data) {
          setSessions(sessionsResponse.data);
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

    fetchData();
  }, [navigate, toast]);

  const handleEmailToggle = async (e) => {
    try {
      setDetails((prev) => ({
        ...prev,
        notificationPreferences: {
          ...(prev.notificationPreferences || {}),
          emailNotifications: e.target.checked,
        },
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email preferences",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(name);
  };

  const handleSave = async () => {
    try {
      setName(editedName);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(name);
  };

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
    <Box p={6} bg={bgColor} minH="100vh">
      <HStack align="start" spacing={8}>
        {/* Left side - Profile Details */}
        <Box
          w="300px"
          p={4}
          borderRadius="lg"
          bg={cardBgColor}
          boxShadow="md"
          position="sticky"
          top={4}
        >
          <VStack spacing={4} align="stretch">
            <VStack spacing={4} width="full" alignItems="flex-start" ml={2}>
              <Heading
                size="lg"
                color={colorMode === "light" ? "gray.800" : "white"}
                fontWeight="bold"
                letterSpacing="wide"
              >
                Profile Details
              </Heading>

              <VStack spacing={3} width="full" alignItems="flex-start">
                {/* Name */}
                <HStack width="full" spacing={3}>
                  <Icon
                    as={FaUser}
                    boxSize={4}
                    color={colorMode === "light" ? "purple.600" : "purple.400"}
                  />
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      variant="flushed"
                      color={colorMode === "light" ? "gray.800" : "white"}
                      _focus={{ borderColor: "purple.400" }}
                      size="sm"
                      maxW="120px"
                    />
                  ) : (
                    <Text
                      fontSize="sm"
                      color={colorMode === "light" ? "gray.800" : "gray.100"}
                    >
                      {name}
                    </Text>
                  )}
                </HStack>

                <HStack width="full" spacing={3}>
                  <Icon
                    as={FaStar}
                    boxSize={4}
                    color={colorMode === "light" ? "purple.600" : "purple.400"}
                  />
                  <Text
                    fontSize="sm"
                    color={colorMode === "light" ? "gray.800" : "gray.100"}
                  >
                    {details.experienceLevel}
                  </Text>
                </HStack>

                {/* Meditation Minutes */}
                <HStack width="full" spacing={3}>
                  <Icon
                    as={FaClock}
                    boxSize={4}
                    color={colorMode === "light" ? "purple.600" : "purple.400"}
                  />
                  <Text
                    fontSize="sm"
                    color={colorMode === "light" ? "gray.800" : "gray.100"}
                  >
                    {details.totalMeditationMinutes} minutes
                  </Text>
                </HStack>

                {/* Streak Count */}
                <HStack width="full" spacing={3}>
                  <Icon
                    as={FaStopwatch}
                    boxSize={4}
                    color={colorMode === "light" ? "purple.600" : "purple.400"}
                  />
                  <Text
                    fontSize="sm"
                    color={colorMode === "light" ? "gray.800" : "gray.100"}
                  >
                    {details.streakCount} day streak
                  </Text>
                </HStack>

                {/* Email Notifications */}
                <HStack width="full" spacing={3} justify="space-between">
                  <HStack spacing={3}>
                    <Icon
                      as={FaEnvelope}
                      boxSize={4}
                      color={
                        colorMode === "light" ? "purple.600" : "purple.400"
                      }
                    />
                    <Text
                      fontSize="sm"
                      color={colorMode === "light" ? "gray.800" : "gray.100"}
                    >
                      Email Notifications
                    </Text>
                  </HStack>
                  <Switch
                    size="sm"
                    colorScheme="purple"
                    isChecked={
                      details?.notificationPreferences?.emailNotifications ??
                      false
                    }
                    onChange={handleEmailToggle}
                    isDisabled={!isEditing}
                  />
                </HStack>

                {/* Edit Button */}
                <Box position="relative" width="full" pt={2}>
                  {isEditing ? (
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaTimes />}
                        colorScheme="red"
                        onClick={handleCancel}
                        size="xs"
                        rounded="full"
                        variant="solid"
                        bg="purple.600"
                      />
                      <IconButton
                        icon={<FaSave />}
                        colorScheme="purple"
                        onClick={handleSave}
                        size="xs"
                        rounded="full"
                        variant="solid"
                        bg="purple.600"
                      />
                    </HStack>
                  ) : (
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme="purple"
                      onClick={handleEditClick}
                      size="xs"
                      rounded="full"
                      variant="solid"
                    />
                  )}
                </Box>
              </VStack>
            </VStack>
          </VStack>
        </Box>

        {/* Sessions display */}
        <VStack flex="1" spacing={4}>
          <MeditationSessions sessions={sessions} />
        </VStack>
      </HStack>
    </Box>
  );
};

export default ProfileDetails;
