import PostOptions from "./main/mainComponents/PostOptions";
import Comments from "./main/mainComponents/Comment";
import Profile from "./main/Profile";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { Box, Heading, Card, Text, Image, Flex } from "@chakra-ui/react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { UserAuth } from "./context/AuthContext";

const PostComponent = (props) => {
  //   const [posts, setPosts] = useState();
  const { posts } = UserAuth();

  //   async function showPosts() {
  //     const colRef = collection(db, "posts");
  //     const querySnapshot = await getDocs(
  //       query(colRef, orderBy("createdAt", "desc"))
  //     );
  //     const data = [];

  //     querySnapshot.forEach((doc) => {
  //       data.push({ ...doc.data(), id: doc.id });
  //     });

  //     return data;
  //   }

  //   useEffect(() => {
  //     fetchData();
  //   }, [posts]);

  //   const fetchData = async () => {
  //     const userDataPosts = await showPosts();
  //     setPosts(userDataPosts);
  //   };

  //   console.log(posts);
  return (
    <Box w="100%">
      <Box border="1px solid #e1e1e1" w="100%" p="16px 32px">
        {posts &&
          posts.map((post) => (
            <Card
              key={post.id}
              my="25px"
              boxShadow="1px 1px 5px #A5A5A5"
              borderRadius="6px"
              style={{ position: "relative" }}
            >
              <PostOptions postId={post.id} authorId={post.authorId} />

              <Box ml="24px" mt="16px" textAlign="start">
                <Profile name={post.name} authorId={post.authorId} />
              </Box>

              <Text as="kbd" ml="24px" fontSize="10px" color="gray.500">
                {formatDistanceToNow(post.datePosted)} ago
              </Text>
              <Flex pl="32px" py="32px" justify="space-between">
                <Box>
                  <Heading size="md">{post.postTitle}</Heading>
                  <br />

                  <Text fontSize="16px">{post.postContent}</Text>
                </Box>

                <Box mr="24px">
                  {!post.price ? (
                    <Text>₱ 0.00</Text>
                  ) : (
                    <>
                      <strong>₱ </strong>
                      {post.price}
                    </>
                  )}
                </Box>
              </Flex>
              <Flex w="100%" align="center" justify="center">
                <Image
                  src={post.postImg}
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
      </Box>
    </Box>
  );
};
export default PostComponent;
