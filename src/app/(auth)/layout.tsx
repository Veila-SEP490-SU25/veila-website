import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen relative bg-ivory-100 overflow-x-hidden">
      {children}
    </div>
  );
};

export default AuthLayout;
