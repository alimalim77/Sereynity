import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";

const ChangePassword = () => {
  const location = useLocation();
  const { token, expires } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); // Get the current color mode

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const expiresTimestampInSeconds = Math.floor(
      new Date(expires).getTime() / 1000
    ); // Convert expires to epoch in seconds
    const currentDateInSeconds = Math.floor(Date.now() / 1000); // Get the current date in epoch in seconds
    if (expiresTimestampInSeconds - 238 * 60 < currentDateInSeconds) {
      // Remove 238 minutes from the actual duration gap of 4 Hrs or write backend temporarily existing token code for changing password
      alert("It took too long to submit, Kindly retry!");
      navigate("/forgot-password");
    }

    try {
      const email = localStorage.getItem("forgotEmail"); // Get email from local storage
      await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/confirm-password`,
        {
          email: email,
          password: password, // Only send one password (since both are validated to be the same)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Password changed successfully!");

      // Set token in sessionStorage if it exists
      sessionStorage.setItem("token", token);

      navigate("/login"); // Redirect to login page after success
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password");
    }
  };

  useEffect(() => {
    if (!(token && expires)) navigate("/login");
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={colorMode === "light" ? "gray.100" : "gray.800"} // Background color
      p={4}
    >
      <VStack
        spacing={4}
        width="full"
        maxW="md"
        boxShadow="lg"
        p={6}
        borderRadius="md"
        bg={colorMode === "light" ? "white" : "gray.700"} // Card background color
      >
        <Heading color={colorMode === "light" ? "black" : "white"} size="lg">
          Change Password
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} width="full">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              bg={colorMode === "light" ? "white" : "gray.600"}
              color={colorMode === "light" ? "black" : "white"}
              focusBorderColor="blue.500"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              bg={colorMode === "light" ? "white" : "gray.600"}
              color={colorMode === "light" ? "black" : "white"}
              focusBorderColor="blue.500"
            />
            {error && <Text color="red.500">{error}</Text>}
            <Button type="submit" colorScheme="blue" width="full">
              Change Password
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default ChangePassword;
