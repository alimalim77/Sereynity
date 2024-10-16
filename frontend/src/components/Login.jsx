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
  Spinner,
  Center,
  useColorMode,
} from "@chakra-ui/react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); // Get the current color mode

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/login`,
        formData
      );
      alert("Login successful", res.data);
      sessionStorage.setItem("token", res.data.token.access.token);
      window.dispatchEvent(new Event("login"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
      bg={colorMode === "light" ? "white" : "gray.800"} // Background color
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
        bg={colorMode === "light" ? "white" : "gray.700"} // Card background color
        zIndex="base"
        opacity={isLoading ? 0.4 : 1} // Reduce opacity when loading
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
              isDisabled={isLoading} // Disable input when loading
              variant="flushed" // Optional: Change the input style
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
              isDisabled={isLoading} // Disable input when loading
              variant="flushed" // Optional: Change the input style
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            mt={4}
            width="full"
            isLoading={isLoading} // Show loading spinner in the button
          >
            Login
          </Button>
        </form>
        {error && <Text color="red.500">{error}</Text>}

        {/* Reset Password Link */}
        <Text
          mt={4}
          color="blue.500"
          cursor="pointer"
          onClick={() => navigate("/forgot-password")} // Change to your reset password route
        >
          Forgot your password? Reset it here.
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
