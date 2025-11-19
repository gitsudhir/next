import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { command: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip') || '192.168.1.23';
    const command = params.command;
    
    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }
    
    // Server-side request (no CORS restrictions)
    const response = await fetch(`http://${ip}/api/${command}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No CORS mode needed for server-side requests
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `ESP32 server error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const text = await response.text();
    return new NextResponse(text || 'Command sent successfully', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    console.error('Error sending command to ESP32:', error);
    return NextResponse.json(
      { error: `Failed to send command to ESP32 at : ${error.message}` },
      { status: 500 }
    );
  }
}