import {
  createContext,
  useContext,
  useEffect,
  useState,
  serverTimestamp,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  orderBy,
  getDocs,
  query,
} from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [userProfile, setUserProfile] = useState();
  const [posts, setPosts] = useState();

  const createUser = (email, password) => {
    const create = createUserWithEmailAndPassword(auth, email, password);
    return create;
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const createPost = (postData) => {
    const collectionRef = collection(db, "posts");
    return addDoc(collectionRef, { ...postData });
  };

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(
      query(collectionRef, orderBy("createdAt", "desc"))
    );
    let tempVar = [];
    querySnapshot.forEach((doc) => {
      tempVar.push(doc.data());
      setPosts(tempVar);
    });
    // console.log(posts);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const data = [];

      try {
        if (!user) {
          // Handle the case when user is not defined
          console.log("can't get user");
          return;
        }
        const docRef = doc(db, "users1", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserProfile((userProfile) => {
            return { ...userProfile, ...docSnap.data() };
          });
        }
      } catch (err) {
        // console.log(err.message);
      }
    };
    getUserProfile();
    getPosts();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        createUser,
        user,
        logout,
        signIn,
        createPost,
        userProfile,
        posts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
