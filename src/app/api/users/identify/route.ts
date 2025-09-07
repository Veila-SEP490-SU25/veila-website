import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseConfig } from '@/lib/utils/index';
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

export async function PUT(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Initialize Firebase for server-side
    const firebaseConfig = getFirebaseConfig();
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error('Firebase config is missing or invalid');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // const app = initializeApp(firebaseConfig);

    // For now, we'll trust the token from the client
    // In production, you should verify the token server-side
    // This is a simplified approach - you may want to implement proper token verification

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }

    // Gọi API backend để identify user
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/identify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to identify user' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in identify API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
