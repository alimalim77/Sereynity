import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Progress, Center } from "@chakra-ui/react";

const Stopwatch = ({ duration, meditationType, icon }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning && time < duration) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (time >= duration) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time, duration]);

  useEffect(() => {
    if (isRunning && time % 300 === 0 && time > 0) {
      // Check if time is a multiple of 2 minutes
      const utterance = new SpeechSynthesisUtterance(
        `You have ${
          Math.floor(duration / 60) - Math.floor(time / 60)
        }  minutes left!`
      );
      window.speechSynthesis.speak(utterance);
    }
  }, [time, isRunning]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (time / duration) * 100;

  return (
    <VStack
      spacing={4}
      align="center"
      w="100%"
      h="100%"
      justify="center"
      p={4}
      overflow="hidden"
    >
      <Center fontSize={["3xl", "4xl", "5xl"]} color="yellow.500" mb={2}>
        {icon}
      </Center>
      <Text fontSize={["md", "lg", "xl"]} fontWeight="bold" textAlign="center">
        {meditationType} Meditation
      </Text>
      <Text fontSize={["xl", "2xl", "3xl"]} fontWeight="bold">
        {formatTime(time)} / {formatTime(duration)}
      </Text>
      <Box w={["80%", "60%", "40%", "30%"]}>
        <Progress value={progress} w="100%" colorScheme="green" />
      </Box>
      <Button onClick={startStop} colorScheme={isRunning ? "red" : "green"}>
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button onClick={reset} colorScheme="gray">
        Reset
      </Button>
    </VStack>
  );
};

export default Stopwatch;
