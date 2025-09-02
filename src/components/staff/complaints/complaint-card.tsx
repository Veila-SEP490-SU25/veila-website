import { Card } from "@/components/ui/card";
import { IComplaint } from "@/services/types";

interface IComplaintCardProps {
  complaint: IComplaint;
  onUpdate?: () => void;
}

export const ComplaintCard = ({ complaint, onUpdate }: IComplaintCardProps) => {
  
  return <Card></Card>
};
