import React from "react";
import {
  Box,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import MeditationSounds from "./MeditationSounds";

const Sidebar = ({
  isSidebarOpen,
  selectedMeditation,
  setSelectedMeditation,
  meditationForms,
  setIsSoundPlaying,
}) => {
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!isSidebarOpen) return null;

  return (
    <Box
      w="300px"
      bg={sidebarBg}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      h="calc(100% - 70px)"
      overflowY="auto"
      position="fixed"
      left="0"
      top="70px"
      zIndex="1"
    >
      <VStack spacing={6} align="stretch">
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Meditation Types
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <VStack spacing={3} align="stretch">
                {meditationForms.map((form, index) => (
                  <Button
                    key={index}
                    leftIcon={form.icon}
                    variant={
                      selectedMeditation.name === form.name ? "solid" : "ghost"
                    }
                    colorScheme="purple"
                    justifyContent="flex-start"
                    onClick={() => setSelectedMeditation(form)}
                  >
                    {form.name}
                  </Button>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Ambient Sounds
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <MeditationSounds
                onSoundStateChange={setIsSoundPlaying}
                displayType="vertical"
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default Sidebar;
