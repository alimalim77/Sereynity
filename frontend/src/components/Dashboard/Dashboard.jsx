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
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import the new CSS file

const Dashboard = () => {
  const navigate = useNavigate();

  const { colorMode } = useColorMode();

  const bgColor = useColorModeValue("gray.100", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");

  // Dummy data for mental well-being activities or sections
  const recentActivities = [
    "✨ Completed a guided meditation session",
    "🌬️ Practiced deep breathing exercises",
    "📝 Journaling reflection on today's feelings",
  ];

  const handleLogout = () => {
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <Box
      position="fixed"
      top="70px"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      flexDirection="column"
    >
      {/* Background overlay */}
      <Box
        className={`background-overlay ${colorMode === "dark" ? "dark" : ""}`}
      />

      {/* Scrollable content container */}
      <Box
        position="relative"
        zIndex={1}
        flex="1"
        overflowY="auto"
        overflowX="hidden"
        className="scrollable-content"
      >
        {/* Content wrapper */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={4}
          minHeight="100%"
        >
          <VStack
            spacing={4}
            width="full"
            maxW="4xl"
            boxShadow="lg"
            p={8}
            borderRadius="md"
            bg={
              colorMode === "light"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(45, 55, 72, 0.8)"
            }
            backdropFilter="blur(10px)"
            marginBottom="2rem"
          >
            <Heading color={colorMode === "dark" ? "white" : "black"}>
              ✌️ Welcome to Your Well-Being Dashboard
            </Heading>
            <Text
              fontSize="lg"
              color={colorMode === "dark" ? "gray.300" : "black"}
            >
              🌟 Here you can manage your mental well-being activities, view
              your progress, and find resources for self-care.
            </Text>

            <SimpleGrid columns={2} spacing={10} mt={6} w="full">
              <GridItem>
                <Heading
                  size="md"
                  color={colorMode === "dark" ? "white" : "black"}
                >
                  🎯 Recent Activities
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

              <GridItem>
                <Heading
                  size="md"
                  color={colorMode === "dark" ? "white" : "black"}
                >
                  ⚡ Quick Actions
                </Heading>
                <VStack mt={4} spacing={4}>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={() => navigate("/meditation")}
                  >
                    🧘 Start a Meditation Session
                  </Button>
                  <Button
                    colorScheme="teal"
                    width="full"
                    onClick={() => navigate("/journal")}
                  >
                    ✍️ Journal Your Thoughts
                  </Button>
                </VStack>
              </GridItem>
            </SimpleGrid>
          </VStack>

          {/* Quote Section */}
          <VStack
            spacing={4}
            width="full"
            maxW="4xl"
            marginTop="2rem"
            marginBottom="4rem" // Increase bottom margin
            paddingBottom="2rem" // Add bottom padding
          >
            <Box
              p={6}
              borderRadius="lg"
              borderLeft="4px solid"
              borderColor={colorMode === "light" ? "purple.500" : "purple.400"}
              bg={
                colorMode === "light" ? "purple.50" : "rgba(159, 122, 234, 0.1)"
              }
              width="full"
              boxShadow="lg"
            >
              <Text
                fontSize="lg"
                fontStyle="italic"
                color={colorMode === "dark" ? "purple.200" : "purple.700"}
                mb={2}
              >
                "The happiness of your life depends upon the quality of your
                thoughts."
              </Text>
              <Text
                fontSize="sm"
                color={colorMode === "dark" ? "purple.300" : "purple.600"}
                textAlign="right"
              >
                — Marcus Aurelius, Meditations
              </Text>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
