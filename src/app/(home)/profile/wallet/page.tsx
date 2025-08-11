"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft, Calendar, DollarSign } from "lucide-react"

const getVietnameseTransactionDescription = (description: string) => {
  const translations: { [key: string]: string } = {
    "Wallet top-up via Credit Card": "Nạp tiền qua Thẻ Tín Dụng",
    "Payment for Vintage Lace Rental": "Thanh toán cho Thuê Váy Ren Cổ Điển",
    "Wallet top-up via Bank Transfer": "Nạp tiền qua Chuyển Khoản Ngân Hàng",
    "Consultation fee - Emma Wilson": "Phí tư vấn - Emma Wilson",
    "Withdrawal to Bank Account": "Rút tiền về Tài Khoản Ngân Hàng",
  }
  return translations[description] || description
}

const transactions = [
  {
    id: 1,
    type: "deposit",
    amount: 500,
    description: "Wallet top-up via Credit Card",
    date: "2024-01-25",
    status: "completed",
  },
  {
    id: 2,
    type: "payment",
    amount: -300,
    description: "Payment for Vintage Lace Rental",
    date: "2024-01-24",
    status: "completed",
  },
  {
    id: 3,
    type: "deposit",
    amount: 1000,
    description: "Wallet top-up via Bank Transfer",
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: 4,
    type: "payment",
    amount: -150,
    description: "Consultation fee - Emma Wilson",
    date: "2024-01-18",
    status: "completed",
  },
  {
    id: 5,
    type: "withdrawal",
    amount: -200,
    description: "Withdrawal to Bank Account",
    date: "2024-01-15",
    status: "pending",
  },
]

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const currentBalance = 1250.0
  const pendingAmount = 200.0

  return (

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
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
                  <p className="text-3xl font-bold">{(currentBalance * 25000).toLocaleString("vi-VN")}₫</p>
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
                  <p className="text-2xl font-bold text-gray-900">{(pendingAmount * 25000).toLocaleString("vi-VN")}₫</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tổng Chi Tiêu</p>
                  <p className="text-2xl font-bold text-gray-900">{(2450 * 25000).toLocaleString("vi-VN")}₫</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="deposit" className="w-full">
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
                    <CardDescription>Nạp tiền vào ví để thực hiện mua hàng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">Số Tiền</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-sm text-gray-400">₫</span>
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
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">Thẻ Tín Dụng</SelectItem>
                          <SelectItem value="debit">Thẻ Ghi Nợ</SelectItem>
                          <SelectItem value="bank">Chuyển Khoản Ngân Hàng</SelectItem>
                          <SelectItem value="momo">MoMo</SelectItem>
                          <SelectItem value="zalopay">ZaloPay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount("2500000")}>
                        2.5 triệu
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount("6250000")}>
                        6.25 triệu
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount("12500000")}>
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
                    <CardDescription>Chuyển tiền về tài khoản ngân hàng của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">Số Tiền</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-sm text-gray-400">₫</span>
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
                        Khả dụng: {(currentBalance * 25000).toLocaleString("vi-VN")}₫
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Phương Thức Rút Tiền</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương thức rút tiền" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Chuyển Khoản Ngân Hàng</SelectItem>
                          <SelectItem value="momo">MoMo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">Việc rút tiền thường mất 3-5 ngày làm việc để xử lý.</p>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Minus className="h-4 w-4 mr-2" />
                      Yêu Cầu Rút Tiền
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Lịch Sử Giao Dịch</CardTitle>
                <CardDescription>Xem tất cả giao dịch ví của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                                transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                              }`}
                            />
                          ) : (
                            <ArrowUpRight
                              className={`h-4 w-4 ${transaction.type === "payment" ? "text-blue-600" : "text-red-600"}`}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {getVietnameseTransactionDescription(transaction.description)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}
                          {(Math.abs(transaction.amount) * 25000).toLocaleString("vi-VN")}₫
                        </p>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className={transaction.status === "completed" ? "bg-green-100 text-green-700" : ""}
                        >
                          {transaction.status === "completed" ? "Hoàn thành" : "Đang chờ"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button variant="outline">Xem Thêm Giao Dịch</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
