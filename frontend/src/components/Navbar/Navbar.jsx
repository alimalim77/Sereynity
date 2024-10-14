import React from "react";
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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={colorMode === "light" ? "gray.100" : "gray.900"} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo Section (aligned to the left) */}
        <Heading
          as="h1"
          size="lg"
          letterSpacing="tighter"
          color={colorMode === "light" ? "black" : "white"}
        >
          <RouterLink to="/home">MyApp</RouterLink>
        </Heading>

        {/* Spacer pushes the links section to the right */}
        <Spacer />

        {/* Links Section (aligned to the right) */}
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          <Link
            as={RouterLink}
            to="/register"
            fontSize="lg"
            color={colorMode === "light" ? "black" : "white"}
          >
            Register
          </Link>
          <Link
            as={RouterLink}
            to="/login"
            fontSize="lg"
            color={colorMode === "light" ? "black" : "white"}
          >
            Login
          </Link>
          <Link
            as={RouterLink}
            to="/contact"
            fontSize="lg"
            color={colorMode === "light" ? "black" : "white"}
          >
            Contact
          </Link>
        </HStack>

        {/* Theme Toggle Button */}
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

        {/* Mobile Menu (for small screens) */}
        <HStack display={{ base: "flex", md: "none" }} spacing={4}>
          <Button as={RouterLink} to="/" size="sm" colorScheme="blue">
            Home
          </Button>
          <Button as={RouterLink} to="/login" size="sm" colorScheme="green">
            Register / Login
          </Button>
          <Button as={RouterLink} to="/contact" size="sm" colorScheme="teal">
            Contact
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
