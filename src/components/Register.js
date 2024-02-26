import "./Register.css";
import {
  Box,
  Flex,
  FormControl,
  Input,
  FormLabel,
  Button,
  Text,
  Heading,
  Stack,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { calcLength } from "framer-motion";

const Register = () => {
  const { createUser } = UserAuth();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    try {
      const { user } = await createUser(data.email, data.password);

      toast({
        position: "top",
        status: "success",
        title: "You are now registered!.",
        description: "Your account is successfully created.",
        duration: 4000,
      });
      await setDoc(doc(db, "users1", user.uid), {
        email: data.email,
        name: data.name,
        password: data.password,
        userID: user.uid,
        dateCreated: Date.now(),
        createdAt: serverTimestamp(),
        location: data.location,
        phoneNumber: data.phoneNumber,
      });
      navigate("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          return toast({
            position: "top",
            status: "error",
            title: "Can't create account.",
            description: "Sorry, email is already in use.",
            duration: 4000,
          });
      }
    }

    // .then( (userCredentials) => {

    //   toast({
    //     title: "Account Created.",
    //     description: "Welcome to Aquarizz!",
    //     status: "success",
    //     duration: 4000,
    //     position: "top"
    //   });

    // }).catch((error) => {
    //   switch (error.code) {
    //     case "auth/email-already-in-use":
    //       toast({
    //         position: "top",
    //         title: "Can't create account.",
    //         description: "Sorry, email is already in use.",
    //         status: "error",
    //         duration: 4000,
    //         position: "top"

    //       });
    //       break;
    //   }
    // });

    reset();
  };

  return (
    <>
      <Box h="100vh" w="100vw">
        <Flex align="center" justify="center" h="100%" w="100%">
          <Flex
            flexDirection="column"
            border="1px solid #e1e1e1"
            w="30em"
            p="16px 32px"
          >
            <Heading size="md" mb="12px">
              Register
            </Heading>
            <form
              className="registerForm"
              onSubmit={handleSubmit(handleRegister)}
            >
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: true,
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Email is required
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Name(You can use any name)</FormLabel>
                <Input
                  type="text"
                  {...register("name", {
                    required: true,
                  })}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Name is required
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  {...register("location", {
                    required: true,
                  })}
                  aria-invalid={errors.location ? "true" : "false"}
                />
                {errors.location?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Location is required
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Stack>
                  <InputGroup>
                    <InputLeftAddon children="+63" />
                    <Input
                      {...register("phoneNumber", {
                        required: true,
                        minLength: {
                          value: 10,
                          message: "Please input correct phone number.",
                        },
                        maxLength: {
                          value: 10,
                          message: "Please input correct phone number.",
                        },
                      })}
                      aria-invalid={errors.phoneNumber ? "true" : "false"}
                    />
                  </InputGroup>
                </Stack>
                {errors.phoneNumber?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Phone Number is required
                  </p>
                )}
                {errors.phoneNumber && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    {errors.phoneNumber.message}
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Password is required
                  </p>
                )}
                {errors.password && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    {errors.password.message}
                  </p>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Password do not match!";
                      }
                    },
                  })}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword?.type === "required" && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    Confirm Password is required
                  </p>
                )}
                {errors?.confirmPassword && (
                  <p style={{ color: "#d9534f", fontSize: "12px" }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </FormControl>
              <Button bg="#ffc947" w="100%" type="submit">
                Register
              </Button>
            </form>
            <Box mt="12px" w="100%">
              <Text>Already a member?</Text>
              <Link to="/">
                <Button variant="ghost" w="100%">
                  Login
                </Button>
              </Link>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
export default Register;
