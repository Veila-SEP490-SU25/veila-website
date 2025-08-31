import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Kiểm tra session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

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
          Authorization: `Bearer ${session.accessToken}`,
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
