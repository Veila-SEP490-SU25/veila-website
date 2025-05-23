"use client";

import { Image } from "@/components/image";
import { LoadingItem } from "@/components/loading-item";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth.provider";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const router = useRouter();
  const { currentUser, isAuthenticating, isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full bg-white flex flex-col items-center gap-5">
      <Image src="/veila.png" alt="Veila" className="w-2xs h-auto" />
      <div className="max-w-[100%] w-4xl my-0 mx-auto flex flex-col items-center gap-5">
        {isAuthenticating ? (
          <div className="w-full grid grid-cols-3">
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
            <div className="col-span-1 w-full">
              <LoadingItem />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="w-full font-playfair text-3xl font-bold text-maroon-400 text-center mb-3">
              Chào mừng{" "}
              {isAuthenticated
                ? `${currentUser?.firstName} ${currentUser?.middleName || ""} ${
                    currentUser?.lastName
                  }`
                : "bạn"}{" "}
              đến với Veila
            </h1>
            <h6 className="text-xl font-medium text-maroon-400 font-playfair text-center text-wrap mb-3">
              Nền tảng kết nối dịch vụ cho thuê, mua bán và đặt may váy cưới.{" "}
              <br></br>
              Nơi bạn có thể tìm thấy những chiếc váy cưới hoàn hảo nhất cho
              ngày trọng đại của mình.
            </h6>
            <div className="text-center text-sm text-crimson-900 w-full">
              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  className="bg-maroon-400 text-white hover:bg-maroon-400/50 cursor-pointer rounded-full w-fit px-10 py-2"
                  disabled={isAuthenticating}
                >
                  Đăng xuất
                </Button>
              ) : (
                <Button
                  disabled={isAuthenticating}
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="bg-maroon-400 text-white hover:bg-maroon-400/50 cursor-pointer rounded-full w-fit px-10 py-2"
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
