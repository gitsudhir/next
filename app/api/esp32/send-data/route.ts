import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip') || '192.168.1.23';
  
  try {
    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }
    
    // Get the data from the request body
    const data = await request.json();
    
    // Server-side POST request to ESP32
    const response = await fetch(`http://${ip}/api/sensor-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `ESP32 server error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const result = await response.text();
    return new NextResponse(result || 'Data sent successfully', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    console.error('Error sending data to ESP32:', error);
    return NextResponse.json(
      { error: `Failed to send data to ESP32 at ${ip}: ${error.message}` },
      { status: 500 }
    );
  }
}