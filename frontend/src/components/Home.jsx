// src/components/Home.js
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  List,
  ListItem,
} from "@chakra-ui/react";

const Home = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to the Authentication App
      </Heading>
      <Text fontSize="lg" mb={6}>
        This app allows you to register, log in, and manage your account
        securely.
      </Text>
      <VStack spacing={4}>
        <List>
          <ListItem>
            <Link
              as={RouterLink}
              to="/register"
              color="blue.500"
              fontWeight="bold"
            >
              Register
            </Link>
          </ListItem>
          <ListItem>
            <Link
              as={RouterLink}
              to="/login"
              color="blue.500"
              fontWeight="bold"
            >
              Login
            </Link>
          </ListItem>
          <ListItem>
            <Link
              as={RouterLink}
              to="/forgot-password"
              color="blue.500"
              fontWeight="bold"
            >
              Forgot Password?
            </Link>
          </ListItem>
        </List>
      </VStack>
    </Box>
  );
};

export default Home;
