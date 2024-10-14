// src/components/Dashboard.js
import React from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  GridItem,
  useColorMode, // Import useColorMode
  useColorModeValue, // Import useColorModeValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Access the current color mode
  const { colorMode } = useColorMode();

  // Background color based on color mode
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  // Dummy data for mental well-being activities or sections
  const recentActivities = [
    "Completed a guided meditation session",
    "Practiced deep breathing exercises",
    "Journaling reflection on today’s feelings",
  ];

  const handleLogout = () => {
    // Clear session or token and redirect to login
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      p={4}
      bg={bgColor} // Set background color based on color mode
    >
      <VStack
        spacing={4}
        width="full"
        maxW="4xl"
        boxShadow="lg"
        p={8}
        borderRadius="md"
        bg={cardBgColor} // Set card background color based on color mode
        align="flex-start"
      >
        <Heading color={colorMode === "dark" ? "white" : "black"}>
          Welcome to Your Well-Being Dashboard
        </Heading>
        <Text fontSize="lg" color={colorMode === "dark" ? "gray.300" : "black"}>
          Here you can manage your mental well-being activities, view your
          progress, and find resources for self-care.
        </Text>

        {/* Recent Activities Section */}
        <SimpleGrid columns={2} spacing={10} mt={6} w="full">
          <GridItem>
            <Heading size="md" color={colorMode === "dark" ? "white" : "black"}>
              Recent Activities
            </Heading>
            {recentActivities.map((activity, index) => (
              <Text
                key={index}
                mt={2}
                fontSize="md"
                color={colorMode === "dark" ? "gray.300" : "black"}
              >
                {index + 1}. {activity}
              </Text>
            ))}
          </GridItem>

          {/* Placeholder for another section, e.g., Resources or Recommendations */}
          <GridItem>
            <Heading size="md" color={colorMode === "dark" ? "white" : "black"}>
              Quick Actions
            </Heading>
            <VStack mt={4} spacing={4}>
              <Button
                colorScheme="blue"
                width="full"
                onClick={() => navigate("/meditation")}
              >
                Start a Meditation Session
              </Button>
              <Button
                colorScheme="green"
                width="full"
                onClick={() => navigate("/breathing")}
              >
                Practice Deep Breathing
              </Button>
              <Button
                colorScheme="teal"
                width="full"
                onClick={() => navigate("/journal")}
              >
                Journal Your Thoughts
              </Button>
            </VStack>
          </GridItem>
        </SimpleGrid>

        {/* <Button colorScheme="red" mt={10} width="full" onClick={handleLogout}>
          Logout
        </Button> */}
      </VStack>
    </Box>
  );
};

export default Dashboard;
