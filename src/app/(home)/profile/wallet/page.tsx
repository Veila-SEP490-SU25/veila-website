"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { IWallet } from "@/services/types";
import { useLazyGetMyWalletQuery } from "@/services/apis";
import { useVietQR } from "@/hooks/use-vietqr";
import { IBank } from "@/services/types/bank.type";
import { formatPrice } from "@/lib/products-utils";
import { UpdateBankInfoDialog } from "@/components/profile/wallet/update-bank-info-dialog";

export default function WalletPage() {
  const [wallet, setWallet] = useState<IWallet>();
  const [userBank, setUserBank] = useState<IBank | null>(null);
  const [trigger, { isLoading }] = useLazyGetMyWalletQuery();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchMyWallet = useCallback(async () => {
    try {
      const { statusCode, item, message } = await trigger().unwrap();
      if (statusCode === 200) {
        setWallet(item);
      } else {
        setIsError(true);
        setError(
          message ||
            "Không thể tải ví của bạn vào lúc này. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      setIsError(true);
      setError("Không thể tải ví của bạn vào lúc này. Vui lòng thử lại sau.");
    }
  }, [setWallet, setError, setIsError]);

  useEffect(() => {
    fetchMyWallet();
  }, [trigger]);

  const { banks, getBank } = useVietQR();

  useEffect(() => {
    if (wallet) {
      const bank = getBank(wallet.bin);
      setUserBank(bank);
    }
  }, [wallet, getBank, setUserBank]);

  return (
    wallet && (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ví Điện Tử</h1>
          <p className="text-gray-600">Quản lý tiền và theo dõi giao dịch</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-rose-600 to-rose-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm">Số Dư Khả Dụng</p>
                  <p className="text-3xl font-bold">
                    {formatPrice(wallet.availableBalance)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Đang Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(wallet.lockedBalance)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Thông tin ngân hàng</p>
                  {userBank ? (
                    <div className="space-y-1">
                      <p className="text-gray-900">{userBank.name}</p>
                      <p className="text-gray-900">{wallet.bankNumber}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        Không có thông tin ngân hàng
                      </p>
                      <UpdateBankInfoDialog
                        onSuccess={fetchMyWallet}
                        wallet={wallet}
                      />
                    </div>
                  )}
                </div>
                <CreditCard className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Nạp Tiền</TabsTrigger>
            <TabsTrigger value="withdraw">Rút Tiền</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Nạp Tiền Vào Ví
                </CardTitle>
                <CardDescription>
                  Nạp tiền vào ví để thực hiện mua hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Số Tiền</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm text-gray-400">
                      ₫
                    </span>
                    <Input
                      id="depositAmount"
                      type="number"
                      placeholder="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phương Thức Thanh Toán</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Thẻ Tín Dụng</SelectItem>
                      <SelectItem value="debit">Thẻ Ghi Nợ</SelectItem>
                      <SelectItem value="bank">
                        Chuyển Khoản Ngân Hàng
                      </SelectItem>
                      <SelectItem value="momo">MoMo</SelectItem>
                      <SelectItem value="zalopay">ZaloPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount("2500000")}
                  >
                    2.5 triệu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount("6250000")}
                  >
                    6.25 triệu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount("12500000")}
                  >
                    12.5 triệu
                  </Button>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nạp Tiền
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minus className="h-5 w-5 text-red-600" />
                  Rút Tiền Từ Ví
                </CardTitle>
                <CardDescription>
                  Chuyển tiền về tài khoản ngân hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Số Tiền</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm text-gray-400">
                      ₫
                    </span>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      placeholder="0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Khả dụng: {(currentBalance * 25000).toLocaleString("vi-VN")}
                    ₫
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Phương Thức Rút Tiền</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức rút tiền" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">
                        Chuyển Khoản Ngân Hàng
                      </SelectItem>
                      <SelectItem value="momo">MoMo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    Việc rút tiền thường mất 3-5 ngày làm việc để xử lý.
                  </p>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Minus className="h-4 w-4 mr-2" />
                  Yêu Cầu Rút Tiền
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6"></div>

          <div className="lg:col-span-2">
            {/* <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Giao Dịch</CardTitle>
              <CardDescription>Xem tất cả giao dịch ví của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "deposit"
                            ? "bg-green-100"
                            : transaction.type === "payment"
                            ? "bg-blue-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft
                            className={`h-4 w-4 ${
                              transaction.type === "deposit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`h-4 w-4 ${
                              transaction.type === "payment"
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getVietnameseTransactionDescription(
                            transaction.description
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {(Math.abs(transaction.amount) * 25000).toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : "Đang chờ"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <Button variant="outline">Xem Thêm Giao Dịch</Button>
              </div>
            </CardContent>
          </Card> */}
          </div>
        </div>
      </div>
    )
  );
}
