import React from "react";
import {
  Box,
  VStack,
  Text,
  Icon,
  useColorMode,
  useColorModeValue,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { FaBrain, FaClock, FaCalendar } from "react-icons/fa";

const MeditationSessions = ({ sessions = [] }) => {
  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.700");

  // Function to chunk array into groups of 3
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  if (sessions.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
        <Text color={colorMode === "light" ? "gray.600" : "gray.300"}>
          No meditation sessions recorded yet. Start your journey today!
        </Text>
      </Box>
    );
  }

  const sessionRows = chunkArray(sessions.slice(0, 6), 3);

  return (
    <VStack spacing={4} align="stretch" width="full">
      <Heading
        size="md"
        color={colorMode === "light" ? "gray.800" : "gray.100"}
      >
        Recent Sessions
      </Heading>
      <VStack spacing={4}>
        {sessionRows.map((row, rowIndex) => (
          <HStack key={rowIndex} spacing={4} width="full" justify="flex-start">
            {row.map((session, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="xl"
                borderColor={borderColor}
                bg={bgColor}
                flex="1"
                maxW="300px"
                boxShadow="sm"
              >
                <HStack spacing={4} justify="space-between">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Icon
                        as={FaBrain}
                        color={
                          colorMode === "light" ? "purple.600" : "purple.400"
                        }
                      />
                      <Text fontWeight="medium">
                        {session.meditationType.charAt(0).toUpperCase() +
                          session.meditationType.slice(1)}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon
                        as={FaClock}
                        color={
                          colorMode === "light" ? "purple.600" : "purple.400"
                        }
                        fontSize="sm"
                      />
                      <Text fontSize="sm">
                        {Math.floor(session.duration / 60)}m
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack align="end">
                    <Icon
                      as={FaCalendar}
                      color={
                        colorMode === "light" ? "purple.600" : "purple.400"
                      }
                      fontSize="sm"
                    />
                    <Text fontSize="xs">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default MeditationSessions;
