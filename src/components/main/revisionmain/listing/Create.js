
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Input,
  Button,
  FormControl,
  Card,
  Textarea,
  useToast,
  Box,
  Flex,
  InputGroup,
  FormLabel,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../../context/AuthContext";
import { db, storage } from "../../../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore"; 
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const Create = (props) => {
  const { createPost, user, userProfile } = UserAuth();
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const secondaryFont = '"Montserrat", sans-serif';
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
    // const [userProfile, setUserProfile] = useState();
    const [file, setFile] = useState();
    const [imageUrl, setImageUrl] = useState();
  
    const handleImageChange = async (e) => {
      setFile(e.target.files[0]);
  
      const imageRef = ref(
        storage,
        `postImages/${e.target.files[0].name + "&" + userProfile.name}`
      );
      await uploadBytes(imageRef, e.target.files[0]).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log(snapshot);
      });
      getDownloadURL(imageRef).then((url) => {
        console.log(url);
        if (url === null) {
          console.log("error");
        }
        setImageUrl(url);
      });
      console.log(file);
    };
  
    const handleSubmitPost = async (data) => {
      const obj = {
        authorName: userProfile.name,
        authorID: user?.uid,
        postTitle: data.title,
        postContent: data.text,
        postImage: file ? imageUrl : "", // Optional chaining to avoid null value
        tag: data.tag,
        createdAt: data.createdAt || new Date().toISOString(),
        price: data.price,
      };
      try {
        await addDoc(collection(db, 'shop'), obj);
        // await createPost(obj);
        toast({
          title: "Post Created.",
          description: "Post successfully published.",
          status: "success",
          duration: 5000,
          position: "top",
        });
      } catch (err) {
        console.log(err.message);
      }
      console.log(obj);
      setFile("");
      setImageUrl("");
      reset();
      props.onClose();
    };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <form onSubmit={handleSubmit(handleSubmitPost)}>
              <Box textAlign="center" my="24px">
                <Heading fontSize="md">Add Product</Heading>
              </Box>
              <Flex
                className="addDiscoverForm"
                flexDirection="column"
                justify="center"
              >
                <Box mb={4}>
                  <FormLabel>Product Name</FormLabel>
                  <Input {...register("title", { required: true })} />
                  {errors.title && <Text color="red">Title is required</Text>}
                </Box>

                <Box>
                <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Text"
                    {...register("text", { required: true })}
                    aria-invalid={errors.text ? "true" : "false"}
                  />
                  {errors.text?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      Text is required
                    </p>
                  )}
                </Box>
                <Box p="12px 0">
                  <Input
                    className="inputFileDiscover"
                    type="file"
                    name="file"
                    id="file"
                    accept=".jpg, .jpeg, .png"
                    class="inputfile"
                    multiple
                    onChange={handleImageChange}
                    
                  />
                </Box>
                <Box>
                  <Input
                    placeholder="e.g. #tag"
                    {...register("tag", { required: true })}
                    aria-invalid={errors.tag ? "true" : "false"}
                  />
                  {errors.tag?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      Tag is required
                    </p>
                  )}
                </Box>
                <Box>
                  <Input
                    placeholder="Price"
                    {...register("price", { required: true })}
                    aria-invalid={errors.tag ? "true" : "false"}
                  />
                  {errors.tag?.type === "required" && (
                    <p style={{ color: "#d9534f", fontSize: "12px" }}>
                      price is required
                    </p>
                  )}
                </Box>

                <Button type="submit" bg={primaryColor} onClick={props.fetchData}>
                  Publish
                </Button>
                <Button onClick={props.onClose}>Cancel</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Create;
