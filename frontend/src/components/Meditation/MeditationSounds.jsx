import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FaVolumeUp, FaVolumeMute, FaBell } from "react-icons/fa";
import { WiRain, WiTsunami } from "react-icons/wi";
import { GiForestCamp } from "react-icons/gi";

const MeditationSounds = () => {
  const [activeSound, setActiveSound] = useState(null);
  const audioRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setActiveSound(null);
      }
    };
  }, []);

  const sounds = [
    { id: 1, name: "Rain", url: "/sounds/rain.wav", icon: <WiRain /> },
    { id: 2, name: "Ocean", url: "/sounds/ocean.wav", icon: <WiTsunami /> },
    {
      id: 3,
      name: "Forest",
      url: "/sounds/forest.wav",
      icon: <GiForestCamp />,
    },
    { id: 4, name: "Singing Bowl", url: "/sounds/bowl.wav", icon: <FaBell /> },
  ];

  const handleSoundClick = (sound) => {
    if (activeSound === sound.id) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.play();
      setActiveSound(sound.id);
    }
  };

  return (
    <Box mt={4}>
      <Text
        fontSize="lg"
        mb={2}
        color={colorMode === "dark" ? "white" : "black"}
        fontWeight="bold"
      >
        Ambient Sounds
      </Text>
      <SimpleGrid columns={[2, 2, 4]} spacing={4}>
        {sounds.map((sound) => (
          <Button
            key={sound.id}
            onClick={() => handleSoundClick(sound)}
            colorScheme={activeSound === sound.id ? "green" : "gray"}
            rightIcon={sound.icon}
            iconSpacing="1rem"
            size="md"
            fontWeight="bold"
          >
            {sound.name}
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MeditationSounds;
