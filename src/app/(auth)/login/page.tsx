import { GoogleButton } from "@/app/(auth)/components/google-button";
import { OtpLoginForm } from "@/app/(auth)/login/components/otp-login-from";
import { PasswordLoginFrom } from "@/app/(auth)/login/components/password-login-form";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  return (
    <div className="w-full py-6 px-4 flex flex-col gap-3 items-center">
      <Image src="/veila.png" alt="Veila logo" className="w-1/2 h-auto" />
      <h1 className="font-playfair text-3xl font-bold text-maroon-400">
        Đăng nhập
      </h1>
      <p className="text-center text-sm text-crimson-900">
        Đăng nhập vào tài khoản của bạn để tiếp tục
      </p>
      <Separator />
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="w-full grid grid-cols-2 gap-1">
          <TabsTrigger value="password">Dùng mật khẩu</TabsTrigger>
          <TabsTrigger value="otp">Dùng mã OTP</TabsTrigger>
        </TabsList>
        <TabsContent value="password">
          <PasswordLoginFrom />
        </TabsContent>
        <TabsContent value="otp">
          <OtpLoginForm />
        </TabsContent>
      </Tabs>
      <div className="w-full grid grid-cols-7 gap-1 items-center">
        <Separator className="col-span-3" />
        <p className="text-center text-sm text-muted-foreground col-span-1">
          Hoặc
        </p>
        <Separator className="col-span-3" />
      </div>
      <GoogleButton variant="login" />
    </div>
  );
};

export default LoginPage;
