import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  useDisclosure,
  Alert,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import ShareModal from "./postOptionsComponents/ShareModal";
import { useLocation, useNavigate } from "react-router-dom";
import GooglePay from "./GooglePay";
const PostOptions = (props) => {
  const { user } = UserAuth();
  const location = useLocation();
  const { pathname } = location;
  const postId = props.postId;
  const authorId = props.authorId;
  const deleteOverlay = useDisclosure();
  const shareModal = useDisclosure();
  const promoteModal = useDisclosure();
  const cancelRef = useRef();
  // const [postContent, setPostContent] = useState();
  const toast = useToast();
  const [copied, setCopied] = useState();
  const [postHref, setPostHref] = useState();

  const navigate = useNavigate();

  // const getPost = async () => {
  //   const colRef = collection(db, "posts", postId);
  //   const docSnap = await getDoc(colRef);
  //   console.log(docSnap);
  // };
  const handleDelete = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      // const commentRef = collection(postRef, "comments");
      await deleteDoc(postRef);
      props.fetchData();
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleCopyLink = () => {
    //will get the link of the current post
    const getLink = `profile/${authorId}/post/${postId}`;
    const url = window.location.href;
    const splitUrl = url.split("/");
    const modifiedUrl = splitUrl.slice(0, -1).join("/");
    // console.log();

    navigator.clipboard
      .writeText(`${modifiedUrl}/${getLink}`)
      .then(() => {
        // setCopied(true);
        // // Optionally, display a success message or feedback
        // setTimeout(() => {
        //   setCopied(false);
        // }, 2000); // Hide feedback after 2 seconds
        toast({
          title: "Text Copied.",
          description: "Yay! You can now share your post.",
          status: "info",
          duration: 3000,
          position: "top",
        });
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        // Handle copy errors gracefully (e.g., display an error message)
      });
    console.log(`${modifiedUrl}/${getLink}`);
  };
  const handleShareButton = () => {
    shareModal.onOpen();
  };
  return (
    <>
      <Menu>
        <MenuButton
          style={{
            position: "absolute",
            top: "15px",
            right: "25px",
          }}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </MenuButton>
        <MenuList>
          <MenuItem
            isDisabled={authorId !== user.uid}
            onClick={promoteModal.onOpen}
          >
            Promote
            <Modal isOpen={promoteModal.isOpen} onClose={promoteModal.onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />

                <ModalHeader>Promote your post!</ModalHeader>
                <ModalBody>
                  <Text mb="24px">
                    Subscribe to let people know about what you are
                    selling/buying.
                  </Text>

                  <Flex justify="center" align="center">
                    <GooglePay />
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteOverlay.onOpen();
            }}
            isDisabled={authorId !== user.uid}
          >
            Delete
          </MenuItem>
          <MenuItem onClick={handleShareButton}>
            Share
            {/* modal for sharePost */}
            <Modal isOpen={shareModal.isOpen} onClose={shareModal.onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Share your post.</ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>

                <ModalFooter>
                  <Button onClick={handleCopyLink} w="100%">
                    Copy Link
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </MenuItem>
        </MenuList>
      </Menu>
      <AlertDialog
        isOpen={deleteOverlay.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteOverlay.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteOverlay.onClose();
                  handleDelete();
                }}
                ml={3}
              >
                Delete
              </Button>
              <Button ref={cancelRef} onClick={deleteOverlay.onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PostOptions;
