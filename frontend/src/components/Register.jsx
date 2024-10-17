import React, { useEffect, useState } from "react";
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
  Spinner,
  Center,
  useColorMode,
} from "@chakra-ui/react";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); // Get the current color mode
  const isAuthenticated = useSelector((state) => state.authentication.value);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(""); // Clear error before making the request
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/register`,
        formData
      );
      alert("Registration successful. Please check your email for OTP.");
      dispatch(trigger(isAuthenticated));
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false); // Stop loading
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
            Register
          </Button>
        </form>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default Register;
