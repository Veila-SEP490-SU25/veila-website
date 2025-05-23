import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-screen h-screen relative bg-ivory-100 overflow-hidden">{children}</div>;
};

export default AuthLayout;
