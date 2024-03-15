import "./LandingPageMarket.css";
import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  Input,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  FormLabel,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import {
  User,
  Edit,
  Compass,
  ShoppingBag,
  ArrowRight,
  Facebook,
  Mail,
  Twitter,
} from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoginModal from "./LoginModal";
import { UserAuth } from "../../context/AuthContext";
import Navigation from "./Navigation";
import SearchInput from "./components/SearchInput";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
const LandingPageMarket = () => {
  const loginModal = useDisclosure();
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const secondaryFont = '"Montserrat", sans-serif';
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(false);
  const { user, userProfile } = UserAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const checkUser = () => {
    if (!user) return;
    setIsUser(true);
  };

  useEffect(() => {
    checkUser();
  }, []);
  const handleLogout = async () => {
    if (!user) return;
    try {
      signOut(auth);
    } catch (err) {
      console.log(err.message);
    } finally {
      window.location.reload();
    }
  };
  const handleSearchClick = (data) => {
    console.log(data);
  };

  console.log(user);

  return (
    <>
      <Box
        className="mainWrapper"
        h="100vh"
        fontFamily={primaryFont}
        overflowY="auto"
      >
        {/* <Navigation /> */}
        <Flex
          justify="space-between"
          align="center"
          className="navWrapper"
          pt="32px"
        >
          <Box w="100%" onClick={() => navigate("/")} cursor="pointer">
            <Image
              src={require("../../../assets/logo.svg").default}
              alt="aquarizz-logo"
            />
          </Box>
          <Flex
            className="navbarButtons"
            justify="end"
            align="center"
            w="100%"
            mr="42px"
          >
            <Button
              variant="ghost"
              color="#000"
              rightIcon={<ShoppingBag size={16} />}
              _hover={{ bg: "rgba(255,255,255,.3)" }}
              onClick={() => {
                navigate("/shop");
              }}
            >
              Shop
            </Button>
            <Button
              variant="ghost"
              color="#000"
              rightIcon={<Compass size={16} />}
              _hover={{
                bg: "rgba(255,255,255,.3)",
              }}
              onClick={() => {
                navigate("/discover");
              }}
            >
              Discover
            </Button>

            {userProfile ? (
              <>
                <Menu>
                  <MenuButton>{userProfile.email}</MenuButton>
                  <MenuList>
                    <MenuGroup title="Profile">
                      <MenuItem>My Account</MenuItem>
                      <MenuItem>My Shop</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Support">
                      <MenuItem>Contact Us</MenuItem>
                      <MenuItem>FAQs</MenuItem>
                      <MenuItem>Return & Exchanges</MenuItem>
                      <MenuItem>Privacy Policy</MenuItem>
                      <MenuItem>Terms of Service</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Button
                variant="ghost"
                color="#000"
                rightIcon={<User size={16} />}
                _hover={{ bg: "rgba(255,255,255,.3)" }}
                onClick={loginModal.onOpen}
              >
                <LoginModal
                  isOpen={loginModal.isOpen}
                  onClose={loginModal.onClose}
                />
                Login
              </Button>
            )}

            <Button
              bg={primaryColor}
              color="#000"
              rightIcon={<Edit size={16} />}
              _hover={{ bg: "rgba(255,255,255,.3)" }}
              onClick={() => {
                user ? (
                  navigate("/shop")
                ) : (
                  <>
                    {loginModal.onOpen()}
                    <LoginModal
                      isOpen={loginModal.isOpen}
                      onClose={loginModal.onClose}
                    />
                  </>
                );
              }}
            >
              Create listing
            </Button>
          </Flex>
        </Flex>
        <Box className="contentWrapper">
          <Box className="titleText" textAlign="center" p="120px 0" w="100%">
            <Heading fontFamily={primaryFont} fontWeight="600">
              Connecting for the love of having a healthy fish.
            </Heading>
            <Text
              fontFamily={primaryFont}
              fontWeight="300"
              fontSize="xl"
              color="#fff"
            >
              A social media community to connect and sell your items.
            </Text>
          </Box>

          <Flex
            bg="rgba(255,255,255,.2)"
            m="0 auto"
            borderRadius="32px"
            p="81px 64px"
            w="75%"
            className="cardWrapper"
            position="relative"
            overflow="hidden"
          >
            <Box w="100%">
              <Heading fontSize="46px" color="#333333">
                We are Aquarizz!
              </Heading>
              <Text mt="56px" maxW="500px" fontSize="2xl">
                A modern social media community that enables people to shop,
                discover, and sell for your fishkeeping!
              </Text>
              <Button mt="81px" bg={primaryColor} color="#333333" p="20px 40px">
                Become a part now!
              </Button>
            </Box>
            <Box w="100%">
              <Box>
                <Image
                  h="560px"
                  src={require("../../../assets/contentInfo.png")}
                />
              </Box>
            </Box>
            <Image
              position="absolute"
              bottom="-50px"
              right="-20px"
              h="500px"
              zIndex="-1"
              src={require("../../../assets/fish swimming(1).png")}
            />
          </Flex>
          <SearchInput />

          <Box my="32px" w="100%" textAlign="center">
            <Box my="56px">
              <Heading fontFamily={primaryFont}>Explore the shop now!</Heading>
            </Box>
            <Flex
              className="tagsWrapper"
              justify="center"
              align="center"
              flexWrap="wrap"
              flexGrow="shrink"
            >
              <Box className="fishWrapper">
                <Box overflow="hidden">
                  <Image
                    h="400px"
                    w="300px"
                    objectFit="cover"
                    className="fish"
                    src={require("../../../assets/design/fishes.jpg")}
                  />
                </Box>

                <Heading fontSize="xl" mt="12px" color="#000">
                  Fish
                </Heading>
                <Flex justify="center" align="center">
                  <Text mr="6px">See all</Text>
                  <ArrowRight size={16} />
                </Flex>
              </Box>
              <Box className="decorWrapper">
                <Box overflow="hidden">
                  <Image
                    h="400px"
                    w="300px"
                    objectFit="cover"
                    className="decor"
                    src={require("../../../assets/design/decor.jpg")}
                  />
                </Box>
                <Heading fontSize="xl" mt="12px" color="#000">
                  Accessories
                </Heading>
                <Flex justify="center" align="center">
                  <Text mr="6px">See all</Text>
                  <ArrowRight size={16} />
                </Flex>
              </Box>
              <Box className="feedsWrapper">
                <Box overflow="hidden">
                  <Image
                    h="400px"
                    w="300px"
                    objectFit="cover"
                    className="feeds"
                    src={require("../../../assets/design/feeds.jpg")}
                  />
                </Box>
                <Heading fontSize="xl" mt="12px" color="#000">
                  Feeds
                </Heading>
                <Flex justify="center" align="center">
                  <Text mr="6px">See all</Text>
                  <ArrowRight size={16} />
                </Flex>
              </Box>
              <Box className="aquariumWrapper">
                <Box overflow="hidden">
                  <Image
                    h="400px"
                    w="300px"
                    objectFit="cover"
                    className="aquarium"
                    src={require("../../../assets/design/aquarium.png")}
                  />
                </Box>
                <Heading fontSize="xl" mt="12px" color="#000">
                  Aquarium
                </Heading>
                <Flex justify="center" align="center">
                  <Text mr="6px">See all</Text>
                  <ArrowRight size={16} />
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Flex
          className="footerWrapper"
          bg="#efefef"
          justify="space-evenly"
          align="center"
        >
          <Box>
            <Box mb="16px">
              <Image
                src={require("../../../assets/logo2.png")}
                alt="aquarizz-logo"
              />
            </Box>
            <Box className="addressWrapper">
              <Text fontSize="xs" color="#333333">
                Gordon College
              </Text>
              <Text fontSize="xs" color="#333333">
                Olongapo City
              </Text>
            </Box>
            <Flex className="socialLink" justify="start" align="center">
              <Box>
                <Facebook size="18px" color="#3B5998" />
              </Box>
              <Box>
                <Mail size="18px" color="#FF0000" />
              </Box>
              <Box>
                <Twitter size="18px" color="#1DA1F2" />
              </Box>
            </Flex>
          </Box>
          <Flex flexDirection="column" align="start">
            <Heading fontSize="xl">Shop</Heading>
            <Box className="shopLink">
              <Text color="#333333" fontSize="xs">
                Fish
              </Text>
              <Text color="#333333" fontSize="xs">
                Accessories
              </Text>
              <Text color="#333333" fontSize="xs">
                Feeds
              </Text>
              <Text color="#333333" fontSize="xs">
                Aquarium
              </Text>
            </Box>
          </Flex>
          <Flex className="supportLink" flexDirection="column">
            <Text color="#333333" fontSize="xs">
              Contact Us
            </Text>
            <Text color="#333333" fontSize="xs">
              FAQs
            </Text>
            <Text color="#333333" fontSize="xs">
              Returns & Exchanges
            </Text>
            <Text color="#333333" fontSize="xs">
              Privacy Policy
            </Text>
            <Text color="#333333" fontSize="xs">
              Terms of Service
            </Text>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
export default LandingPageMarket;
