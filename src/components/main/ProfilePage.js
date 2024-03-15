import "./ProfilePage.css";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  Box,
  Heading,
  useCardStyles,
  Card,
  Flex,
  Text,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  IconButton,
  Image,
  MenuGroup,
  MenuDivider,
  Button,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useEditableControls,
  Editable,
  Input,
  EditableInput,
  EditablePreview,
  ButtonGroup,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  ModalOverlay,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { db, auth, storage } from "../../firebase/firebaseConfig";
import { UserAuth } from "../context/AuthContext";
import { HamburgerIcon, SmallAddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  updateProfile,
  getAuth,
  getAdditionalUserInfo,
} from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import Profile from "./Profile";
import PostOptions from "./mainComponents/PostOptions";
import {
  Home,
  Compass,
  User,
  LogOut,
  Edit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Edit2,
} from "react-feather";
import Comment from "./mainComponents/Comment";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup>
      <IconButton icon={<Check />} {...getSubmitButtonProps()} />
      <IconButton icon={<X />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="sm" icon={<Edit />} {...getEditButtonProps()} />
    </Flex>
  );
}

function ProfilePage() {
  const { userId, userProfile } = useParams();
  // const { postId } = useParams();
  const { user } = UserAuth();
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [newPassword, setNewPassword] = useState();
  const [profileImage, setProfileImage] = useState();
  const [imageUrl, setImageUrl] = useState();

  const navigate = useNavigate();
  const changePass = useDisclosure();
  const clear = useRef();
  const toast = useToast();
  const alert = useDisclosure();
  const profile = useDisclosure();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  console.log(user);
  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  //check the location
  let getUrl = window.location.href;
  //take out every `/` to array
  let splitUrl = getUrl.split("/");

  const loadData = async () => {
    if (!userId) return; // Handle missing ID

    // const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    // const docSnap = query(docRef, where("userID", "==", splitUrl[4]));
    // const userDataVar = await getDocs(docSnap);
    // let testData = userDataVar.forEach((doc) => doc.id);
    // console.log(testData);

    const docRef = collection(db, "users1"); // Replace "db" with  Firestore instance
    const docSnap = query(docRef, where("userID", "==", userId));
    const userDataVar = await getDocs(docSnap);
    let tempArr = [];
    let testData = userDataVar.forEach((doc) => {
      tempArr.push(doc.data());
    });
    setUserData(...tempArr);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleChangePassword = async (data) => {
    console.log(data);

    if (user) {
      try {
        await updatePassword(user, data.changePassword).then(() => {
          toast({
            title: "Password Changed.",
            description: "Nice! Password is successfully changed.",
            status: "success",
            duration: 3000,
            position: "top",
          });
        });
      } catch (err) {
        toast({
          title: "Action can't be done.",
          description:
            "Sorry, there seems to be a problem with the action you're trying. Please try loggin in again and repeat the action.",
          status: "error",
          duration: 3000,
          position: "top",
        });
      }
    }
    reset();
  };
  useEffect(() => {
    const getUserPosts = async () => {
      const docRef = collection(db, "posts");
      const docSnap = query(docRef, where("authorId", "==", userId));
      const postDataVar = await getDocs(docSnap);

      let tempArr = [];

      let testData = postDataVar.forEach((doc) => {
        tempArr.push({ ...doc.data(), id: doc.id });
      });
      setPostData(tempArr);
    };
    getUserPosts();
  }, []);
  const handleProfileChange = async (e) => {
    setProfileImage(e.target.files[0]);
    const imageRef = ref(
      storage,
      `profileImages/${e.target.files[0].name + "&" + userData.name}`
    );
    try {
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
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleSubmitProfilePicture = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users1", userData.userID);

    try {
      await updateDoc(userRef, {
        profileImage: imageUrl,
      });
      await updateProfile(user, {
        photoURL: imageUrl,
      });
      toast({
        title: "Profile Updated!",
        description: "Profile picture is successfully updated.",
        status: "success",
        duration: 5000,
        position: "top",
      });
    } catch (err) {
      console.log(err.message);
    }
    window.location.reload();
  };
  console.log(postData);
  const handleGetId = () => {};

  const handleCancelUpload = () => {};
  return (
    <>
      <Box position="relative">
        {/* <Box
          zIndex="-2"
          bg="#ededed"
          h="100vh"
          w="100vw"
          position="absolute"
        ></Box> */}
        {userData && userData ? (
          <Box key={userData.id} zIndex="2">
            <Box>
              <Flex
                className="navbar"
                justify="space-between"
                px="32px"
                py="12px"
                boxShadow="1px 0px 12px #aeaeae"
                w="100vw"
                overflow="hidden"
                bg="#fff"
              >
                <Flex
                  justify="center"
                  align="center"
                  onClick={() => {
                    window.location.reload();
                  }}
                  cursor="pointer"
                >
                  <User size={32} />
                  <Heading ml="12px" size="xl">
                    Profile
                  </Heading>
                </Flex>

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
                        icon={<ShoppingCart size={16} />}
                      >
                        Buy/Sell
                      </MenuItem>
                      <Link to="/discover">
                        <MenuItem icon={<Compass size={16} />}>
                          Discover
                        </MenuItem>
                      </Link>

                      <MenuDivider />
                      <MenuGroup title="Account">
                        {/* <MenuItem
                          onClick={() => {
                            navigate(`/profile/${user.uid}`);
                          }}
                          icon={<User size={16} />}
                        >
                          Profile
                        </MenuItem> */}
                        <MenuItem
                          icon={<LogOut size={16} />}
                          onClick={alert.onOpen}
                        >
                          Logout
                          <AlertDialog
                            isOpen={alert.isOpen}
                            onClose={alert.onClose}
                          >
                            <AlertDialogOverlay />
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                Are you leaving?
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <Button
                                  onClick={handleSignOut}
                                  colorScheme="red"
                                  mr="6px"
                                >
                                  Yes
                                </Button>
                                <Button ml="6px" onClick={alert.onClose}>
                                  No
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
            </Box>

            {/* ... display other user's information */}
            <Flex
              pt="24px"
              align="center"
              justify="center"
              flexDirection="column"
            >
              <Flex w="100%">
                <Box>
                  <Flex
                    justify="center"
                    align="center"
                    h="150px"
                    w="150px"
                    ml="200px"
                    borderRadius="50%"
                    className="imageFlex"
                  >
                    <Box
                      className="imageHoverOption"
                      bg={userData.userID !== user.uid ? "none" : ""}
                      display={userData.userID !== user.uid ? "none" : ""}
                    >
                      <Button
                        color="#fff"
                        variant="none"
                        leftIcon={<Edit2 size={16} color="#fff" />}
                        onClick={profile.onOpen}
                        display={
                          userData.userID !== user.uid ? "none" : "block"
                        }
                      >
                        Edit
                        <Modal
                          size="xs"
                          isOpen={profile.isOpen}
                          onClose={profile.onClose}
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <form>
                              <ModalBody>
                                <Flex
                                  p="32px 24px"
                                  w="100%"
                                  justify="center"
                                  align="center"
                                  flexDirection="column"
                                >
                                  <InputGroup
                                    display="flex"
                                    justifyContent="center"
                                    alignContent="center"
                                  >
                                    <FormLabel
                                      htmlFor="file"
                                      ml="2px"
                                      cursor="pointer"
                                      className="addImageButton"
                                      p="4px 8px"
                                      borderRadius="4px"
                                      display={profileImage ? "none" : "flex"}
                                      alignItems="center"
                                    >
                                      <SmallAddIcon />
                                      Click to Add Photo
                                    </FormLabel>

                                    <Input
                                      type="file"
                                      name="file"
                                      id="file"
                                      accept=".jpg, .jpeg, .png"
                                      multiple
                                      hidden
                                      onChange={handleProfileChange}
                                    />
                                    {profileImage && profileImage ? (
                                      <Flex
                                        w="100%"
                                        justify="center"
                                        align="center"
                                        flexDirection="column"
                                      >
                                        {" "}
                                        <Text as="b">
                                          Image is ready for upload!
                                        </Text>
                                        <br />
                                        <br />
                                        <Box
                                          h="150px"
                                          w="150px"
                                          borderRadius="50%"
                                          overflow="hidden"
                                        >
                                          <Image w="100%" src={imageUrl} />
                                        </Box>
                                      </Flex>
                                    ) : (
                                      <></>
                                    )}
                                  </InputGroup>
                                  <Flex
                                    mt="32px"
                                    w="100%"
                                    justify="space-around"
                                    align="center"
                                  >
                                    <Button
                                      colorScheme="telegram"
                                      onClick={handleSubmitProfilePicture}
                                    >
                                      Upload
                                    </Button>
                                    <Button
                                      variant="none"
                                      onClick={() => {
                                        profile.onClose();
                                        setImageUrl("");
                                        setProfileImage("");
                                      }}
                                    >
                                      Close
                                    </Button>
                                  </Flex>
                                </Flex>
                              </ModalBody>
                            </form>
                          </ModalContent>
                        </Modal>
                      </Button>
                    </Box>
                    {userData.profileImage ? (
                      <Image
                        h="100%"
                        w="100%"
                        objectFit="cover"
                        className="profilePicture"
                        src={userData.profileImage}
                      />
                    ) : (
                      <Text>User Avatar</Text>
                    )}
                  </Flex>
                </Box>

                <Flex mx="100px" flexDirection="column">
                  {/* <Button onClick={handleGetId}>Function</Button> */}
                  <Box>
                    <Heading>{userData.name}</Heading>
                    <Text fontSize="sm">
                      <strong>UID: </strong>
                      {userData.userID}
                    </Text>
                    <Text color="#9c9c9c" fontSize="xs" as="i">
                      Member since {formatDistanceToNow(userData.dateCreated)}{" "}
                      ago
                    </Text>
                  </Box>

                  <br />

                  <Box>
                    <Text>
                      <strong>Location: </strong>
                      {userData.location}
                    </Text>
                    <Text>
                      <strong>Email: </strong>
                      {userData.email}
                    </Text>
                    <Text>
                      <strong>Phone Number: </strong>
                      {userData.phone}
                    </Text>
                  </Box>
                </Flex>
                <Box display={userData.userID !== user.uid ? "none" : ""}>
                  {/* <Button
                    onClick={() => {
                      editProfile.onOpen();
                    }}
                    variant="outline"
                  >
                    <Settings />
                  </Button> */}
                  <Menu>
                    {({ isOpen }) => (
                      <>
                        <MenuButton
                          isActive={isOpen}
                          as={IconButton}
                          variant="outline"
                          icon={isOpen ? <ChevronUp /> : <ChevronDown />}
                          bg="#fff"
                        ></MenuButton>
                        <MenuList>
                          {/* <MenuItem>Edit</MenuItem> */}
                          <MenuItem onClick={changePass.onOpen}>
                            Change Password
                          </MenuItem>
                          <Modal
                            className="modalPassword"
                            isOpen={changePass.isOpen}
                            isClose={changePass.isClose}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Change Password</ModalHeader>
                              <form
                                onSubmit={handleSubmit(handleChangePassword)}
                              >
                                <ModalBody>
                                  {/* <Input
                                    type="password"
                                    placeholder="Enter old password"
                                    {...register("currentPassword", {
                                      required: true,
                                      minLength: {
                                        value: 6,
                                        message:
                                          "Password must be at least 6 characters.",
                                      },
                                    })}
                                    aria-invalid={
                                      errors.currentPassword ? " true" : "false"
                                    }
                                    id="currentPassword"
                                  />
                                  {errors.currentPassword?.type ===
                                    "required" && (
                                    <p
                                      style={{
                                        color: "#d9534f",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Confirm Password is required
                                    </p>
                                  )} */}
                                  <Input
                                    mt="12px"
                                    type="password"
                                    placeholder="Enter new password"
                                    {...register("changePassword", {
                                      required: true,
                                      minLength: {
                                        value: 6,
                                        message:
                                          "Password must be at least 6 characters.",
                                      },
                                    })}
                                    aria-invalid={
                                      errors.changePassword ? "true" : "false"
                                    }
                                    id="changePassword"

                                    // onChange={(e) => {
                                    //   setNewPassword(e.target.value);
                                    // }}
                                    // ref={clear}
                                  />
                                  {errors.changePassword?.type ===
                                    "required" && (
                                    <p
                                      style={{
                                        color: "#d9534f",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Confirm Password is required
                                    </p>
                                  )}
                                  <Input
                                    mt="12px"
                                    type="password"
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword", {
                                      required: true,
                                      minLength: {
                                        value: 6,
                                        message:
                                          "Password must be at least 6 characters.",
                                      },
                                      validate: (val) => {
                                        if (watch("changePassword") !== val) {
                                          return "Password do not match!";
                                        }
                                      },
                                    })}
                                    aria-invalid={
                                      errors.confirmPassword ? "true" : "false"
                                    }
                                    id="confirmPassword"

                                    // onChange={(e) => {
                                    //   setNewPassword(e.target.value);
                                    // }}
                                    // ref={clear}
                                  />
                                  {errors.confirmPassword?.type ===
                                    "required" && (
                                    <p
                                      style={{
                                        color: "#d9534f",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Confirm Password is required
                                    </p>
                                  )}
                                  {errors?.confirmPassword && (
                                    <p
                                      style={{
                                        color: "#d9534f",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {errors.confirmPassword.message}
                                    </p>
                                  )}

                                  <Flex justify="end" align="center" w="100%">
                                    <Button
                                      type="submit"
                                      colorScheme="telegram"
                                      mt="12px"
                                    >
                                      Change
                                    </Button>
                                    <Button
                                      onClick={changePass.onClose}
                                      mt="12px"
                                    >
                                      Cancel
                                    </Button>
                                  </Flex>
                                </ModalBody>
                              </form>
                            </ModalContent>
                          </Modal>
                        </MenuList>
                      </>
                    )}
                  </Menu>

                  {/* <Modal
                    isOpen={editProfile.isOpen}
                    onClose={editProfile.onClose}
                  >
                    <ModalHeader>Profile</ModalHeader>
                    <ModalContent>
                      <ModalBody>
                        <form>
                          <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Editable defaultValue={userData.name}>
                              <EditablePreview />
                              <Input as={EditableInput} />
                            </Editable>
                            <FormLabel>Location</FormLabel>
                            <Editable defaultValue={userData.location}>
                              <EditablePreview />
                              <Input as={EditableInput} />
                            </Editable>
                            <FormLabel>Email</FormLabel>
                            <Editable defaultValue={userData.email}>
                              <EditablePreview />
                              <Input as={EditableInput} />
                            </Editable>
                            <FormLabel>Phone Number</FormLabel>
                            <Editable defaultValue={userData.phone}>
                              <EditablePreview />
                              <Input as={EditableInput} />
                              <EditableControls />
                            </Editable>
                          </FormControl>
                        </form>
                      </ModalBody>
                      <ModalFooter>
                        <Button onClick={editProfile.onClose}>Close</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal> */}
                </Box>
              </Flex>

              <Flex
                w="100%"
                justify="center"
                align="center"
                flexDirection="column"
                boxShadow="0px -4px 5px #e1e1e1"
                mt="32px"
                pt="24px"
                // maxHeight="calc(100vh - 320px)"
                // overflowY="auto"
              >
                {postData && postData.length === 0 ? (
                  <Flex justify="center" align="center">
                    <Text color="#7f7f7f">It feels so lonely here...</Text>
                  </Flex>
                ) : (
                  <Flex
                    flexDirection="column"
                    w="100%"
                    align="center"
                    justify="center"
                  >
                    {postData &&
                      postData.map((post) => (
                        <Card
                          key={post.id}
                          w="50%"
                          p="24px 24px"
                          my="16px"
                          border="1px solid #e1e1e1"
                        >
                          <Flex flexDirection="column">
                            <Box>
                              <Profile
                                name={post.name}
                                authorId={post.authorId}
                              />
                            </Box>
                            <PostOptions
                              postId={post.id}
                              authorId={post.authorId}
                            />
                            <Text as="kbd" fontSize="10px" color="gray.500">
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
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </Flex>
                            <Box w="100%">
                              <Comment
                                postID={post.id}
                                authorId={post.authorId}
                              />
                            </Box>
                          </Flex>
                        </Card>
                      ))}
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Box>
        ) : (
          <Flex w="100%" h="100vh" align="center" justify="center">
            <span className="loader"></span>
          </Flex>
        )}
      </Box>
    </>
  );
}

export default ProfilePage;
