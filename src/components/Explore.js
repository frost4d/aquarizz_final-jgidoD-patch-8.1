import {
  Box,
  GridItem,
  Grid,
  Card,
  CardBody,
  Text,
  CardHeader,
  Heading,
  CardFooter,
  Image,
  Flex,
  Button,
  MenuList,
  MenuItem,
  IconButton,
  SkeletonText,
  SkeletonCircle,
  Skeleton,
  MenuGroup,
  MenuDivider,
  Divider,
  MenuButton,
  Menu,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";
import { Home, Compass, User, LogOut, ShoppingCart } from "react-feather";
import { useNavigate, Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { UserAuth } from "./context/AuthContext";

const Explore = () => {
  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };
  const navigate = useNavigate();
  const { user } = UserAuth();
  const cards = ["Card 1", "Card 2", "Card 3"];
  return (
    <>
      {" "}
      <Flex
        className="navbar"
        justify="space-between"
        px="32px"
        py="12px"
        boxShadow="1px 0px 12px #aeaeae"
        w="100vw"
        overflow="hidden"
      >
        <Heading size="xl">Feed</Heading>
        <Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              variant="outline"
              icon={<HamburgerIcon />}
            ></MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  navigate("/dashboard");
                }}
                icon={<Home size={16} />}
              >
                Home
              </MenuItem>
              <Link to="/discover">
                <MenuItem icon={<Compass size={16} />}>Discover</MenuItem>
              </Link>

              <MenuDivider />
              <MenuGroup title="Account">
                <MenuItem
                  onClick={() => {
                    navigate(`/profile/${user.uid}`);
                  }}
                  icon={<User size={16} />}
                >
                  Profile
                </MenuItem>
                <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex color="" justify="center" align="center">
        <Heading>Discover more here!</Heading>
      </Flex>
      <Flex justify="center" h="100vh" w="100vw" mt="56px">
        <Box w="75%">
          <Grid templateColumns="repeat(3, 1fr)" gap="14px">
            {/* dito mo ilagay yung card */}
            {cards &&
              cards.map((card) => (
                <>
                  <GridItem w="100%" key={card.id}>
                    <Card>
                      <CardHeader>
                        <Button variant="link" color="#000">
                          {/* dito yung Name {fish.name} lagyan mo nalang ng onClick event tapos mapupunta sa link na clinick*/}
                          Name
                        </Button>
                      </CardHeader>
                      <CardBody>
                        {/* dito yung image */}
                        <Image />
                        <Text>
                          View a summary of all your customers over the last
                          month.
                        </Text>
                      </CardBody>
                      <CardFooter
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        {/* dito yung mga scientific classifications */}

                        <Text fontSize="sm">sample text</Text>
                        <Text fontSize="sm">sample text</Text>
                        <Text fontSize="sm">sample text</Text>
                      </CardFooter>
                    </Card>
                  </GridItem>
                </>
              ))}
          </Grid>
        </Box>
      </Flex>
    </>
  );
};

export default Explore;
