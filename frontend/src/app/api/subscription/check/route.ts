import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vigil-backend.onrender.com';
    const response = await fetch(`${BACKEND_URL}/api/subscriptions/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { subscribed: false },
      { status: 500 }
    );
  }
}
