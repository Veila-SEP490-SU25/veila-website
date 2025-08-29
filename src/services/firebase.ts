import { getFirebaseConfig } from "@/lib/utils/index";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

const initializeFirebase = () => {
  if (typeof window === "undefined") {
    // Return null values during SSR
    return {
      app: null,
      auth: null,
      firestore: null,
      storage: null,
      googleProvider: null,
      recaptcha: null,
      signInWithPhoneNumber: null,
      signInWithPopup: null,
    };
  }

  if (!app) {
    const firebaseConfig = getFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  }

  const googleProvider = new GoogleAuthProvider();
  return {
    app,
    auth,
    firestore,
    storage,
    googleProvider,
    signInWithPhoneNumber,
    signInWithPopup,
  };
};

export const useFirebase = () => {
  return initializeFirebase();
};
