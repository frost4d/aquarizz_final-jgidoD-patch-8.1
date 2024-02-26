import {
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  Text,
  Input,
  FormLabel,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../../../firebase/firebaseConfig";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { UserAuth } from "../../context/AuthContext";

const LoginModal = (props) => {
  const { signIn, user, userProfile } = UserAuth();

  const navigate = useNavigate();
  const loginModal = useDisclosure();
  const primaryColor = "#FFC947";

  const {
    register: login,
    handleSubmit: loginSubmit,
    formState: { errors2 },
    reset: resetLogin,
  } = useForm();
  const handleLogin = async (data) => {
    console.log(data);
    try {
      await signIn(data.email, data.password);
      // handleSessionStorage();

      navigate("/shop");
    } catch (err) {
      console.log(err.message);
    }
    resetLogin();
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Login</ModalHeader>
          <ModalBody>
            <form onSubmit={loginSubmit(handleLogin)}>
              <FormLabel>
                <Text>Email</Text>
                <Input
                  type="email"
                  {...login("email", {
                    required: true,
                  })}
                  aria-invalid={errors2?.email ? "true" : "false"}
                />
              </FormLabel>
              <FormLabel>
                <Text>Password</Text>
                <Input
                  type="password"
                  {...login("password", {
                    required: true,
                  })}
                  aria-invalid={errors2?.password ? "true" : "false"}
                />
              </FormLabel>
              <FormLabel>
                <Button w="100%" type="submit" bg={primaryColor}>
                  Login
                </Button>
              </FormLabel>
            </form>
            <Box></Box>
          </ModalBody>
          <ModalFooter>
            <Text fontSize="sm">Not a member?</Text>
            <Link to="/register">
              <Button variant="ghost" ml="12px">
                Register
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default LoginModal;
