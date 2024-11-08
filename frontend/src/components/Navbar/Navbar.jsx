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
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import Serenity from "../../assets/serenity.jpeg";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Responsive button size
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

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
    <Box
      bg={colorMode === "light" ? "purple.100" : "purple.900"}
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="sticky"
    >
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

        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {!isLoggedIn ? (
            <>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="yellow"
                variant="solid"
                size={buttonSize}
                _hover={{ bg: "yellow.600" }}
              >
                Register
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="purple"
                variant="solid"
                size={buttonSize}
                _hover={{ bg: "purple.600" }}
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              colorScheme="red"
              variant="solid"
              size={buttonSize}
              _hover={{ bg: "red.600" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <Button
            as={RouterLink}
            to="/contact"
            colorScheme="blue"
            variant="solid"
            size={buttonSize}
            _hover={{ bg: "blue.600" }}
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
        <HStack display={{ base: "flex", md: "none" }} spacing={2}>
          <Button
            as={RouterLink}
            to="/"
            size={buttonSize}
            colorScheme="blue"
            variant="solid"
            _hover={{ bg: "blue.600" }}
          >
            Home
          </Button>
          {!isLoggedIn ? (
            <Button
              as={RouterLink}
              to="/login"
              size={buttonSize}
              colorScheme="green"
              variant="solid"
              _hover={{ bg: "green.600" }}
            >
              Login
            </Button>
          ) : (
            <Button
              size={buttonSize}
              colorScheme="red"
              variant="solid"
              _hover={{ bg: "red.600" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
          <Button
            as={RouterLink}
            to="/contact"
            size={buttonSize}
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.600" }}
          >
            Contact
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
