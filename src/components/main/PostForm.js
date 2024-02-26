import "./PostForm.css";
import {
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { UserAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { CheckCircleIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const PostForm = (props) => {
  const { createPost, user, userProfile } = UserAuth();
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
      postContent: data.content,
      authorId: user?.uid,
      name: userProfile.name,
      datePosted: Date.now(),
      createdAt: serverTimestamp(),
      price: data.price,
      postTitle: data.title,
      postImg: file ? imageUrl : "",
      profileImage: userProfile?.profileImage
        ? userProfile.profileImage
        : user.photoURL,
    };
    try {
      await createPost(obj);
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
  };

  return (
    <>
      <Card
        borderRadius="0"
        boxShadow="none"
        w="100%"
        variant="elevated"
        mb="12px"
        border="1px solid #e1e1e1"
      >
        <form
          className="postForm"
          style={{ width: "100%", padding: "8px  16px" }}
          onSubmit={handleSubmit(handleSubmitPost)}
        >
          <FormControl display="flex" justifyContent="space-between" my="8px">
            <Input
              bg="#fff"
              placeholder="Post Title"
              mr="8px"
              {...register("title", { required: true })}
              aria-invalid={errors.title ? "true" : "false"}
              type="text"
              id="postTitle"
            />
            <Input
              bg="#fff"
              placeholder="Price"
              ml="8px"
              {...register("price", { required: true })}
              aria-invalid={errors.price ? "true" : "false"}
              type="number"
              id="price"
            />
          </FormControl>
          <FormControl my="8px">
            <Textarea
              bg="#fff"
              placeholder="Tell us what you're looking for."
              {...register("content", { required: true })}
              aria-invalid={errors.content ? "true" : "false"}
              id="content"
            />
          </FormControl>
          <Flex justify="space-between" align="center">
            <InputGroup>
              <Input
                type="file"
                name="file"
                id="file"
                accept=".jpg, .jpeg, .png"
                multiple
                hidden
                onChange={handleImageChange}
              />
              <FormLabel
                htmlFor="file"
                ml="2px"
                cursor="pointer"
                className="addImageButton"
                p="2px 0 2px 4px"
                borderRadius="4px"
                display="flex"
                alignItems="center"
              >
                <FontAwesomeIcon icon={faImage} />
                <SmallAddIcon />
                {file && (
                  <Text ml="12px">
                    {file.type} <CheckCircleIcon color="#5cb85c" />
                  </Text>
                )}
              </FormLabel>
            </InputGroup>

            <Button
              colorScheme="telegram"
              type="submit"
              onClick={props.fetchData}
            >
              Post
            </Button>
          </Flex>
        </form>
      </Card>
    </>
  );
};
export default PostForm;
