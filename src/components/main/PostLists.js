import { Box, Text } from "@chakra-ui/react";
import Post from "./Post";

const PostsLists = ({ posts }) => {
  return (
    <>
      <Box>
        {posts?.length === 0 ? (
          <Text>No posts here</Text>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </Box>
    </>
  );
};
