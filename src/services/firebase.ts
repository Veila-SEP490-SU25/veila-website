import { getFirebaseConfig } from "@/lib/utils/index";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
} from "firebase/auth";

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

const initializeFirebase = () => {
  if (typeof window === "undefined") {
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

  try {
    if (!app) {
      const firebaseConfig = getFirebaseConfig();
      if (!firebaseConfig || !firebaseConfig.apiKey) {
        console.error("Firebase config is missing or invalid");
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
  } catch (error) {
    console.error("Error initializing Firebase:", error);
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
};

export const useFirebase = () => {
  return initializeFirebase();
};
