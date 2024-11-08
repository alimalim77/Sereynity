import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
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

const ResetPassword = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
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

  const handleChange = (element, index) => {
    const value = element.value;

    if (!/^\d$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && element.nextSibling) {
      element.nextSibling.focus();
    }

    if (!value && element.previousSibling) {
      element.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpCode = Number(otp.join(""));
      const email = localStorage.getItem("forgotEmail");

      const response = await axios.post(
        `${process.env.REACT_APP_URI}/v1/auth/reset-password`,
        {
          email: email,
          otp: otpCode,
        }
      );
      showNotification("Success", "OTP verified successfully!", "success");
      navigate("/confirm-password", {
        state: {
          token: response.data.token.access.token,
          expires: response.data.token.access.expires,
        },
      });
    } catch (err) {
      showNotification("Invalid OTP", "Please try again.", "error");
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
          Verify OTP
        </Heading>
        <form onSubmit={handleSubmit}>
          <HStack justify="center" spacing={2}>
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
                color={colorMode === "light" ? "black" : "white"}
                bg={colorMode === "light" ? "white" : "gray.600"}
              />
            ))}
          </HStack>
          <Button type="submit" colorScheme="blue" mt={4} width="full">
            Verify OTP
          </Button>
        </form>
        {/* {error && showNotification("Error", error, "error")} */}
      </VStack>
    </Box>
  );
};

export default ResetPassword;
