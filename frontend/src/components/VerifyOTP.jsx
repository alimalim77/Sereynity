// src/components/VerifyOTP.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  HStack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Extract location
  const email = location.state?.email;
  const { colorMode } = useColorMode(); // Get the current color mode

  const handleChange = (element, index) => {
    const value = element.value;

    // Ensure the input is a number (0-9)
    if (!/^\d$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit is entered
    if (value && element.nextSibling) {
      element.nextSibling.focus();
    }

    // Handle backspace (when input is empty, move to the previous field)
    if (!value && element.previousSibling) {
      element.previousSibling.focus();
    }
  };

  // Handle OTP submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpCode = Number(otp.join("")); // Combine the digits into a single string
      const res = await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/verify`,
        {
          email: email,
          otp: otpCode,
        }
      );
      alert("OTP verified successfully");
      navigate("/login"); // Redirect to homepage or dashboard after successful OTP verification
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      py={10}
      px={6}
      bg={colorMode === "light" ? "white" : "gray.800"} // Dynamic background color
      borderRadius="md"
      boxShadow="lg"
    >
      <Heading
        as="h2"
        size="lg"
        textAlign="center"
        mb={6}
        color={colorMode === "light" ? "black" : "white"}
      >
        Verify OTP
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="center">
          <HStack justify="center">
            {otp.map((data, index) => (
              <Input
                type="tel"
                name="otp"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                maxLength="1"
                width="40px"
                height="40px"
                textAlign="center"
                fontSize="xl"
                variant="outline"
                focusBorderColor="blue.500"
                autoComplete="off"
                required
                color={colorMode === "light" ? "black" : "white"} // Input text color
                bg={colorMode === "light" ? "gray.200" : "gray.600"} // Input background color
              />
            ))}
          </HStack>
          <Button colorScheme="blue" type="submit" width="100%">
            Verify OTP
          </Button>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default VerifyOTP;
