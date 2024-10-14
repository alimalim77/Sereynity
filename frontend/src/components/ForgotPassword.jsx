import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); // Get the current color mode

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_URI}/v1/auth/forgot-password`, {
        email,
      });
      localStorage.setItem("forgotEmail", email); // Save email to local storage
      setMessage("Password reset email sent. Please check your inbox.");
      navigate("/reset-password"); // Redirect to reset password page
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
    }
  };

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
          Forgot Password
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel color={colorMode === "light" ? "black" : "white"}>
              Email
            </FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={colorMode === "light" ? "white" : "gray.600"} // Input background color
              color={colorMode === "light" ? "black" : "white"} // Input text color
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4} width="full">
            Send Reset Email
          </Button>
        </form>
        {message && <Text color="green.500">{message}</Text>}
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
