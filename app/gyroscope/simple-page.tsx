'use client';

import { useState, useEffect, useRef } from 'react';

export default function GyroscopeControl() {
  const [gyroData, setGyroData] = useState({ x: null as number | null, y: null as number | null, z: null as number | null });
  const [accelData, setAccelData] = useState({ x: null as number | null, y: null as number | null, z: null as number | null });
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esp32IP, setEsp32IP] = useState('192.168.1.23');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load IP from localStorage
  useEffect(() => {
    const savedIP = localStorage.getItem('esp32IP');
    if (savedIP) {
      setEsp32IP(savedIP);
    }
  }, []);

  // Save IP to localStorage
  useEffect(() => {
    localStorage.setItem('esp32IP', esp32IP);
  }, [esp32IP]);

  // Check if sensors are supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window;
      setIsSupported(supported);
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setGyroData({
      x: event.alpha !== undefined && event.alpha !== null ? parseFloat(event.alpha.toFixed(2)) : null,
      y: event.beta !== undefined && event.beta !== null ? parseFloat(event.beta.toFixed(2)) : null,
      z: event.gamma !== undefined && event.gamma !== null ? parseFloat(event.gamma.toFixed(2)) : null
    });
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    if (event.acceleration) {
      setAccelData({
        x: event.acceleration.x !== undefined && event.acceleration.x !== null ? parseFloat(event.acceleration.x.toFixed(2)) : null,
        y: event.acceleration.y !== undefined && event.acceleration.y !== null ? parseFloat(event.acceleration.y.toFixed(2)) : null,
        z: event.acceleration.z !== undefined && event.acceleration.z !== null ? parseFloat(event.acceleration.z.toFixed(2)) : null
      });
    }
  };

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          startListening();
        } else {
          setError('Permission denied');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError('Permission request failed: ' + errorMessage);
      }
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
      setIsListening(true);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Failed to start listening: ' + errorMessage);
    }
  };

  const stopListening = () => {
    window.removeEventListener('deviceorientation', handleOrientation);
    window.removeEventListener('devicemotion', handleMotion);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsListening(false);
  };

  const sendDataToESP32 = async () => {
    if (!esp32IP) {
      setError('Please enter an IP address');
      return;
    }

    try {
      setSending(true);
      const payload = {
        gyro: gyroData,
        accel: accelData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`/api/esp32/send-data?ip=${encodeURIComponent(esp32IP)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setLastSent(formatTime(new Date()));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Failed to send data: ' + errorMessage);
    } finally {
      setSending(false);
    }
  };

  const toggleContinuousSending = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(sendDataToESP32, 1000);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  if (isSupported === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking device support...</div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Device sensors not supported</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gyroscope Control</h1>
        
        <div className="bg-white p-4 rounded mb-4">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">ESP32 IP</label>
            <input
              type="text"
              value={esp32IP}
              onChange={(e) => setEsp32IP(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded">
              <h3 className="font-medium">Gyroscope</h3>
              <div>α: {gyroData.x !== null ? `${gyroData.x}°` : 'N/A'}</div>
              <div>β: {gyroData.y !== null ? `${gyroData.y}°` : 'N/A'}</div>
              <div>γ: {gyroData.z !== null ? `${gyroData.z}°` : 'N/A'}</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <h3 className="font-medium">Accelerometer</h3>
              <div>X: {accelData.x !== null ? `${accelData.x} m/s²` : 'N/A'}</div>
              <div>Y: {accelData.y !== null ? `${accelData.y} m/s²` : 'N/A'}</div>
              <div>Z: {accelData.z !== null ? `${accelData.z} m/s²` : 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {!isListening ? (
              <button
                onClick={requestPermission}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Start Listening
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Stop Listening
              </button>
            )}
            
            <button
              onClick={sendDataToESP32}
              disabled={!isListening || sending}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              {sending ? 'Sending...' : 'Send Data'}
            </button>
            
            <button
              onClick={toggleContinuousSending}
              className={`text-white px-4 py-2 rounded ${
                intervalRef.current ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
            >
              {intervalRef.current ? 'Stop Continuous' : 'Continuous Send'}
            </button>
          </div>
          
          {lastSent && <div className="mt-2 text-sm text-gray-600">Last sent: {lastSent}</div>}
          {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}
        </div>
        
        <div className="bg-white p-4 rounded">
          <h2 className="font-bold mb-2">Instructions</h2>
          <ul className="text-sm list-disc pl-5">
            <li>Click &quot;Start Listening&quot; and grant permissions</li>
            <li>Move your device to see sensor data</li>
            <li>Use &quot;Send Data&quot; to send current readings</li>
            <li>Use &quot;Continuous Send&quot; to send data every second</li>
          </ul>
        </div>
      </div>
    </div>
  );
}