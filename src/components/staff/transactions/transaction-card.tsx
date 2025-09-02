import { WithdrawProcessDialog } from "@/components/staff/transactions/withdraw-procress-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateShort } from "@/lib/order-util";
import { formatPrice } from "@/lib/products-utils";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "@/services/types";
import { ArrowDownLeft, ArrowUpRight, BanknoteArrowDown } from "lucide-react";

interface TransactionCardProps {
  transaction: ITransaction;
  onUpdate: () => void;
}

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return "Nạp tiền";
    case TransactionType.WITHDRAW:
      return "Rút tiền";
    case TransactionType.TRANSFER:
      return "Chuyển tiền";
    case TransactionType.RECEIVE:
      return "Nhận tiền";
    case TransactionType.REFUND:
      return "Hoàn tiền";
    default:
      return type;
  }
};

const getTransactionStatusLabel = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.PENDING:
      return "Đang chờ";
    case TransactionStatus.COMPLETED:
      return "Đã hoàn thành";
    case TransactionStatus.FAILED:
      return "Thất bại";
    case TransactionStatus.CANCELLED:
      return "Đã hủy";
    case TransactionStatus.REFUNDED:
      return "Đã hoàn tiền";
    case TransactionStatus.DISPUTED:
      return "Đang tranh chấp";
    default:
      return status;
  }
};

const getStatusBadgeColor = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case TransactionStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case TransactionStatus.FAILED:
      return "bg-red-100 text-red-800 border-red-200";
    case TransactionStatus.CANCELLED:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case TransactionStatus.REFUNDED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case TransactionStatus.DISPUTED:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const TransactionCard = ({
  transaction,
  onUpdate,
}: TransactionCardProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between p-4 rounded-lg relative">
        {transaction.type === TransactionType.WITHDRAW &&
          transaction.status === TransactionStatus.PENDING && (
            <WithdrawProcessDialog
              transaction={transaction}
              onUpdate={onUpdate}
            >
              <Button className="absolute top-4 right-4" variant="outline">
                <BanknoteArrowDown />
                Thực hiện giao dịch
              </Button>
            </WithdrawProcessDialog>
          )}
        <div className="flex items-center space-x-4">
          <div
            className={`p-2 rounded-full ${
              [TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
                transaction.type
              )
                ? "bg-red-100"
                : "bg-green-100"
            }`}
          >
            {[TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
              transaction.type
            ) ? (
              <ArrowDownLeft className="h-4 w-4 text-red-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="font-medium text-gray-900">
                Giao dịch: #{transaction.id.substring(0, 8)}
              </p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                  transaction.status
                )}`}
              >
                {getTransactionStatusLabel(transaction.status)}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Thời gian giao dịch: {formatDateShort(transaction.updatedAt)}
              </p>
              <p className="text-sm text-gray-500">
                Loại giao dịch: {getTransactionTypeLabel(transaction.type)}
              </p>
              <p className="text-sm text-gray-500">
                Người gửi: {transaction.from}
              </p>
              <p className="text-sm text-gray-500">
                Người nhận: {transaction.to}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
              <p className="text-xs text-gray-400">
                Số dư khả dụng:{" "}
                <span className="font-medium text-gray-600">
                  {formatPrice(transaction.availableBalanceSnapshot)}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Số dư bị khóa:{" "}
                <span className="font-medium text-gray-600">
                  {formatPrice(transaction.lockedBalanceSnapshot)}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-right flex flex-col items-end gap-2">
            {[TransactionType.TRANSFER, TransactionType.WITHDRAW].includes(
              transaction.type
            ) ? (
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  - {formatPrice(transaction.amount)}
                </p>
                <p className="text-xs text-red-500 font-medium">Tiền ra</p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  + {formatPrice(transaction.amount)}
                </p>
                <p className="text-xs text-green-500 font-medium">Tiền vào</p>
              </div>
            )}

            {transaction.note && (
              <div className="text-xs text-gray-400 max-w-32 text-right">
                <p className="truncate">{transaction.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
