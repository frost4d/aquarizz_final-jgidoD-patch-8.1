import { Image } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { useEffect } from "react";

const ProfilePicturePost = (props) => {
  const getPhotoURL = async () => {
    try {
      await getAuth()
        .getUser(props.authorID)
        .then((user) => {
          console.log(user);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getPhotoURL();
  }, []);
  return (
    <>
      <Image />
    </>
  );
};
export default ProfilePicturePost;
