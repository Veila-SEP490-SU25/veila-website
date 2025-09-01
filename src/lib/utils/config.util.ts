export const getFirebaseConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId ||
    !measurementId
  ) {
    console.error("Missing Firebase configuration in environment variables");
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
};

export const getVeilaServerConfig = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Missing Veila server API URL in environment variables");
  }

  return apiUrl;
};

export const getVietQRConfig = () => {
  const clientId = process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID;
  const apiKey = process.env.NEXT_PUBLIC_VIETQR_API_KEY;

  if (!clientId || !apiKey) {
    throw new Error("Missing VietQR configuration in environment variables");
  }

  return {
    clientId,
    apiKey,
  };
};
