import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LandingPage from "./components/LandingPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/main/Dashboard";
import Register from "./components/Register";
import { AuthContextProvider } from "./components/context/AuthContext";
import ProtectedRoutes from "./components/protectedRouting/ProtectedRoutes";
import ProfilePage from "./components/main/ProfilePage";
import PostPage from "./components/main/PostPage.js";
import Explore from "./components/Explore.js";
import FishLibrary from "./components/main/FishLibrary.js";
import About from "./components/main/About.js";
import MarketPage from "./components/main/revisionmain/LandingPageMarket";
import Login from "./components/main/revisionmain/Login.js";
import Create from "./components/main/revisionmain/listing/Create.js";
import Discover from "./components/main/revisionmain/Discover.js";
import Shop from "./components/main/revisionmain/Shop.js";
function App() {
  return (
    <>
      <AuthContextProvider>
        <ChakraProvider>
          <Routes>
            <Route path="/" element={<MarketPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createListing" element={<Create />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/shop" element={<Shop />} />

            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />

            {/* <Route
              path="/discover"
              element={
                <ProtectedRoutes>
                  <FishLibrary />
                </ProtectedRoutes>
              }
            /> */}
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile/:userId/post/:postId"
              element={
                <ProtectedRoutes>
                  <PostPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoutes>
                  <About />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
