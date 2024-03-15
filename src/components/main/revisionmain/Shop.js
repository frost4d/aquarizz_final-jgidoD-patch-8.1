import "./Shop.css";
import { useState, useEffect } from "react"; 
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import {
  Box,
  Heading,
  Flex,
  Button,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import Navigation from "./Navigation";
import SearchInput from "./components/SearchInput";
import { UserAuth } from "../../context/AuthContext";
import { Plus } from "react-feather";
import Create from "./listing/Create";
const Shop = () => {
  const { user } = UserAuth();
  const addShop = useDisclosure();
  const toast = useToast();
  const [shopPosts, setShopPosts] = useState([]);
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const tertiaryColor = "#6e6e6e";
  const modalShop = useDisclosure();

  useEffect(() => {
    const fetchShopPosts = async () => {
      const postsCollection = collection(db, "shop");
      const querySnapshot = await getDocs(postsCollection);
      const tempPosts = [];
      querySnapshot.forEach((doc) => {
        tempPosts.push({ id: doc.id, ...doc.data() });
      });
      setShopPosts(tempPosts);
    };
    fetchShopPosts();
  }, []);

  const handleSearchShop = (data) => {
    console.log(data);
  };

  const handleAddShop = (formData) => {
    // Add logic to save the form data to your database or state
    console.log(formData);
    const docRef = addDoc(collection(db, "shop"), formData);
    // For example, you can update the discoverPosts state with the new data
    setShopPosts([...shopPosts, formData]);
    addShop.onClose(); // Close the modal after submitting
    toast({
      title: "Post Created.",
      description: "Post successfully published.",
      status: "success",
      duration: 5000,
      position: "top",
    });
  };
  // const product = [
  //   {
  //     id: 1,
  //     product_name: "Fish",
  //     name: "John Doe",
  //     description:
  //       "Irure tempor labore excepteur adipisicing et nisi quis velit. Elit occaecat voluptate minim occaecat aliqua ea irure excepteur et anim do minim sint. Culpa sunt voluptate veniam ea exercitation labore. Magna consequat culpa ullamco occaecat mollit qui quis duis voluptate mollit. Nulla dolor cillum ex exercitation sint nostrud.",
  //     price: 1000.0,
  //     tag: "accessories",
  //     createdAt: "2days ago",
  //   },
  //   {
  //     id: 2,
  //     product_name: "Fish",
  //     name: "John Doe",
  //     description:
  //       "Irure tempor labore excepteur adipisicing et nisi quis velit. Elit occaecat voluptate minim occaecat aliqua ea irure excepteur et anim do minim sint. Culpa sunt voluptate veniam ea exercitation labore. Magna consequat culpa ullamco occaecat mollit qui quis duis voluptate mollit. Nulla dolor cillum ex exercitation sint nostrud.",
  //     price: 1000.0,
  //     tag: "fish",
  //     createdAt: "2days ago",
  //   },
  //   {
  //     id: 3,
  //     product_name: "Fish",
  //     name: "John Doe",
  //     description:
  //       "Irure tempor labore excepteur adipisicing et nisi quis velit. Elit occaecat voluptate minim occaecat aliqua ea irure excepteur et anim do minim sint. Culpa sunt voluptate veniam ea exercitation labore. Magna consequat culpa ullamco occaecat mollit qui quis duis voluptate mollit. Nulla dolor cillum ex exercitation sint nostrud.",
  //     price: 1000.0,
  //     tag: "feeds",
  //     createdAt: "2days ago",
  //   },
  //   {
  //     id: 4,
  //     product_name: "Fish",
  //     name: "John Doe",
  //     description:
  //       "Irure tempor labore excepteur adipisicing et nisi quis velit. Elit occaecat voluptate minim occaecat aliqua ea irure excepteur et anim do minim sint. Culpa sunt voluptate veniam ea exercitation labore. Magna consequat culpa ullamco occaecat mollit qui quis duis voluptate mollit. Nulla dolor cillum ex exercitation sint nostrud.",
  //     price: 1000.0,
  //     tag: "aquarium",
  //     createdAt: "2days ago",
  //   },
  // ];
  return (
    <>
      <Box>
        <Navigation />
        <Flex justify="space-between" p="0 86px 0 64px">
          <Heading fontFamily={primaryFont}>Shop</Heading>
          <Flex display={user ? "flex" : "none"} justify="space-between">
            <Button
              mr="12px"
              variant="ghost"
              leftIcon={<Plus size={16} />}
              onClick={modalShop.onOpen}
            >
              <Create
                isOpen={modalShop.isOpen}
                onClose={modalShop.onClose}
              />
              Create
            </Button>
            <Modal>
              <ModalOverlay />
              <ModalContent>
                <ModalBody>Link to create listing</ModalBody>
              </ModalContent>
            </Modal>
            <Button variant="ghost" color="#333333">
              My Shop
            </Button>
          </Flex>
        </Flex>
        <Box className="shopContentWrapper">
          <Box>
            <SearchInput />
          </Box>
          <Flex
            gap="24px 12px"
            flexWrap="wrap"
            justify="space-evenly"
            align="center"
            mt="64px"
          >
            
            {shopPosts &&
              shopPosts.map((post) => (
                <>
                  <Card key={post.id} w="600px" h="360px">
                    <CardHeader>
                      <Flex justify="space-between">
                        <Button variant="link" color="#333333">
                          {post.authorName}
                        </Button>
                        <Text fontSize="xs" color={tertiaryColor} as="i">
                          {post.createdAt}
                        </Text>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Flex className="cardContent">
                        <Box className="imageWrapper">
                        <Image
                          objectFit="cover"
                          src={post.postImage}
                          alt="Post Image"
                        />
                        </Box>
                        <Box className="descriptionWrapper">
                          <Flex justify="space-between">
                            <Heading fontFamily={primaryFont}>
                              {post.postTitle}
                            </Heading>
                            <Text as="b">P{post.price}</Text>
                          </Flex>
                          <Text fontSize="xs" as="i" color={tertiaryColor}>
                            #{post.tag}
                          </Text>

                          <Text fontSize="sm" color={tertiaryColor}>
                            {post.postContent}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                    <Box m="0 16px 32px 24px">
                      <Button bg={primaryColor} w="100%">
                        View Product
                      </Button>
                    </Box>
                  </Card>
                </>
              ))}
          </Flex>
        </Box>
      </Box>
    </>
  );
};
export default Shop;
