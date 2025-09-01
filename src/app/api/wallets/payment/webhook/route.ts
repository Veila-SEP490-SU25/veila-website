import { NextRequest, NextResponse } from "next/server";

interface PaymentWebhookPayload {
  transactionId: string;
  status: "COMPLETED" | "FAILED" | "CANCELLED";
  orderCode?: string;
  amount?: number;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentWebhookPayload = await request.json();

    console.log("Payment webhook received:", body);

    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    switch (status) {
      case "COMPLETED":
        console.log(`Payment completed for transaction: ${transactionId}`);
        break;

      case "FAILED":
        console.log(`Payment failed for transaction: ${transactionId}`);
        break;

      case "CANCELLED":
        console.log(`Payment cancelled for transaction: ${transactionId}`);
        break;

      default:
        console.log(
          `Unknown payment status: ${status} for transaction: ${transactionId}`
        );
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Webhook processed successfully",
        transactionId,
        status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
