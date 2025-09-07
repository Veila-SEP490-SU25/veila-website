import { NextRequest, NextResponse } from "next/server";
import { getFirebaseConfig } from "@/lib/utils/index";

export async function PUT(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Initialize Firebase for server-side
    const firebaseConfig = getFirebaseConfig();
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error("Firebase config is missing or invalid");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // For now, we'll trust the token from the client
    // In production, you should verify the token server-side

    const body = await request.json();
    const { oldPin, pin } = body;

    if (!oldPin || !pin) {
      return NextResponse.json(
        { message: "Old PIN and new PIN are required" },
        { status: 400 }
      );
    }

    // Validate PIN format (6 digits)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(oldPin) || !pinRegex.test(pin)) {
      return NextResponse.json(
        { message: "PIN must be 6 digits" },
        { status: 400 }
      );
    }

    // Gọi API backend để cập nhật mã PIN
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wallets/my-wallet/update-pin`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPin, pin }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to update PIN" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in update PIN API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
