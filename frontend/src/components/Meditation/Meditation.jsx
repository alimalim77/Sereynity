import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  useColorModeValue,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import {
  FaBrain,
  FaLeaf,
  FaHandsHelping,
  FaPagelines,
  FaEye,
  FaHeart,
  FaSignInAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFrog,
} from "react-icons/fa";
import Stopwatch from "../Stopwatch/Stopwatch";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import styles from "./Meditation.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

const meditationForms = [
  { name: "Mindfulness", icon: <FaBrain />, duration: 600 },
  { name: "Breathing", icon: <FaLeaf />, duration: 300 },
  { name: "Loving-Kindness", icon: <FaHeart />, duration: 600 },
  { name: "Body Scan", icon: <FaEye />, duration: 900 },
  { name: "Zen", icon: <FaPagelines />, duration: 1200 },
  { name: "Guided", icon: <FaHandsHelping />, duration: 900 },
  { name: "G-Test", icon: <FaFrog />, duration: 10 },
];

const Meditation = () => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(
    meditationForms[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSound, setActiveSound] = useState(null);
  const audioRef = useRef(null);
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const isAuthenticated = useSelector((state) => state.authentication.value);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setActiveSound(null);
        setIsSoundPlaying(false);
      }
    };
  }, []);

  const handleSoundControl = (sound) => {
    if (activeSound === sound.id) {
      audioRef.current?.pause();
      setActiveSound(null);
      setIsSoundPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.play();
      setActiveSound(sound.id);
      setIsSoundPlaying(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <VStack spacing={6}>
          <Icon as={FaSignInAlt} boxSize={12} color="purple.500" />
          <Text fontSize="xl" textAlign="center">
            Please log in to access meditation features
          </Text>
          <Button
            colorScheme="purple"
            leftIcon={<FaSignInAlt />}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Flex h="100vh">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        selectedMeditation={selectedMeditation}
        setSelectedMeditation={setSelectedMeditation}
        meditationForms={meditationForms}
        setIsSoundPlaying={setIsSoundPlaying}
        activeSound={activeSound}
        handleSoundControl={handleSoundControl}
      />

      {/* Toggle Button */}
      <IconButton
        icon={isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        position="fixed"
        left={isSidebarOpen ? "300px" : "0"}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        size="sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
        variant="solid"
        colorScheme="purple"
        borderLeftRadius={isSidebarOpen ? "md" : 0}
        borderRightRadius={isSidebarOpen ? 0 : "md"}
      />

      {/* Main Content */}
      <Box
        flex="1"
        ml={isSidebarOpen ? "300px" : "0"}
        transition="margin-left 0.3s"
        h="100%"
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stopwatch
          duration={selectedMeditation.duration}
          meditationType={selectedMeditation.name}
          icon={selectedMeditation.icon}
        />
      </Box>
    </Flex>
  );
};

export default Meditation;
