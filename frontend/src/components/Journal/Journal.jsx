import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Box, VStack, Heading, Button, useColorMode } from "@chakra-ui/react";
import "./Journal.css";

const Journal = () => {
  const [value, setValue] = useState(`# Today's Journal Entry

**How are you feeling today?**

Start writing here...

`);

  const { colorMode } = useColorMode();

  return (
    <Box
      minH="100vh"
      w="100%"
      p={4}
      bg={colorMode === "light" ? "gray.50" : "gray.900"}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      pt="90px"
    >
      <VStack
        spacing={4}
        align="stretch"
        maxW="1200px"
        mx="auto"
        w="100%"
        h="calc(100vh - 90px)"
      >
        <Heading textAlign="center" size="lg">
          ✍️ Journal Space
        </Heading>

        <Box
          flex="1"
          overflow="hidden"
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderRadius="lg"
          boxShadow="lg"
          position="relative"
          mb={4}
        >
          <div data-color-mode={colorMode} style={{ height: "100%" }}>
            <MDEditor
              value={value}
              onChange={setValue}
              preview="edit"
              visibleDragbar={false}
              height="100%"
              style={{
                backgroundColor: colorMode === "light" ? "white" : "gray.800",
              }}
            />
          </div>
        </Box>

        <Box>
          <Button
            colorScheme="teal"
            size="lg"
            w="100%"
            onClick={() => {
              alert("Journal entry saved!");
            }}
          >
            Save Entry
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Journal;
