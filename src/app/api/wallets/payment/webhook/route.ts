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
    console.log("=== PAYOS WEBHOOK RECEIVED ===");
    console.log("Method:", request.method);
    console.log("URL:", request.url);
    console.log("Headers:", Object.fromEntries(request.headers.entries()));

    const body: PaymentWebhookPayload = await request.json();
    console.log("Body:", body);

    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "FAILED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    console.log("=== WEBHOOK PROCESSED SUCCESSFULLY ===");
    console.log("Transaction ID:", transactionId);
    console.log("Status:", status);
    console.log("Response sent to PayOS");

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
        transactionId,
        status,
        processedAt: new Date().toISOString(),
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
