'use client';

import { useState, useEffect, useRef } from 'react';

export default function GyroscopeControl() {
  const [gyroData, setGyroData] = useState<{ x: number | null; y: number | null; z: number | null }>({ x: null, y: null, z: null });
  const [accelData, setAccelData] = useState<{ x: number | null; y: number | null; z: number | null }>({ x: null, y: null, z: null });
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esp32IP, setEsp32IP] = useState('192.168.1.23');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const orientationHandlerRef = useRef<((event: DeviceOrientationEvent) => void) | null>(null);
  const motionHandlerRef = useRef<((event: DeviceMotionEvent) => void) | null>(null);

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
    const checkSupport = () => {
      // Check for DeviceOrientation support
      const hasOrientation = 'DeviceOrientationEvent' in window;
      // Check for DeviceMotion support
      const hasMotion = 'DeviceMotionEvent' in window;
      
      console.log('DeviceOrientation supported:', hasOrientation);
      console.log('DeviceMotion supported:', hasMotion);
      
      if (hasOrientation || hasMotion) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    };

    // Run check after component mount
    if (typeof window !== 'undefined') {
      checkSupport();
    }
  }, []);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Request permission for iOS devices
  const requestPermission = async () => {
    console.log('Requesting permission...');
    setPermissionStatus('requesting');
    
    // For iOS 13+ devices
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        console.log('Requesting DeviceOrientation permission...');
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        console.log('DeviceOrientation permission result:', permission);
        setPermissionStatus(permission);
        
        if (permission === 'granted') {
          startListening();
        } else {
          setError('Permission denied for device orientation access');
        }
      } catch (err) {
        console.error('Permission request error:', err);
        setPermissionStatus('denied');
        setError('Failed to request permission: ' + (err as Error).message);
      }
    } else {
      // For non-iOS devices or older iOS versions
      console.log('No permission request needed, starting listening directly');
      setPermissionStatus('granted');
      startListening();
    }
  };

  // Start listening to sensor data
  const startListening = () => {
    if (isListening) return;

    try {
      console.log('Starting to listen for sensor data...');
      
      // Handler for DeviceOrientation (gyroscope)
      const handleOrientation = (event: DeviceOrientationEvent) => {
        console.log('Orientation event received:', {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
        
        setGyroData({
          x: event.alpha !== null ? parseFloat(event.alpha.toFixed(2)) : null,
          y: event.beta !== null ? parseFloat(event.beta.toFixed(2)) : null,
          z: event.gamma !== null ? parseFloat(event.gamma.toFixed(2)) : null
        });
      };

      // Handler for DeviceMotion (accelerometer)
      const handleMotion = (event: DeviceMotionEvent) => {
        console.log('Motion event received:', {
          x: event.acceleration?.x,
          y: event.acceleration?.y,
          z: event.acceleration?.z
        });
        
        if (event.acceleration) {
          setAccelData({
            x: event.acceleration.x !== null ? parseFloat(event.acceleration.x.toFixed(2)) : null,
            y: event.acceleration.y !== null ? parseFloat(event.acceleration.y.toFixed(2)) : null,
            z: event.acceleration.z !== null ? parseFloat(event.acceleration.z.toFixed(2)) : null
          });
        }
      };

      // Add event listeners
      orientationHandlerRef.current = handleOrientation;
      motionHandlerRef.current = handleMotion;
      
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
      
      setIsListening(true);
      setError(null);
      console.log('Successfully started listening for sensor data');
    } catch (err) {
      console.error('Failed to start listening:', err);
      setError('Failed to start listening: ' + (err as Error).message);
      setIsListening(false);
    }
  };

  // Stop listening to sensor data
  const stopListening = () => {
    console.log('Stopping sensor data listening...');
    
    if (orientationHandlerRef.current) {
      window.removeEventListener('deviceorientation', orientationHandlerRef.current);
    }
    
    if (motionHandlerRef.current) {
      window.removeEventListener('devicemotion', motionHandlerRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsListening(false);
    setPermissionStatus('unknown');
    console.log('Successfully stopped listening');
  };

  // Send data to ESP32 server (matrix API)
  const sendDataToESP32 = async () => {
    if (!esp32IP) {
      setError('Please enter an IP address');
      return;
    }

    try {
      setSending(true);
      
      // Map gyroscope data to matrix coordinates (0-7)
      let matrixX = 3; // Default center
      let matrixY = 3; // Default center
      
      if (gyroData.x !== null) {
        // Map alpha (compass) from -180 to 180 degrees to 0-7
        matrixX = Math.round(((gyroData.x + 180) / 360) * 7);
        matrixX = Math.max(0, Math.min(7, matrixX)); // Constrain to 0-7
      }
      
      if (gyroData.y !== null) {
        // Map beta (front-to-back) from -180 to 180 degrees to 0-7
        matrixY = Math.round(((gyroData.y + 180) / 360) * 7);
        matrixY = Math.max(0, Math.min(7, matrixY)); // Constrain to 0-7
      }
      
      // Create dot pattern (8x8 matrix with single dot)
      const dotPattern = Array(8).fill(null).map(() => Array(8).fill(0));
      dotPattern[matrixY][matrixX] = 1; // Set the dot position
      
      console.log('Sending dot pattern to matrix:', { matrixX, matrixY, pattern: dotPattern });
      
      // Send pattern to matrix API
      const response = await fetch(`http://${esp32IP}/api/matrix/pattern`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern: dotPattern }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setLastSent(formatTime(new Date()));
      console.log('Dot pattern sent successfully');
    } catch (err) {
      console.error('Failed to send dot pattern:', err);
      setError('Failed to send dot pattern: ' + (err as Error).message);
    } finally {
      setSending(false);
    }
  };

  // Toggle continuous sending
  const toggleContinuousSending = () => {
    if (intervalRef.current) {
      console.log('Stopping continuous sending');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      console.log('Starting continuous sending');
      intervalRef.current = setInterval(sendDataToESP32, 200); // Send every 200ms for smoother movement
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Gyroscope Control</h1>
          <p className="text-gray-600">Send device motion data to your ESP32</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-4 sm:px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-blue-100 mb-1">ESP32 IP Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={esp32IP}
                    onChange={(e) => setEsp32IP(e.target.value)}
                    className="flex-grow px-4 py-2 border border-blue-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="e.g., 192.168.1.23"
                  />
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${isListening ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isListening ? 'Listening' : 'Not Listening'}
                </div>
                
                <div className="text-blue-100 text-sm mt-1">
                  Permission: {permissionStatus}
                </div>
                
                {lastSent && (
                  <div className="text-blue-100 text-sm">
                    Last sent: {lastSent}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {isSupported === null ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Checking device support...</p>
              </div>
            ) : !isSupported ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Device Not Supported</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Your device does not support the required sensor APIs. This feature requires a mobile device with gyroscope and accelerometer capabilities.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-800">Troubleshooting Tips</h4>
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                    <li>Make sure you&apos;re using a mobile device (phones/tablets work best)</li>
                    <li>Ensure you&apos;ve granted permission when prompted</li>
                    <li>Try refreshing the page and granting permission again</li>
                    <li>Check that your device has gyroscope and accelerometer sensors</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      Gyroscope Data (Orientation)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alpha (α) - Compass:</span>
                        <span className="font-medium text-orange-500">{gyroData.x !== null ? `${gyroData.x}°` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beta (β) - Front-to-back:</span>
                        <span className="font-medium text-orange-500">{gyroData.y !== null ? `${gyroData.y}°` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gamma (γ) - Left-to-right:</span>
                        <span className="font-medium text-orange-500">{gyroData.z !== null ? `${gyroData.z}°` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Accelerometer Data (Movement)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">X-axis (Left/Right):</span>
                        <span className="font-medium text-orange-500">{accelData.x !== null ? `${accelData.x} m/s²` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Y-axis (Front/Back):</span>
                        <span className="font-medium text-orange-500">{accelData.y !== null ? `${accelData.y} m/s²` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Z-axis (Up/Down):</span>
                        <span className="font-medium text-orange-500">{accelData.z !== null ? `${accelData.z} m/s²` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Tip:</strong> Move your device in different directions to see the dot move on the LED matrix. 
                        If values remain as &quot;N/A&quot;, check the troubleshooting tips below.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Matrix Visualization */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Matrix Visualization</h3>
                  <p className="text-sm text-gray-600 mb-3">This is what will be displayed on your 8x8 LED matrix:</p>
                  <div className="flex justify-center">
                    <div className="inline-grid grid-cols-8 gap-1 bg-gray-800 p-2 rounded-lg">
                      {Array.from({ length: 8 }).map((_, rowIndex) => (
                        Array.from({ length: 8 }).map((_, colIndex) => {
                          // Calculate if this cell should be active based on current gyro data
                          const isActive = isListening && 
                                          gyroData.x !== null && 
                                          gyroData.y !== null &&
                                          rowIndex === Math.round(((gyroData.y + 180) / 360) * 7) &&
                                          colIndex === Math.round(((gyroData.x + 180) / 360) * 7);
                          
                          return (
                            <div 
                              key={`${rowIndex}-${colIndex}`} 
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${
                                isActive ? 'bg-orange-500' : 'bg-gray-900'
                              }`}
                            />
                          );
                        })
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Dot position: X={gyroData.x !== null ? Math.round(((gyroData.x + 180) / 360) * 7) : 'N/A'}, 
                    Y={gyroData.y !== null ? Math.round(((gyroData.y + 180) / 360) * 7) : 'N/A'}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isListening ? (
                    <button
                      onClick={requestPermission}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                      Start Listening
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                      </svg>
                      Stop Listening
                    </button>
                  )}
                  
                  <button
                    onClick={sendDataToESP32}
                    disabled={!isListening || sending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Send Dot to Matrix
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={toggleContinuousSending}
                    className={`flex-1 font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center ${
                      intervalRef.current 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                    }`}
                  >
                    {intervalRef.current ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                        </svg>
                        Stop Continuous Dot
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Continuous Dot Movement
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">Troubleshooting Guide</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Common Issues & Solutions</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <div>
                      <span className="font-medium">Values show as &quot;N/A&quot;</span>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Ensure you&apos;re on a mobile device</li>
                        <li>Check that you granted permission</li>
                        <li>Try moving your device more vigorously</li>
                        <li>Some devices may not support all sensors</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <div>
                      <span className="font-medium">Permission denied</span>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        <li>Refresh the page and try again</li>
                        <li>Check browser settings for sensor permissions</li>
                        <li>Try using a different browser (Chrome recommended)</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Mobile device with gyroscope and accelerometer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Secure context (HTTPS or localhost)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Permission to access device motion sensors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>ESP32 configured to receive HTTP POST requests at /api/sensor-data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Modern browser (Chrome, Safari, Firefox recommended)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Gyroscope Control Panel • Data sent via secure API proxy</p>
        </div>
      </div>
    </div>
  );
}