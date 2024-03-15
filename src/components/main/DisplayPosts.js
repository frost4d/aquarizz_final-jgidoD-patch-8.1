import { Card, Heading, Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const DisplayPosts = () => {
  const [posts, setPosts] = useState();
  async function showPosts() {
    const colRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(colRef, orderBy("createdAt", "desc"))
    );
    // const q = query(colRef, orderBy("date", "desc"), limit(5));
    const data = [];

    // onSnapshot(colRef, (snapshot) => {
    //   snapshot.docs.forEach((doc) => {
    //     data.push({ ...doc.data(), id: doc.id });
    //   });
    // });

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }
  useEffect(() => {
    fetchData();
    console.log(posts);
  }, []);

  const fetchData = async () => {
    const userDataPosts = await showPosts();
    setPosts(userDataPosts);
  };
  return (
    <>
      {posts &&
        posts.map((post) => {
          <Card key={post.id}>
            <Heading>{post.name}</Heading>
            <Text>{formatDistanceToNow(post.datePosted)}</Text>
            <Text>{post.postContent}</Text>
          </Card>;
        })}
    </>
  );
};

export default DisplayPosts;
