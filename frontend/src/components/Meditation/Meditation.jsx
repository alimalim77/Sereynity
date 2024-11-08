import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
} from "@chakra-ui/react";
import {
  FaBrain,
  FaLeaf,
  FaHandsHelping,
  FaPagelines,
  FaEye,
  FaHeart,
  FaSignInAlt,
} from "react-icons/fa";
import Stopwatch from "../Stopwatch/Stopwatch";
import MeditationSounds from "./MeditationSounds";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import styles from "./Meditation.module.css";

const Meditation = () => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const meditationForms = [
    { name: "Mindfulness", icon: <FaBrain />, duration: 600 },
    { name: "Transcendental", icon: <FaLeaf />, duration: 1200 },
    { name: "Guided", icon: <FaHandsHelping />, duration: 900 },
    { name: "Zen", icon: <FaPagelines />, duration: 1800 },
    { name: "Vipassana", icon: <FaEye />, duration: 3600 },
    { name: "Loving-kindness", icon: <FaHeart />, duration: 600 },
  ];

  const [currentMeditation, setCurrentMeditation] = useState(
    meditationForms[0]
  );
  const bgColor = useColorModeValue("gray.100", "purple.800");

  if (!sessionStorage.getItem("token")) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
        fontFamily="Arial, sans-serif"
      >
        <FaSignInAlt size={24} />
        <span
          style={{
            marginLeft: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "10px",
          }}
        >
          Please log in to access meditation.
        </span>
      </Box>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (index) => setCurrentMeditation(meditationForms[index]),
    adaptiveHeight: true,
  };

  return (
    <Box
      className={styles.container}
      bg={bgColor}
      h="100%"
      w="100%"
      overflow="hidden"
      position="absolute"
      top="70px"
      left="0"
      right="0"
      bottom="0"
    >
      <VStack spacing={4} p={4}>
        <Accordion className={styles.accordionWrapper} allowToggle w="100%">
          <AccordionItem className={styles.accordionItem}>
            <AccordionButton className={styles.accordionButton}>
              <Box className={styles.soundTitleContainer}>
                <span className={styles.soundIcon}>
                  {isSoundPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                </span>
                <Text>Ambient Sounds</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel className={styles.accordionPanel}>
              <MeditationSounds onSoundStateChange={setIsSoundPlaying} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Box w="100%" flex="1">
          <Slider {...settings} style={{ height: "calc(100% - 100px)" }}>
            {meditationForms.map((form, index) => (
              <Box
                key={index}
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <Stopwatch
                  duration={form.duration}
                  meditationType={form.name}
                  icon={form.icon}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </VStack>
    </Box>
  );
};

export default Meditation;
