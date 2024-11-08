import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
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
      await axios.post(`${process.env.REACT_APP_URI}/v1/auth/forgot-password`, {
        email,
      });
      localStorage.setItem("forgotEmail", email);
      showNotification(
        "Password reset email sent",
        "Please check your inbox.",
        "success"
      );
      dispatch(trigger(isAuthenticated));
      navigate("/reset-password");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
    }
  };

  useEffect(() => {
    dispatch(reset(isAuthenticated));
  }, []);

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
        {error && showNotification("Error", error, "error")}
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
