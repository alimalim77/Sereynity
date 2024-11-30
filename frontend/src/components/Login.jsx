import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { trigger } from "../redux/authenticationSlice";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  useColorMode,
  useToast,
} from "@chakra-ui/react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post(`/v1/auth/login`, formData);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      sessionStorage.setItem("token", res.data.token.access.token);
      dispatch(trigger(true));
      navigate("/");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
          Login
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
            Login
          </Button>
        </form>

        {/* Reset Password Link */}
        <Text
          mt={4}
          color="blue.500"
          cursor="pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot your password? Reset it here.
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
