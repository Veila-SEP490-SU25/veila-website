import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export const EmptyCard = ({ message, title }: { message: string; title: string }) => {
  return (
    <Alert variant={'default'} className="mb-4 h-full">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
