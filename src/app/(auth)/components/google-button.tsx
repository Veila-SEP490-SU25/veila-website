"use client";

import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/services/firebase";
import { useCallback } from "react";

interface GoogleButtonProps {
  variant?: "login" | "signup";
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  variant = "login",
}) => {
  const { auth, signInWithPopup, googleProvider } = useFirebase();

  const handleGoogleSignIn = useCallback(async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = user;
    console.log("Google Sign-In successful:", {
      displayName,
      email,
      photoURL,
    });
  }, [auth, signInWithPopup, googleProvider]);

  return (
    <Button
      variant="outline"
      className="cursor-pointer boder-1 bg-white text-maroon-500 border-maroon-400 hover:bg-maroon-400 hover:text-white rounded-full w-full"
      onClick={handleGoogleSignIn}
    >
      {variant === "login" ? "Đăng nhập" : "Đăng ký"} với Google{" "}
      <Image
        src="/google-icon.svg"
        alt="Google Icon"
        className="h-full w-auto"
      />
    </Button>
  );
};
