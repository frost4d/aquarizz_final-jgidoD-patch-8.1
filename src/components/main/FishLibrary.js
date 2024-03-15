import { useEffect, useState, useRef } from "react";
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
  AspectRatio,
  Input,
  useToast,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";

// import { auth, db } from "../firebase/firebaseConfig";
import { auth, db } from "../../firebase/firebaseConfig";
import { Home, Compass, User, LogOut, ShoppingCart } from "react-feather";
import { useNavigate, Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
// import { UserAuth } from "./context/AuthContext";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";

const FishLibrary = () => {
  const [fishData, setFishData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [loadingImage, setLoadingImage] = useState(true);
  const page = useRef(1);
  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };
  const navigate = useNavigate();
  const { user } = UserAuth();
  const toast = useToast();
  // const cards = ["Card 1", "Card 2", "Card 3"];

  const searchFish = async (fishName) => {
    try {
      const options = {
        method: "GET",
        url: `https://fish-species.p.rapidapi.com/fish_api/fish/${fishName}`,
        headers: {
          "X-RapidAPI-Key":
            "e3cd78753fmshb1c3657acff34f0p1e18ccjsn4849685581f2",
          "X-RapidAPI-Host": "fish-species.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      console.log(response.data);
      setDataSearch(response.data);
      setLoadingImage(false);
    } catch (err) {
      toast({
        title: "Invalid search.",
        description:
          "Sorry, it seems like we didn't get what you're trying to look for.",
        status: "error",
        duration: 7000,
        position: "top",
      });
    }
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);

    // Make API request only if the input value is not empty
    if (inputValue.trim() !== '') {
      searchFish(inputValue);
    }
  };

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    console.log(searchText);
    try {
      await searchFish(searchText);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsSearching(false);
    }
    console.log(dataSearch);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const options = {
        method: "GET",
        url: "https://fish-species.p.rapidapi.com/fish_api/fishes",
        headers: {
          "X-RapidAPI-Key":
            "e3cd78753fmshb1c3657acff34f0p1e18ccjsn4849685581f2",
          "X-RapidAPI-Host": "fish-species.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      const newData = response.data;
      setFishData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length > 0);
      console.log(response.data);
      console.log(fishData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount
  const loadMore = () => {
    page.current++;
    fetchData();
  };

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
        <Flex
          cursor="pointer"
          justify="center"
          align="center"
          onClick={() => {
            window.location.reload();
          }}
        >
          <Compass size={32} />
          <Heading ml="12px" size="xl">
            Discover
          </Heading>
        </Flex>

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
                icon={<ShoppingCart size={16} />}
              >
                Buy/Sell
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
      <Flex
        mt="24px"
        color=""
        justify="center"
        align="center"
        flexDirection="column"
      >
        <Heading mb="24px">Find more here!</Heading>
        <Flex align="center" justify="center" w="50%">
          <Input
            placeholder="Search..."
            mr="12px"
            value={searchText}
            onChange={handleSearchChange}
          />
          <Button onClick={handleSearchClick}>Search</Button>
        </Flex>
      </Flex>
      <Flex justify="center" w="100vw" mt="100px">
        {loadingImage ? (
          <>
            <Flex
              alignSelf="center"
              w="100%"
              align="center"
              justify="center"
              flexDirection="column"
            >
              <Image
                mt="24px"
                src={require("../../assets/aquarium.gif")}
                w="200px"
              />
              <Text mt="120px" fontSize="xl"></Text>
            </Flex>
          </>
        ) : (
          <Box h="500px" w="500px">
            {dataSearch &&
              dataSearch.map((data) => (
                <>
                  <Card key={data.id} mt="24px">
                    <CardHeader>
                      <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="link" color="#000">
                          {data.name}
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <AspectRatio
                        ratio={16 / 9}
                        minHeight="200px"
                        width="100%"
                      >
                        <Image src={data.img_src_set["1.5x"]} />
                      </AspectRatio>
                    </CardBody>
                    <CardFooter
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      {data.meta.scientific_classification && (
                        <>
                          <Flex flexDirection="column">
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Kingdom:
                              </Text>
                              <Text fontSize="sm">{`${data.meta.scientific_classification.kingdom}`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Phylum:
                              </Text>
                              <Text fontSize="sm">{`${data.meta.scientific_classification.phylum}`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Class:
                              </Text>
                              <Text fontSize="sm">{`${data.meta.scientific_classification.class}`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Order:
                              </Text>
                              <Text fontSize="sm">{`${
                                !data.meta.scientific_classification.order
                                  ? ""
                                  : data.meta.scientific_classification.order
                              }`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Superfamily:
                              </Text>
                              <Text fontSize="sm">{`${data.meta.scientific_classification.superfamily}`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Family:
                              </Text>
                              <Text fontSize="sm">{`${data.meta.scientific_classification.family}`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Genus:
                              </Text>
                              <Text fontSize="sm">{`${
                                !data.meta.scientific_classification.genus
                                  ? "No data found"
                                  : data.meta.scientific_classification.genus
                              }`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Type Species:
                              </Text>
                              <Text fontSize="sm">{`${
                                !data.meta.scientific_classification
                                  .type_species
                                  ? "No data found"
                                  : data.meta.scientific_classification
                                      .type_species
                              }`}</Text>
                            </Flex>
                            <Flex>
                              <Text fontSize="sm" fontWeight="bold" mr="2">
                                Synonyms:
                              </Text>
                              <Text fontSize="sm">{`${
                                !data.meta.scientific_classification.synonyms
                                  ? "No data found"
                                  : data.meta.scientific_classification.synonyms
                              }`}</Text>
                            </Flex>
                          </Flex>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </>
              ))}
          </Box>
        )}

        {/* <Box w="60%">
          <InfiniteScroll
            dataLength={fishData ? fishData.length : ""}
            next={fetchData}
            hasMore={hasMore}
            endMessage={
              <Text textAlign="center">No more fish to discover!</Text>
            }
          >
            <Grid templateColumns="repeat(3, 1fr)" gap="24px" overflow="hidden">
              {Array.isArray(fishData) &&
                fishData.map((fish) => (
                  <>
                    <GridItem w="100%" key={fish.id}>
                      <Card
                        h="100%"
                        display="flex"
                        flexDirection="column"
                        w="350px"
                      >
                        <CardHeader>
                          <Link
                            to={fish.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="link" color="#000">
                              {fish.name}
                            </Button>
                          </Link>
                        </CardHeader>
                        <CardBody>
                          <AspectRatio
                            ratio={16 / 9}
                            minHeight="200px"
                            width="100%"
                          >
                            <Image
                              src={fish.img_src_set["1.5x"]}
                              objectFit="cover"
                            />
                          </AspectRatio>
                        </CardBody>
                        <CardFooter
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          flexDirection="column"
                        >
                          {fish.meta.scientific_classification && (
                            <>
                              <Flex flexDirection="column">
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Kingdom:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.kingdom}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Phylum:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.phylum}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Class:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.class}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Order:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.order}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Superfamily:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.superfamily}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Family:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.family}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Genus:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.genus}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Type Species:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.type_species}`}</Text>
                                </Flex>
                                <Flex>
                                  <Text fontSize="sm" fontWeight="bold" mr="2">
                                    Synonyms:
                                  </Text>
                                  <Text fontSize="sm">{`${fish.meta.scientific_classification.synonyms}`}</Text>
                                </Flex>
                              </Flex>
                            </>
                          )}
                        </CardFooter>
                      </Card>
                    </GridItem>
                  </>
                ))}
            </Grid>
          </InfiniteScroll>
        </Box> */}
      </Flex>
    </>
  );
};

export default FishLibrary;
