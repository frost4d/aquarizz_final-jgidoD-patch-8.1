import "./Navigation.css";
import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  Input,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  FormLabel,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import {
  User,
  Edit,
  Search,
  MapPin,
  Compass,
  ShoppingBag,
  ArrowRight,
  Facebook,
  Mail,
  Twitter,
} from "react-feather";
import LoginModal from "./LoginModal";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import logo from "../../../assets/logo2.png";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

const Navigation = () => {
  const loginModal = useDisclosure();
  const primaryColor = "#FFC947";
  const primaryFont = '"Poppins", sans-serif';
  const secondaryFont = '"Montserrat", sans-serif';
  const navigate = useNavigate();
  const { user, userProfile } = UserAuth();

  const handleLogout = async () => {
    if (!user) return;
    try {
      signOut(auth);
    } catch (err) {
      console.log(err.message);
    } finally {
      window.location.reload();
    }
  };
  return (
    <>
      <Box>
        <Flex as="nav" align="center" justify="space-between" p="32px 64px">
          <Box
            className="logoWrapper"
            onClick={() => {
              window.location.reload();
            }}
            cursor="pointer"
          >
            <Image src={logo} />
          </Box>
          <Flex className="navbarButtons" justify="end" align="center" w="100%">
            <NavLink
              className={({ isActive }) =>
                isActive ? "navlink_isActive" : "navlink_inactive"
              }
              to="/shop"
            >
              <Button
                borderRadius="0"
                // variant="ghost"
                color="#000"
                rightIcon={<ShoppingBag size={16} />}
                // _hover={{ bg: "rgba(249,249,249,1)" }}
                // onClick={() => navigate("/shop")}
              >
                Shop
              </Button>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "navlink_isActive" : "navlink_inactive"
              }
              to="/discover"
            >
              <Button
                borderRadius="0"
                // variant="ghost"
                color="#000"
                rightIcon={<Compass size={16} />}
                // _hover={{
                //   bg: "rgba(249,249,249,1)",
                // }}
                // onClick={() => navigate("/discover")}
              >
                Discover
              </Button>
            </NavLink>
            {userProfile ? (
              <>
                <Menu>
                  <MenuButton>{userProfile.email}</MenuButton>
                  <MenuList>
                    <MenuGroup title="Profile">
                      <MenuItem>My Account</MenuItem>
                      <MenuItem>My Shop</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Support">
                      <MenuItem>Contact Us</MenuItem>
                      <MenuItem>FAQs</MenuItem>
                      <MenuItem>Return & Exchanges</MenuItem>
                      <MenuItem>Privacy Policy</MenuItem>
                      <MenuItem>Terms of Service</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Button
                variant="ghost"
                color="#000"
                rightIcon={<User size={16} />}
                _hover={{ bg: "rgba(255,255,255,.3)" }}
                onClick={loginModal.onOpen}
              >
                <LoginModal
                  isOpen={loginModal.isOpen}
                  onClose={loginModal.onClose}
                />
                Login
              </Button>
            )}
            <Button
              bg={primaryColor}
              color="#000"
              rightIcon={<Edit size={16} />}
              _hover={{ bg: "#ffd36b" }}
              onClick={() => {
                user ? (
                  navigate("/shop")
                ) : (
                  <>
                    {loginModal.onOpen()}
                    <LoginModal
                      isOpen={loginModal.isOpen}
                      onClose={loginModal.onClose}
                    />
                  </>
                );
              }}
            >
              Create listing
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
export default Navigation;
