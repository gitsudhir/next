'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ProvenDeviceSensors() {
  const [orientation, setOrientation] = useState({
    alpha: null as number | null,
    beta: null as number | null,
    gamma: null as number | null
  });
  
  const [motion, setMotion] = useState({
    acceleration: {
      x: null as number | null,
      y: null as number | null,
      z: null as number | null
    },
    accelerationIncludingGravity: {
      x: null as number | null,
      y: null as number | null,
      z: null as number | null
    }
  });
  
  const [supported, setSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [esp32IP, setEsp32IP] = useState('192.168.1.23');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasOrientation = 'DeviceOrientationEvent' in window;
      const hasMotion = 'DeviceMotionEvent' in window;
      setSupported(hasOrientation || hasMotion);
      
      // Also check if we're in a secure context
      if (window.isSecureContext === false) {
        setError('Not in secure context (HTTPS required for sensors)');
      }
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Handle device orientation events (gyroscope-like data)
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha !== null ? parseFloat(event.alpha.toFixed(2)) : null,
      beta: event.beta !== null ? parseFloat(event.beta.toFixed(2)) : null,
      gamma: event.gamma !== null ? parseFloat(event.gamma.toFixed(2)) : null
    });
  }, []);

  // Handle device motion events (accelerometer data)
  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    setMotion({
      acceleration: {
        x: event.acceleration?.x !== undefined && event.acceleration?.x !== null ? parseFloat(event.acceleration.x.toFixed(2)) : null,
        y: event.acceleration?.y !== undefined && event.acceleration?.y !== null ? parseFloat(event.acceleration.y.toFixed(2)) : null,
        z: event.acceleration?.z !== undefined && event.acceleration?.z !== null ? parseFloat(event.acceleration.z.toFixed(2)) : null
      },
      accelerationIncludingGravity: {
        x: event.accelerationIncludingGravity?.x !== undefined && event.accelerationIncludingGravity?.x !== null ? parseFloat(event.accelerationIncludingGravity.x.toFixed(2)) : null,
        y: event.accelerationIncludingGravity?.y !== undefined && event.accelerationIncludingGravity?.y !== null ? parseFloat(event.accelerationIncludingGravity.y.toFixed(2)) : null,
        z: event.accelerationIncludingGravity?.z !== undefined && event.accelerationIncludingGravity?.z !== null ? parseFloat(event.accelerationIncludingGravity.z.toFixed(2)) : null
      }
    });
  }, []);

  // Request permission for iOS devices and start listening
  const requestPermissionAndStart = async () => {
    try {
      // For iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionResult = await (DeviceOrientationEvent as any).requestPermission();
        
        if (permissionResult === 'granted') {
          startListening();
        } else {
          setError('Permission not granted for device sensors');
        }
      } else {
        // For non-iOS devices or older iOS versions
        startListening();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Permission request failed: ' + errorMessage);
      // Still try to start listening as fallback
      startListening();
    }
  };

  // Start listening to events
  const startListening = useCallback(() => {
    try {
      // Try all supported event types
      let listenersAdded = false;
      
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation, true);
        listenersAdded = true;
      }
      
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleMotion, true);
        listenersAdded = true;
      }
      
      if (listenersAdded) {
        setIsListening(true);
        setError(null);
      } else {
        setError('No supported sensor events available');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Failed to start listening: ' + errorMessage);
    }
  }, [handleOrientation, handleMotion]);

  // Stop listening to events
  const stopListening = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation, true);
    window.removeEventListener('devicemotion', handleMotion, true);
    setIsListening(false);
  }, [handleOrientation, handleMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const sendDataToESP32 = async () => {
    if (!esp32IP) {
      setError('Please enter an IP address');
      return;
    }

    try {
      setSending(true);
      const payload = {
        orientation,
        motion,
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

  if (!supported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Sensors Not Supported</h1>
          <p className="text-gray-600 mb-6">
            Your device or browser doesn&apos;t support device orientation or motion sensors.
          </p>
          <div className="text-sm text-gray-500">
            <p>Requirements:</p>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Mobile device with sensors</li>
              <li>Modern browser (Chrome, Safari, Firefox)</li>
              <li>Secure context (HTTPS or localhost)</li>
            </ul>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-left">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Device Sensors Control</h1>
          <p className="mt-2 text-gray-600">Using proven DeviceOrientation and DeviceMotion APIs</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-blue-100 mb-1">ESP32 IP Address</label>
                <input
                  type="text"
                  value={esp32IP}
                  onChange={(e) => setEsp32IP(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  placeholder="e.g., 192.168.1.23"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${isListening ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isListening ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Orientation Data (Gyroscope-like)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alpha (α) - Compass:</span>
                    <span className="font-medium">{orientation.alpha !== null ? `${orientation.alpha}°` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beta (β) - Front-to-back:</span>
                    <span className="font-medium">{orientation.beta !== null ? `${orientation.beta}°` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gamma (γ) - Left-to-right:</span>
                    <span className="font-medium">{orientation.gamma !== null ? `${orientation.gamma}°` : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Acceleration Data (Accelerometer)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">X-axis:</span>
                    <span className="font-medium">{motion.acceleration.x !== null ? `${motion.acceleration.x} m/s²` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Y-axis:</span>
                    <span className="font-medium">{motion.acceleration.y !== null ? `${motion.acceleration.y} m/s²` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Z-axis:</span>
                    <span className="font-medium">{motion.acceleration.z !== null ? `${motion.acceleration.z} m/s²` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Acceleration with Gravity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm text-gray-600">X-axis</div>
                  <div className="text-lg font-medium">{motion.accelerationIncludingGravity.x !== null ? `${motion.accelerationIncludingGravity.x} m/s²` : 'N/A'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Y-axis</div>
                  <div className="text-lg font-medium">{motion.accelerationIncludingGravity.y !== null ? `${motion.accelerationIncludingGravity.y} m/s²` : 'N/A'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Z-axis</div>
                  <div className="text-lg font-medium">{motion.accelerationIncludingGravity.z !== null ? `${motion.accelerationIncludingGravity.z} m/s²` : 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!isListening ? (
                <button
                  onClick={requestPermissionAndStart}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  Request Permission & Start
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  Stop Listening
                </button>
              )}
              
              <button
                onClick={sendDataToESP32}
                disabled={sending || !isListening}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Data to ESP32'
                )}
              </button>
            </div>
            
            {lastSent && (
              <div className="mt-4 text-center text-sm text-green-600">
                Last sent: {lastSent}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                Error: {error}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">Instructions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">How to Use</h3>
                <ol className="space-y-2 text-gray-600 list-decimal pl-5">
                  <li>Click &quot;Request Permission & Start&quot; (iOS will prompt for permission)</li>
                  <li>Move your device to see real-time sensor readings</li>
                  <li>Click &quot;Send Data to ESP32&quot; to transmit current readings</li>
                  <li>Data is sent to your ESP32 at {esp32IP}</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sensor Types</h3>
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  <li><strong>DeviceOrientation</strong>: Rotation data (like gyroscope)</li>
                  <li><strong>DeviceMotion</strong>: Acceleration data (like accelerometer)</li>
                  <li><strong>Works on</strong>: iOS, Android, some laptops with sensors</li>
                  <li><strong>Secure Context Required</strong>: HTTPS or localhost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}