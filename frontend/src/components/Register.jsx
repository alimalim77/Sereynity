import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { trigger, reset } from "../redux/authenticationSlice";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Spinner,
  Center,
  useColorMode,
} from "@chakra-ui/react";

const Register = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isAuthenticated = useSelector((state) => state.authentication.value);
  const dispatch = useDispatch();

  const showNotification = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      showNotification(
        "Password Error",
        "Password must be at least 8 characters long",
        "error"
      );
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/register`,
        formData
      );
      showNotification(
        "Verification Email Sent",
        "Registered Successfully.",
        "success"
      );
      sessionStorage.setItem("pendingVerification", "true");
      sessionStorage.setItem("verificationEmail", formData.email);
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      showNotification("Registration Failed", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      position="relative"
      bg={colorMode === "light" ? "white" : "gray.800"}
    >
      {isLoading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex="overlay"
          bg="rgba(0, 0, 0, 0.4)"
        >
          <Spinner size="xl" color="blue.500" />
        </Center>
      )}
      <VStack
        spacing={4}
        width="full"
        maxW="md"
        boxShadow="lg"
        p={6}
        borderRadius="md"
        bg={colorMode === "light" ? "white" : "gray.700"}
        zIndex="base"
        opacity={isLoading ? 0.4 : 1}
      >
        <Heading color={colorMode === "light" ? "black" : "white"}>
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel color={colorMode === "light" ? "black" : "white"}>
              Email
            </FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isDisabled={isLoading}
              variant="flushed"
            />
          </FormControl>
          <FormControl id="password" isRequired mt={4}>
            <FormLabel color={colorMode === "light" ? "black" : "white"}>
              Password
            </FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isDisabled={isLoading}
              variant="flushed"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            mt={4}
            width="full"
            isLoading={isLoading}
          >
            Register
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default Register;
