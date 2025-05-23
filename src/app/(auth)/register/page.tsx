import { RegisterForm } from "@/app/(auth)/register/components/register-form";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const RegisterPage = () => {
  return (
    <div className="w-full py-6 px-4 flex flex-col gap-3 items-center">
      <Image src="/veila.png" alt="Veila logo" className="w-1/2 h-auto" />
      <h1 className="font-playfair text-3xl font-bold text-maroon-400">
        Đăng ký
      </h1>
      <p className="text-center text-sm text-crimson-900">
        Đăng ký tài khoản mới
      </p>
      <Separator />
      <RegisterForm />
      <div className="w-full grid grid-cols-7 gap-1 items-center">
        <Separator className="col-span-3" />
        <p className="text-center text-sm text-muted-foreground col-span-1">
          Hoặc
        </p>
        <Separator className="col-span-3" />
      </div>
      <Button
        variant="outline"
        className="cursor-pointer boder-1 bg-white text-maroon-500 border-maroon-400 hover:bg-maroon-400 hover:text-white rounded-full w-full"
      >
        Đăng ký với Google{" "}
        <Image
          src="/google-icon.svg"
          alt="Google Icon"
          className="h-full w-auto"
        />
      </Button>
    </div>
  );
};

export default RegisterPage;
