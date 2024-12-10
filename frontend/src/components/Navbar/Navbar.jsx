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
import { useSelector, useDispatch } from "react-redux";
import { trigger } from "../../redux/authenticationSlice";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.authentication.value);
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(trigger(true));
    } else {
      dispatch(trigger(false));
    }
  }, [dispatch]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch(trigger(false));
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
      zIndex={1000}
      height="70px"
      width="100%"
    >
      <Flex h="100%" alignItems="center" justifyContent="space-between">
        <Heading
          as="h1"
          size="lg"
          letterSpacing="tighter"
          color={colorMode === "light" ? "black" : "white"}
        >
          <RouterLink to="/">
            <Image
              src={Serenity}
              maxHeight="60px"
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
          {!isAuthenticated ? (
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
            to="/details"
            colorScheme="blue"
            variant="solid"
            size={buttonSize}
            _hover={{ bg: "blue.600" }}
          >
            Details
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
          {!isAuthenticated ? (
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
            to="/details"
            size={buttonSize}
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.600" }}
          >
            Details
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
