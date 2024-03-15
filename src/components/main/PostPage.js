import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc, query, orderBy } from "firebase/firestore";
import {
  Box,
  Card,
  Flex,
  Text,
  Image,
  Heading,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Profile from "./Profile";
import PostOptions from "./mainComponents/PostOptions";
import { formatDistanceToNow } from "date-fns";
import Comments from "./mainComponents/Comment";
import { Link, useNavigate } from "react-router-dom";
import { Home, Compass, User, LogOut } from "react-feather";
import { UserAuth } from "../context/AuthContext";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";

const PostPage = () => {
  const { postId, userId } = useParams();
  const [post, setPost] = useState();
  const { user, userProfile } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const showPosts = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      const tempVar = [];
      if (docSnap.exists()) {
        tempVar.push(docSnap.data());
      }

      setPost(tempVar);
    };
    showPosts();
  }, []);
  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <>
      {/* user ? (
      <>
        <Box>
          <Text>Please login first</Text>
        </Box>
      </>
      ) : ( */}
      <Box h="100vh">
        <Flex
          className="navbar"
          justify="space-between"
          px="32px"
          py="12px"
          boxShadow="1px 0px 12px #aeaeae"
          w="100vw"
          overflow="hidden"
        >
          <Heading size="xl"> </Heading>
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
        <Flex align="center" justify="center" h="100%">
          <Flex align="start" justify="center" w="100vw" flexGrow={1} h="100%">
            {post &&
              post.map((doc) => (
                // <Card p="12px 24px" key={doc.id}>
                //   <Text>{doc.postContent}</Text>
                // </Card>
                <Card
                  key={doc.id}
                  mt="150px"
                  boxShadow="1px 1px 5px #A5A5A5"
                  borderRadius="6px"
                  style={{ position: "relative" }}
                  w="500px"
                >
                  <PostOptions postId={doc.id} authorId={doc.authorId} />

                  <Box ml="24px" mt="16px" textAlign="start">
                    <Profile authorId={userId} name={doc.name} />
                  </Box>

                  <Text as="kbd" ml="24px" fontSize="10px" color="gray.500">
                    {formatDistanceToNow(doc.datePosted)} ago
                  </Text>
                  <Flex pl="32px" pt="12px" justify="space-between">
                    <Box>
                      <Heading size="md">{doc.postTitle}</Heading>
                      <br />

                      <Text fontSize="16px">{doc.postContent}</Text>
                    </Box>

                    <Box mr="24px">
                      {!doc.price ? (
                        <Text>₱ 0.00</Text>
                      ) : (
                        <>
                          <strong>₱ </strong>
                          {doc.price}
                        </>
                      )}
                    </Box>
                  </Flex>
                  <Flex w="100%" align="center" justify="center">
                    <Image
                      src={doc.postImg}
                      w="20em"
                      alt="post image"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </Flex>

                  <Flex
                    w="100%"
                    textAlign="start"
                    p="12px 0 12px 0"
                    align="center"
                    justify="space-around"
                  >
                    <Box></Box>
                  </Flex>

                  <div
                    style={{
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#e1e1e1",
                      margin: "0 0 12px 0",
                    }}
                  ></div>

                  <Flex w="100%" align="center" justify="center" mb="12px">
                    <Box w="100%" textAlign="center" m="0 12px">
                      <Comments postID={post.id} authorId={post.authorId} />
                    </Box>
                  </Flex>
                </Card>
              ))}
          </Flex>
        </Flex>
      </Box>
      );
    </>
  );
};
export default PostPage;
