import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip') || '192.168.1.23';
    
    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }
    
    // Server-side GET request to ESP32 status endpoint
    const response = await fetch(`http://${ip}/api/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `ESP32 server error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching from ESP32:', error);
    return NextResponse.json(
      { error: `Failed to fetch data from ESP32 at : ${error.message}` },
      { status: 500 }
    );
  }
}