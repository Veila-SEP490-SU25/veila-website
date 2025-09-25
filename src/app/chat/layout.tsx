import { Header } from '@/components/header/header';
import { ReactNode } from 'react';

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full relative">
      <Header />
      {children}
    </div>
  );
};

export default ChatLayout;
