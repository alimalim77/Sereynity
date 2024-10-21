import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Progress } from "@chakra-ui/react";

const Stopwatch = ({ duration, meditationType, icon }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning && time < duration) {
      intervalId = setInterval(() => setTime((time) => time + 1), 1000);
    } else if (time >= duration) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time, duration]);

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
    <Box>
      <VStack spacing={4}>
        <Box fontSize="4xl">{icon}</Box>
        <Text fontSize="lg" fontWeight="bold">
          {meditationType} Meditation
        </Text>
        <Text fontSize="6xl" fontWeight="bold">
          {formatTime(time)} / {formatTime(duration)}
        </Text>
        <Progress value={progress} w="100%" colorScheme="green" />
        <Button onClick={startStop} colorScheme={isRunning ? "red" : "green"}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={reset} colorScheme="gray">
          Reset
        </Button>
      </VStack>
    </Box>
  );
};

export default Stopwatch;
