import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://sheildguard-backend.onrender.com';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/waitlist/status`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Waitlist status error:', error);
    return NextResponse.json(
      { count: 0, capacity: 2000 },
      { status: 200 }
    );
  }
}
