import "./AddDiscoverModal.css";
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
// import { UserAuth } from "../context/AuthContext";
import { UserAuth } from "../../context/AuthContext"; 
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, doc, getDoc } from "firebase/firestore";
// import { db, storage } from "../../firebase/firebaseConfig";
import { db, storage } from "../../../firebase/firebaseConfig";
import { collection, addDoc, docRef } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { CheckCircleIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const AddDiscover = (props) => {
  const primaryColor = "#FFC947";
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
      // `postImages/${e.target.files[0].name + "&" + userProfile.name}`
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
    };
    try {
      await addDoc(collection(db, 'discover'), obj);
      // await createPost(obj);
      toast({
        title: "Post Created.",
        description: "Post successfully published.",
        status: "success",
        duration: 5000,
        position: "top",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
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
                <Heading fontSize="md">Let others know what you have!</Heading>
              </Box>
              <Flex
                className="addDiscoverForm"
                flexDirection="column"
                justify="center"
              >
                <Box mb={4}>
                  <FormLabel>Title</FormLabel>
                  <Input {...register("title", { required: true })} />
                  {errors.title && <Text color="red">Title is required</Text>}
                </Box>

                <Box>
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
export default AddDiscover;



// import "./AddDiscoverModal.css";
// import { useState, useEffect } from "react";
// import { db } from "../../../firebase/firebaseConfig";
// import {
//   collection,
//   getDocs,
//   doc,
//   query,
//   where,
//   updateDoc,
// } from "firebase/firestore";
// import {
//   FormLabel,
//   InputGroup,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalOverlay,
//   Input,
//   Text,
//   Flex,
//   Heading,
//   Box,
//   Textarea,
//   Button,
// } from "@chakra-ui/react";
// import { useForm } from "react-hook-form";

// const AddDiscoverModal = (props) => {
//   const primaryColor = "#FFC947";
//   const [formData, setFormData] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const {
//     register,
//     reset,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const handleSubmitPost = async (data) => {

//     const postData = {
//       authorName: data.authorName,
//       authorID: data.authorID,
//       postTitle: data.title,
//       postContent: data.text,
//       postImage: data.postImage || "", // Optional chaining to avoid null value
//       tag: data.tag,
//       createdAt: data.createdAt || new Date().toISOString(), // Use current date if not provided
//     };
    
//     try {
//       await db.collection("discover").add(postData);
//       setFormData(postData);
//       setSubmitted(true);
//       reset(); // Reset the form fields
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   useEffect(() => {
//     if (submitted) {
//       // Reset the form fields when the form is submitted
//       reset();
//     }
//   }, [submitted, reset]);

//   return (
//     <>
//       <Modal isOpen={props.isOpen} onClose={props.onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalBody>
//             <form onSubmit={handleSubmit(handleSubmitPost)}>
//               <Box textAlign="center" my="24px">
//                 <Heading fontSize="md">Let others know what you have!</Heading>
//               </Box>
//               <Flex
//                 className="addDiscoverForm"
//                 flexDirection="column"
//                 justify="center"
//               >
//                 <Box mb={4}>
//                   <FormLabel>Title</FormLabel>
//                   <Input {...register("title", { required: true })} />
//                   {errors.title && <Text color="red">Title is required</Text>}
//                 </Box>

//                 <Box>
//                   <Textarea
//                     placeholder="Text"
//                     {...register("text", { required: true })}
//                     aria-invalid={errors.text ? "true" : "false"}
//                   />
//                   {errors.text?.type === "required" && (
//                     <p style={{ color: "#d9534f", fontSize: "12px" }}>
//                       Text is required
//                     </p>
//                   )}
//                 </Box>
//                 <Box p="12px 0">
//                   <Input
//                     className="inputFileDiscover"
//                     type="file"
//                     name="file"
//                     id="file"
//                     class="inputfile"
//                     multiple
//                   />
//                 </Box>
//                 <Box>
//                   <Input
//                     placeholder="e.g. #tag"
//                     {...register("tag", { required: true })}
//                     aria-invalid={errors.tag ? "true" : "false"}
//                   />
//                   {errors.tag?.type === "required" && (
//                     <p style={{ color: "#d9534f", fontSize: "12px" }}>
//                       Tag is required
//                     </p>
//                   )}
//                 </Box>

//                 <Button type="submit" bg={primaryColor}>
//                   Publish
//                 </Button>
//                 <Button onClick={props.onClose}>Cancel</Button>
//               </Flex>
//             </form>
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//       {submitted && (
//         <Modal isOpen={submitted} onClose={() => setSubmitted(false)}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalBody>
//               <Box textAlign="center" my="24px">
//                 <Heading fontSize="md">Form Data</Heading>
//               </Box>
//               <Flex className="addDiscoverForm" flexDirection="column" justify="center">
//                 <Box>
//                   <Text>{JSON.stringify(formData, null, 2)}</Text>
//                 </Box>
//                 <Button onClick={() => setSubmitted(false)}>Close</Button>
//               </Flex>
//             </ModalBody>
//           </ModalContent>
//         </Modal>
//       )}
//     </>
//   );
// };
// export default AddDiscoverModal;
