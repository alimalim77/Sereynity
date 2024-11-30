// src/components/VerifyOTP.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import api from "../api/axios";
import {
  Box,
  Button,
  Heading,
  Input,
  HStack,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { colorMode } = useColorMode();
  const toast = useToast();

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
      const res = await api.post(`/v1/auth/verify`, {
        email: email,
        otp: otpCode,
      });
      toast({
        title: "Success",
        description: "OTP verified successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Clear verification state
      sessionStorage.removeItem("pendingVerification");
      sessionStorage.removeItem("verificationEmail");
      navigate("/login"); // Redirect to homepage or dashboard after successful OTP verification
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid or expired OTP";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt="80px" // Add top margin to push content below navbar
      py={10}
      px={6}
      bg="gray.800"
      borderRadius="md"
      boxShadow="lg"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6} color="white">
        Verify OTP
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="center">
          <HStack justify="center" spacing={2}>
            {otp.map((data, index) => (
              <Input
                key={index}
                type="tel"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                maxLength="1"
                width="50px"
                height="50px"
                textAlign="center"
                fontSize="xl"
                variant="filled"
                bg="gray.700"
                color="white"
                borderRadius="md"
                _focus={{
                  bg: "gray.600",
                  borderColor: "blue.300",
                }}
                required
              />
            ))}
          </HStack>
          <Button
            colorScheme="blue"
            type="submit"
            width="100%"
            size="lg"
            fontSize="md"
          >
            Verify OTP
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default VerifyOTP;
