import "./About.css";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Facebook, Mail, Twitter } from "react-feather";
import Logo from "../../assets/logo.svg";

const About = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box className="aboutWrapper" w="100%">
        {/* <Flex
          className="aboutNavbarWrapper"
          w="100%"
          justify="end"
          align="center"
          h="100px"
        >
          <Button mr="32px">Join Now</Button>
        </Flex> */}

        <Flex
          className="aboutContentWrapper"
          textAlign="center"
          justify="center"
          align="center"
          bg="#ffc947"
          position="relative"
          h="100%"
          flexDirection="column"
        >
          <Box
            position="absolute"
            top="100px"
            left="100px"
            transform="rotate(15deg)"
          >
            <Image
              h="300px"
              src={require("../../assets/cartoon fish(1).png")}
            />
          </Box>
          <Box
            position="absolute"
            bottom="150px"
            right="33%"
            transform="translateX(50%)"
          >
            <Image
              h="350px"
              src={require("../../assets/fish swimming(1).png")}
            />
          </Box>
          <Flex p="64px 0 0 0" flexDirection="column" zIndex="2" my="64px">
            <Heading fontSize="6xl">Aquarizz</Heading>
            <Box mt="32px">
              <Text fontWeight="500" fontSize="2xl">
                Connecting for the love of healthy fish.
              </Text>
              <Text fontWeight="500" fontSize="2xl">
                Aquarizz is a social media community to connect and sell items
                with other fish enthusiasts.
              </Text>
              <Text fontWeight="500" fontSize="2xl">
                Find your new favorite aquarium or accessory today!
              </Text>
            </Box>

            <Box textAlign="center" w="100%" p="32px 0">
              <Button
                bg="#fff"
                w="50%"
                onClick={() => {
                  navigate("/");
                }}
              >
                Join Now!
              </Button>
            </Box>
          </Flex>
          <Box w="100%">
            <Flex
              w="100%"
              mt="48px"
              p="81px 0"
              className="cardContainer"
              align="center"
              justify="center"
            >
              <Card h="200px" w="250px" position="relative">
                <CardHeader>
                  <Image
                    position="absolute"
                    top="12px"
                    left="12px"
                    h="50px"
                    src={require("../../assets/marketMoving.gif")}
                  />
                  <Heading fontSize="xl">Sell</Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize="sm">
                    Post your stuff and let people see what you are offering!
                  </Text>
                </CardBody>
              </Card>
              <Card h="200px" w="250px" position="relative">
                <CardHeader>
                  <Image
                    position="absolute"
                    top="12px"
                    left="12px"
                    h="50px"
                    src={require("../../assets/shoppingMoving.gif")}
                  />
                  <Heading fontSize="xl">Shop</Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize="sm">
                    Browse and find something that catches your eye!
                  </Text>
                </CardBody>
              </Card>
              <Card h="200px" w="250px">
                <CardHeader>
                  <Image
                    position="absolute"
                    top="12px"
                    left="12px"
                    h="50px"
                    src={require("../../assets/discoverMoving.gif")}
                  />
                  <Heading fontSize="xl">Discover</Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize="sm">Search for something new and learn!</Text>
                </CardBody>
              </Card>
            </Flex>
          </Box>
        </Flex>

        <Flex
          className="aboutFooterWrapper"
          overflowY="hidden"
          bg="#fdf5e6"
          p="48px 0"
          flexDirection="column"
        >
          <Box>
            <Image src={Logo} />
          </Box>
          <Flex justify="space-between" align="center">
            <Box ml="56px">
              <Text color="gray.500" fontSize="xs">
                Aquarizz | CodeMinded &copy; 2024
              </Text>

              <Text color="gray.500" fontSize="xs">
                Terms & Conditions
              </Text>
            </Box>
            <Box mr="56px">
              <Flex justify="space-evenly" align="center">
                <Box
                  border="1px solid #A9A9A9"
                  borderRadius="4px"
                  cursor="pointer"
                  p="1px 1px"
                >
                  <Facebook color="#808080" />
                </Box>
                <Box
                  border="1px solid #A9A9A9"
                  borderRadius="4px"
                  cursor="pointer"
                  p="1px 1px"
                >
                  <Mail color="#808080" />
                </Box>
                <Box
                  border="1px solid #A9A9A9"
                  borderRadius="4px"
                  cursor="pointer"
                  p="1px 1px"
                >
                  <Twitter color="#808080" />
                </Box>
              </Flex>

              <Text color="gray.500" fontSize="xs">
                codeminded.dev@example.com
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
export default About;
