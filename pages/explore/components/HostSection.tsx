import { Avatar, Box, Flex, HStack, Heading, Icon, Text } from "native-base";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HostSection = () => {
  return (
    <Flex flexWrap="wrap" flexDirection="row" justifyContent="center" p={4}>
      <Box w="100%" pb={2}>
        <Heading>Host</Heading>
      </Box>
      <HStack
        flexWrap="wrap"
        justifyContent="center"
        borderRadius={"xl"}
        bg="#E5E8D9"
        w="100%"
        mx={4}
        py={4}
      >
        <Box w="50%" justifyContent="center" alignItems="center">
          <Avatar
            source={{ uri: "https://picsum.photos/200/200" }}
            mr={4}
            size="xl"
          />
        </Box>
        <Box w="50%">
          <Heading w="80%" borderBottomWidth={0.5} fontSize="2xl">
            HostName
          </Heading>
          <HStack pt={2}>
            <Text fontSize="3xl" fontWeight="bold">
              4.8
            </Text>
            <Icon
              as={<MaterialCommunityIcons name={"star"} />}
              color="#FFAF87"
              size="2xl"
              my={1}
              mr={2}
            />
          </HStack>
        </Box>
      </HStack>
    </Flex>
  );
};

export default HostSection;