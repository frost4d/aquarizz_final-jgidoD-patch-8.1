import "./Discover.css";
import { useEffect, useState } from "react";
import { db, collection } from "../../../firebase/firebaseConfig";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import Navigation from "./Navigation";
import { Plus } from "react-feather";
import AddDiscoverModal from "./AddDiscoverModal";
import { UserAuth } from "../../context/AuthContext";
const Discover = () => {
  const { user } = UserAuth();
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const tertiaryColor = "#6e6e6e";
  const addDiscover = useDisclosure();
  const [discoverPosts, setDiscoverPosts] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await db.collection("discover").get();
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      setDiscoverPosts(posts);
    };
    fetchData();
  }, []);

  // const discoverPost = [
  //   {
  //     id: 1,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  //   {
  //     id: 2,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  //   {
  //     id: 3,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  //   {
  //     id: 4,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  //   {
  //     id: 5,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  //   {
  //     id: 6,
  //     authorLastName: "Doe",
  //     authorFirstName: "John",
  //     postContent:
  //       "Quis nisi sunt dolore laborum aliquip sit commodo non laborum commodo aliqua. Eu do duis esse consequat ut excepteur magna. Sint eiusmod sit esse ex mollit duis in voluptate enim velit magna laboris.",
  //     postTitle: "Velit quis nisi reprehenderit commodo aliquip eu.",
  //     createdAt: "2hrs ago",
  //   },
  // ];

  const handleSearchDiscover = (data) => {
    console.log(data);
  };
  return (
    <>
      <Box h="100vh">
        <Navigation />
        <Flex justify="space-between" p="0 86px 0px 64px">
          <Heading fontFamily={primaryFont}>Discover</Heading>
          <Flex display={user ? "flex" : "none"} justify="space-between">
            <Button
              mr="12px"
              variant="ghost"
              leftIcon={<Plus size={16} />}
              onClick={addDiscover.onOpen}
            >
              <AddDiscoverModal
                isOpen={addDiscover.isOpen}
                onClose={addDiscover.onClose}
              />
              Create
            </Button>
            <Button variant="ghost" color="#333333">
              My Shop
            </Button>
          </Flex>
        </Flex>

        <Box className="discoverContentsWrapper" p="24px">
          <Flex
            // maxH="calc(100vh - 212px)"
            // overflow="auto"
            className="discoverContents"
            gap="24px 24px"
            flexWrap="wrap"
            justify="space-evenly"
            align="center"
            mt="32px"
          >
            <Flex w="100%" justify="center" p="12px 24px">
              <form onSubmit={handleSearchDiscover}>
                <Flex className="searchTags" w="100%" justify="space-between">
                  <Input borderRadius="24px" placeholder="e.g. #tags" />
                  <Button p="12px 24px" type="submit" borderRadius="24px">
                    Search
                  </Button>
                </Flex>
              </form>
            </Flex>
            <Flex
              w="100%"
              gap="24px 12px"
              justify="space-evenly"
              align="center"
              flexWrap="wrap"
            >
              {/* <Box className="cardContents">
                <Box className="cardHeader">
                  <Button variant="link" color="#000">
                    John Doe
                  </Button>
                </Box>
                <Box className="imageWrapper" p="12px 12px">
                  <Image src={require("../../../assets/design/aquarium.png")} />
                </Box>
                <Box className="cardFooter"></Box>
              </Box> */}
              {discoverPosts &&
                discoverPosts.map((post) => (
                  <>
                    <Card
                      key={post.id}
                      h="600px"
                      w="400px"
                      // overflowY="hidden"
                      // boxShadow="0 8px 12px #e1e1e1"
                    >
                      <CardBody>
                        <Flex className="cardContent">
                          <Box className="imageWrapper" w="100%">
                            <Image
                              objectFit="cover"
                              w="100%"
                              h="350px"
                              src={require("../../../assets/design/aquarium.png")}
                            />
                          </Box>
                        </Flex>
                        <Flex justify="space-between" mt="24px">
                          <Button variant="link" color="#333333">
                            {post.authorFirstName} {post.authorLastName}
                          </Button>
                          <Text fontSize="xs" color={tertiaryColor} as="i">
                            {post.createdAt}
                          </Text>
                        </Flex>
                        <Box mt="12px">
                          <Text fontSize="sm" color={tertiaryColor}>
                            {post.postContent}
                          </Text>
                        </Box>
                      </CardBody>

                      {/* <Box m="0 16px 32px 24px">
                        <Button bg={primaryColor} w="100%">
                          View Product
                        </Button>
                      </Box> */}
                    </Card>
                  </>
                ))}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
export default Discover;
