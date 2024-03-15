import "./Discover.css";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDocs, collection, addDoc } from "firebase/firestore";
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
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import { Plus } from "react-feather";
import AddDiscoverModal from "./AddDiscoverModal";
import { UserAuth } from "../../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
const Discover = () => {
  const { user } = UserAuth();
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const tertiaryColor = "#6e6e6e";
  const addDiscover = useDisclosure();
  const toast = useToast();
  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [post, setPost] = useState();
  const { postId, userId } = useParams();

  useEffect(() => {
    const fetchDiscoverPosts = async () => {
      const postsCollection = collection(db, "discover");
      const querySnapshot = await getDocs(postsCollection);
      const tempPosts = [];
      querySnapshot.forEach((doc) => {
        tempPosts.push({ id: doc.id, ...doc.data() });
      });
      setDiscoverPosts(tempPosts);
    };
    fetchDiscoverPosts();
  }, []);

  const handleSearchDiscover = (data) => {
    console.log(data);
  };

  const handleAddDiscover = (formData) => {
    // Add logic to save the form data to your database or state
    console.log(formData);
    const docRef = addDoc(collection(db, "discover"), formData);
    // For example, you can update the discoverPosts state with the new data
    setDiscoverPosts([...discoverPosts, formData]);
    addDiscover.onClose(); // Close the modal after submitting
    toast({
      title: "Post Created.",
      description: "Post successfully published.",
      status: "success",
      duration: 5000,
      position: "top",
    });
  };

  // useEffect(() => {
  //   const showPosts = async () => {
  //     if (!postId) {
  //       // Handle the case where postId is undefined
  //       return;
  //     }
  //     const docRef = doc(db, "discover", postId);
  //     const docSnap = await getDoc(docRef);
  //     const tempVar = [];
  //     if (docSnap.exists()) {
  //       tempVar.push(docSnap.data());
  //     }
  //     setPost(tempVar);
  //   };
  //   showPosts();
  // }, [postId]);

  return (
    <>
      <Box h="100vh">
        <Navigation />
        <Flex justify="space-between" p="0 86px 0px 64px">
          <Heading>Discover</Heading>
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

        <Box p="24px">
          <Flex
            gap="24px 24px"
            flexWrap="wrap"
            justify="space-evenly"
            align="center"
            mt="32px"
          >
            <Flex w="100%" justify="center" p="12px 24px">
              <form onSubmit={handleSearchDiscover}>
                <Flex w="100%" justify="space-between">
                  <Input borderRadius="24px" placeholder="Search" />
                  <Button p="12px 24px" type="submit" borderRadius="24px">
                    Search
                  </Button>
                </Flex>
              </form>
            </Flex>
            <Flex
              w="100%"
              gap="24px 12px"
              justify="center"
              align="center"
              flexWrap="wrap"
            >
              {discoverPosts.map((post) => (
                <Card key={post.id} w="400px" border="1px solid #e1e1e1">
                  <CardBody>
                    <Flex>
                      <Box w="100%">
                        <Image
                          objectFit="contain"
                          w="100%"
                          h="350px"
                          src={post.postImage}
                          alt="Post Image"
                        />
                      </Box>
                    </Flex>
                    <Flex justify="space-between" mt="24px">
                      <Button variant="link" color="#333333">
                        {post.authorName}
                      </Button>
                      <Text fontSize="xs" color="#6e6e6e" as="i">
                        {formatDistanceToNow(post.createdAt)} ago
                        {/* {post.createdAt instanceof Date
                          ? post.createdAt.toLocaleString()
                          : new Date(post.createdAt).toLocaleString()} */}
                        {/* {post.createdAt.toDate().toLocaleString()} */}
                      </Text>
                    </Flex>
                    <Box mt="12px">
                      <Text fontSize="sm" color="#6e6e6e">
                        {post.postContent}
                      </Text>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
export default Discover;
