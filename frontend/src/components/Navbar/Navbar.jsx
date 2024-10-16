import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Button,
  Spacer,
  IconButton,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import Serenity from "../../assets/serenity.jpeg";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check sessionStorage for the token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists

    // Listen for custom login event and update isLoggedIn state
    const handleLoginEvent = () => {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("login", handleLoginEvent);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("login", handleLoginEvent);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false); // Update the state so the UI reflects logout
    navigate("/login");
  };

  return (
    <Box bg={colorMode === "light" ? "purple.100" : "purple.900"} px={8}>
      <Flex
        h="70px" // Fixed height for the navbar
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading
          as="h1"
          size="lg"
          letterSpacing="tighter"
          color={colorMode === "light" ? "black" : "white"}
        >
          <RouterLink to="/">
            <Image
              src={Serenity}
              maxHeight="60px" // Restrict image height to fit within navbar
              objectFit="contain"
              alt="Serenity"
              borderRadius="md"
              border="2px solid"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
              margin="0 10px"
              padding="4px"
              alignSelf="center"
            />
          </RouterLink>
        </Heading>

        <Spacer />

        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          {!isLoggedIn ? (
            <>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="yellow" // Green button for Register
                variant="solid" // Solid variant to ensure button is colored
                fontSize="lg"
                _hover={{ bg: "yellow.600" }} // Hover effect
              >
                Register
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="purple" // Blue button for Login
                variant="solid" // Solid variant to ensure button is colored
                fontSize="lg"
                _hover={{ bg: "purple.600" }} // Hover effect
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              colorScheme="red" // Red button for Logout
              variant="solid"
              fontSize="lg"
              _hover={{ bg: "blue.600" }} // Hover effect
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <Button
            as={RouterLink}
            to="/contact"
            colorScheme="blue" // Teal button for Contact
            variant="solid"
            fontSize="lg"
            _hover={{ bg: "blue.600" }} // Hover effect
          >
            Contact
          </Button>
        </HStack>

        <IconButton
          size="md"
          fontSize="lg"
          aria-label={`Switch to ${
            colorMode === "light" ? "dark" : "light"
          } mode`}
          variant="ghost"
          color="current"
          ml={2}
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />

        {/* Mobile Menu */}
        <HStack display={{ base: "flex", md: "none" }} spacing={4}>
          <Button
            as={RouterLink}
            to="/"
            size="sm"
            colorScheme="blue"
            variant="solid" // Applies color scheme properly
            _hover={{ bg: "blue.600" }} // Hover effect for blue button
          >
            Home
          </Button>
          {!isLoggedIn ? (
            <Button
              as={RouterLink}
              to="/login"
              size="sm"
              colorScheme="green"
              variant="solid"
              _hover={{ bg: "yellow.600" }}
            >
              Register / Login
            </Button>
          ) : (
            <Button
              size="sm"
              colorScheme="red"
              variant="solid" // Ensures color scheme is applied
              _hover={{ bg: "red.600" }} // Hover effect for red button
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <Button
            as={RouterLink}
            to="/contact"
            size="sm"
            colorScheme="teal"
            variant="solid" // Consistent color scheme
            _hover={{ bg: "teal.600" }} // Hover effect for teal button
          >
            Contact
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
