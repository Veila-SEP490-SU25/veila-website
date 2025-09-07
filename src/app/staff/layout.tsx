import { Navigation } from '@/components/staff/navigation';
import { ReactNode } from 'react';

const ModLayout = ({ children }: { children: ReactNode }) => {
  return <Navigation>{children}</Navigation>;
};

export default ModLayout;
