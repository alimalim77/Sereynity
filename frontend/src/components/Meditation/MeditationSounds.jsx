import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { WiRain, WiTsunami } from "react-icons/wi";
import { GiForestCamp } from "react-icons/gi";
import styles from "./MeditationSounds.module.css";

const MeditationSounds = ({
  onSoundStateChange,
  activeSound,
  onSoundControl,
}) => {
  const { colorMode } = useColorMode();

  const sounds = [
    { id: 1, name: "Rain", url: "/sounds/rain.wav", icon: <WiRain /> },
    { id: 2, name: "Ocean", url: "/sounds/ocean.wav", icon: <WiTsunami /> },
    {
      id: 3,
      name: "Forest",
      url: "/sounds/forest.wav",
      icon: <GiForestCamp />,
    },
    {
      id: 4,
      name: "Singing Bowl",
      url: "/sounds/singing-bowl.wav",
      icon: <FaBell />,
    },
  ];

  return (
    <Box className={styles.soundsContainer}>
      <SimpleGrid className={styles.soundGrid}>
        {sounds.map((sound) => (
          <Button
            key={sound.id}
            className={`${styles.soundButton} ${
              styles[sound.name.toLowerCase().replace(/\s+/g, "")]
            } ${activeSound === sound.id ? styles.active : ""}`}
            onClick={() => onSoundControl(sound)}
            color={
              activeSound === sound.id
                ? "yellow.500"
                : colorMode === "dark"
                ? "gray.100"
                : "gray.800"
            }
            rightIcon={sound.icon}
            iconSpacing="1rem"
            size="md"
            fontWeight="medium"
            transition="all 0.5s"
          >
            {sound.name}
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MeditationSounds;
