import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { trigger, reset } from "../redux/authenticationSlice";
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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isAuthenticated = useSelector((state) => state.authentication.value);
  const dispatch = useDispatch();
  const toast = useToast();

  const showNotification = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/v1/auth/forgot-password`, {
        email,
      });

      if (response.data.user) {
        localStorage.setItem("forgotEmail", email);
        sessionStorage.setItem("pendingVerification", "true");
        sessionStorage.setItem("verificationEmail", email);
        showNotification(
          "Password reset email sent",
          "Please check your inbox.",
          "success"
        );
        navigate("/reset-password");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid email address or unauthorized";
      showNotification("Error", errorMessage, "error");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      p={4}
    >
      <VStack
        spacing={4}
        width="full"
        maxW="md"
        boxShadow="lg"
        p={6}
        borderRadius="md"
        bg={colorMode === "light" ? "white" : "gray.700"}
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
              bg={colorMode === "light" ? "white" : "gray.600"}
              color={colorMode === "light" ? "black" : "white"}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4} width="full">
            Send Reset Email
          </Button>
        </form>
        {error && (
          <Text color="red.500" mt={2}>
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
