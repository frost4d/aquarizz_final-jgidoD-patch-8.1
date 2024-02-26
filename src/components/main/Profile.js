import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";

const Profile = (props) => {
  const name = props.name;
  const uid = props.authorId; //get authorID from postCard
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${uid}`);
  };
  return (
    <Button variant="link" color="#000" size="md" onClick={handleClick}>
      {name}
    </Button>
  );
};
export default Profile;
