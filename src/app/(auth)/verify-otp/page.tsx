// import { VerifyOtpForm } from "@/app/(auth)/verify-otp/components/verify-otp-form";
// import { Image } from "@/components/image";
// import { LoadingItem } from "@/components/loading-item";
// import { Separator } from "@/components/ui/separator";
// import { Suspense } from "react";

// const VerifyOtpPage = () => {
//   return (
//     <div className="w-full py-6 px-4 flex flex-col gap-3 items-center">
//       <Image src="/veila.png" alt="Veila logo" className="w-1/2 h-auto" />
//       <h1 className="font-playfair text-3xl font-bold text-maroon-400">
//         Xác thực email
//       </h1>
//       <p className="text-center text-sm text-crimson-900">
//         Chúng tôi đã gửi một mã OTP đến email của bạn. Vui lòng nhập mã OTP để
//         xác thực tài khoản của bạn.
//       </p>
//       <Separator />
//       <Suspense
//         fallback={
//           <div className="w-full flex flex-col gap-2">
//             <LoadingItem />
//             <LoadingItem />
//             <LoadingItem />
//           </div>
//         }
//       >
//         <VerifyOtpForm />
//       </Suspense>
//     </div>
//   );
// };

// export default VerifyOtpPage;
