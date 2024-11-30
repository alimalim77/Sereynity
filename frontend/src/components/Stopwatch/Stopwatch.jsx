import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Progress, Center } from "@chakra-ui/react";
import styles from "./Stopwatch.module.css";
import api from "../../api/axios";
import { useToast } from "@chakra-ui/react";

const Stopwatch = ({ duration, meditationType, icon }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let intervalId;
    if (isRunning && time < duration) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          // Voice notification every 5 minutes
          if (newTime % 300 === 0) {
            const utterance = new SpeechSynthesisUtterance(
              `You have ${
                Math.floor(duration / 60) - Math.floor(newTime / 60)
              } minutes left!`
            );
            window.speechSynthesis.speak(utterance);
          }
          return newTime;
        });
      }, 1000);
    } else if (time >= duration) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time, duration]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setHasCompleted(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = (time / duration) * 100;

  const handleSessionComplete = async () => {
    if (time > 0 && !hasCompleted) {
      setHasCompleted(true);
      try {
        const token = sessionStorage.getItem("token");
        await api.post(
          `/v1/meditation/sessions`,
          {
            duration: time,
            meditationType: meditationType.toLowerCase(),
            isCompleted: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast({
          title: "Session Complete",
          description: "Meditation session recorded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        reset();
      } catch (error) {
        setHasCompleted(false); // Reset on error
        toast({
          title: "Error",
          description: "Failed to record meditation session",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <VStack className={styles.container}>
      <Center className={styles.meditationIcon}>{icon}</Center>
      <Text className={styles.meditationType}>{meditationType} Meditation</Text>
      <Text className={styles.timeDisplay}>
        {formatTime(time)} / {formatTime(duration)}
      </Text>
      <Box className={styles.progressContainer}>
        <Progress value={progress} w="100%" colorScheme="green" />
      </Box>
      <Button
        className={styles.controlButton}
        onClick={startStop}
        colorScheme={isRunning ? "red" : "green"}
      >
        {isRunning ? "Pause" : "Start"}
      </Button>
      <Button
        className={styles.controlButton}
        onClick={reset}
        colorScheme="gray"
      >
        Reset
      </Button>
    </VStack>
  );
};

export default Stopwatch;
