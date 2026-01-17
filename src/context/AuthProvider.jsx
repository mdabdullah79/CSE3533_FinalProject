// src/context/AuthProvider.jsx - FIXED: No duplicate toasts
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth, googleProvider } from "../firebase";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [token, setToken] = useState(null);

  // Toast already shown check করার জন্য
  const welcomeToastShownRef = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);

          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/sync`,
            {
              email: user.email,
              name: user.displayName || user.email.split('@')[0]
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            }
          );

          setRole(res.data.role);

          if (!isInitialMount.current && !welcomeToastShownRef.current) {
            // Welcome message only manual login/signup
          }

        } catch (error) {
          // console.error("Role sync error:", error);
        }

        setCurrentUser(user);
        setPhotoURL(user.photoURL || null);
        setDisplayName(user.displayName || null);

        localStorage.setItem('authToken', token);
      } else {
        setCurrentUser(null);
        setRole("user");
        setPhotoURL(null);
        setDisplayName(null);
        setToken(null);
        welcomeToastShownRef.current = false;
        localStorage.removeItem('authToken');
      }

      if (isInitialMount.current) {
        isInitialMount.current = false;
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss(toastId);

      const user = userCredential.user;
      toast.success(`Welcome back, ${user.displayName || user.email}!`, {
        duration: 3000,
      });

      welcomeToastShownRef.current = true;

      return userCredential;
    } catch (error) {
      toast.dismiss(toastId);
      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No user found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || "Login failed. Please try again.";
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      const idToken = await user.getIdToken();
      setToken(idToken);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/sync`,
          {
            email: user.email,
            name: name
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );

        setRole(res.data.role);
        toast.dismiss(toastId);

        toast.success(`Account created successfully! Welcome, ${name}!`, {
          duration: 3000,
        });

        welcomeToastShownRef.current = true;

      } catch (backendError) {
        toast.dismiss(toastId);
        toast.success(`Account created! Welcome, ${name}!`, {
          duration: 3000,
        });
        welcomeToastShownRef.current = true;
      }

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: user.photoURL
      });

      return user;

    } catch (error) {
      toast.dismiss(toastId);
      let errorMessage = "Signup failed. Please try again.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please login instead.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please use at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Signup is currently disabled. Please try again later.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || "Signup failed. Please try again.";
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      welcomeToastShownRef.current = false; // Reset welcome toast flag
      await signOut(auth);
      toast.success("Logged out successfully!", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        duration: 4000,
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const toastId = toast.loading("Signing in with Google...");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      setToken(idToken);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/sync`,
        {
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      setCurrentUser(user);
      setPhotoURL(user.photoURL);
      setDisplayName(user.displayName);

      toast.dismiss(toastId);

      // শুধুমাত্র এখানে একবার welcome message দেখাবো
      toast.success(`Welcome, ${user.displayName || user.email}!`, {
        duration: 3000,
      });

      welcomeToastShownRef.current = true;

    } catch (error) {
      toast.dismiss(toastId);
      let errorMessage = "Google login failed. Please try again.";

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Login cancelled.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Login process cancelled.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Popup blocked. Please allow popups for this site.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage = "This domain is not authorized for login.";
          break;
        default:
          errorMessage = error.message || "Google login failed.";
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    role,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading,
    photoURL,
    displayName,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};