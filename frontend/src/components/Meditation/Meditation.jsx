import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Heading,
  useColorModeValue,
  Flex,
  VStack,
  Image,
} from "@chakra-ui/react";
import {
  FaBrain,
  FaLeaf,
  FaHandsHelping,
  FaPagelines,
  FaEye,
  FaHeart,
} from "react-icons/fa"; // Import icons
import Serenity from "../../assets/serenity.jpeg";
import Stopwatch from "../Stopwatch/Stopwatch"; // Import the Stopwatch component

const Meditation = () => {
  const meditationForms = [
    { name: "Mindfulness", icon: <FaBrain />, duration: 600 }, // 10 minutes
    { name: "Transcendental", icon: <FaLeaf />, duration: 1200 }, // 20 minutes
    { name: "Guided", icon: <FaHandsHelping />, duration: 900 }, // 15 minutes
    { name: "Zen", icon: <FaPagelines />, duration: 1800 }, // 30 minutes
    { name: "Vipassana", icon: <FaEye />, duration: 3600 }, // 60 minutes
    { name: "Loving-kindness", icon: <FaHeart />, duration: 600 }, // 10 minutes
  ];

  const [currentMeditation, setCurrentMeditation] = useState(
    meditationForms[0]
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (index) => setCurrentMeditation(meditationForms[index]),
  };

  const bgColor = useColorModeValue("gray.100", "purple.800");

  return (
    <>
      <Flex
        direction="column"
        h="100vh"
        bg={bgColor}
        overflow="hidden"
        justify="space-between"
        align="center"
        pt="70px" // Add top padding to account for the navbar
      >
        <Box w="100%" maxW="600px" textAlign="center" mt={4}></Box>

        <Box w="100%" maxW="600px" px={4}>
          <Stopwatch
            duration={currentMeditation.duration}
            meditationType={currentMeditation.name}
            icon={currentMeditation.icon}
          />
        </Box>

        <Box w="100%" maxW="600px" h="100px" mb={4}>
          <Slider {...settings}>
            {meditationForms.map((form, index) => (
              <Box key={index} textAlign="center" p={2}>
                <Heading size="sm">{form.name}</Heading>
              </Box>
            ))}
          </Slider>
        </Box>
      </Flex>
    </>
  );
};

export default Meditation;
