import { IOrder } from "@/services/types";

interface IOrderCardProps {
  order: IOrder;
  onUpdate?: () => void;
}

export const OrderCard = ({ order, onUpdate }: IOrderCardProps) => {
  return (
    <div>
      <h3>{order.id}</h3>
      <p>{order.amount}</p>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
};
