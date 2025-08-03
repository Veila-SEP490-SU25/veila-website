import { getFirebaseConfig } from "@/utils";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const useFirebase = () => {
  const firebaseConfig = getFirebaseConfig();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const googleProvider = new GoogleAuthProvider();

  return {
    app,
    auth,
    firestore,
    storage,
    googleProvider,
    signInWithPopup,
  };
};
