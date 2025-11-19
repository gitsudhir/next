'use client';

import { useState, useEffect, useRef } from 'react';
import type { MotionAndOrientationPayload, GyroNorm } from 'gyronorm';

export default function GyroNormCompleteTest() {
  const [sensorData, setSensorData] = useState<MotionAndOrientationPayload | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esp32IP, setEsp32IP] = useState('192.168.1.23');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const gnRef = useRef<GyroNorm | null>(null);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const initializeGyroNorm = async () => {
    try {
      // Try to dynamically import the complete version
      let GyroNormClass;
      
      try {
        // First try the default import
        const importedModule = await import('gyronorm');
        GyroNormClass = importedModule.GyroNorm || importedModule.default;
      } catch (importError) {
        console.log('Default import failed, trying alternative approach');
        // If that fails, we'll handle it in the catch block
        throw importError;
      }
      
      if (!GyroNormClass) {
        throw new Error('GyroNorm not found in imported module');
      }
      
      const gn = new GyroNormClass();
      gnRef.current = gn;
      
      // Initialize with default options
      await gn.init({
        frequency: 200, // Frequency in milliseconds
        gravityNormalized: true,
        orientationBase: GyroNormClass.GAME, // GAME
        decimalCount: 2,
        logger: undefined,
        screenAdjusted: false
      });
      
      setIsInitialized(true);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Failed to initialize sensors: ' + errorMessage);
      console.error('GyroNorm initialization error:', err);
      
      // Fallback to manual implementation
      setError('GyroNorm initialization failed. Try the proven approach instead.');
    }
  };

  const startSensors = () => {
    if (!gnRef.current || !isInitialized) {
      setError('Sensors not initialized');
      return;
    }

    try {
      gnRef.current.start((data) => {
        setSensorData(data);
      });
      
      setIsRunning(true);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Failed to start sensors: ' + errorMessage);
      console.error('GyroNorm start error:', err);
    }
  };

  const stopSensors = () => {
    if (gnRef.current && isRunning) {
      // Stop the gyronorm sensor data collection
      // Since there's no explicit stop method, we'll stop logging if it was started
      gnRef.current.stopLogging();
      setIsRunning(false);
    }
  };

  const sendDataToESP32 = async () => {
    if (!esp32IP) {
      setError('Please enter an IP address');
      return;
    }

    if (!sensorData) {
      setError('No sensor data available');
      return;
    }

    try {
      setSending(true);
      const payload = {
        ...sensorData,
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gnRef.current) {
        // Stop any ongoing logging when component unmounts
        gnRef.current.stopLogging();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GyroNorm.js Complete Test</h1>
          <p className="mt-2 text-gray-600">Using gyronorm.js library with fallback options</p>
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
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${isInitialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isInitialized ? 'Initialized' : 'Not Initialized'}
                </div>
                
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isRunning ? 'Running' : 'Stopped'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {!isInitialized ? (
              <div className="text-center py-8">
                <button
                  onClick={initializeGyroNorm}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                >
                  Initialize Sensors (GyroNorm.js)
                </button>
                <p className="mt-4 text-gray-600">Click to initialize gyronorm.js sensor library</p>
                
                <div className="mt-6">
                  <a 
                    href="/gyroscope/proven-approach" 
                    className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    Fallback: Proven Approach
                  </a>
                  <p className="mt-2 text-sm text-gray-600">If GyroNorm fails, try the proven DeviceOrientation/Motion approach</p>
                </div>
                
                {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg max-w-2xl mx-auto">
                    <h3 className="font-medium mb-2">Initialization Error:</h3>
                    <p className="text-sm">{error}</p>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>Fallback options:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Use the &quot;Proven Approach&quot; link above</li>
                        <li>Check browser console for detailed errors</li>
                        <li>Try a different browser</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">Orientation Data</h3>
                    {sensorData?.do ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alpha:</span>
                          <span className="font-medium">{sensorData.do.alpha}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Beta:</span>
                          <span className="font-medium">{sensorData.do.beta}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gamma:</span>
                          <span className="font-medium">{sensorData.do.gamma}°</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No orientation data</div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Motion Data</h3>
                    {sensorData?.dm ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceleration X:</span>
                          <span className="font-medium">{sensorData.dm.x} m/s²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceleration Y:</span>
                          <span className="font-medium">{sensorData.dm.y} m/s²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceleration Z:</span>
                          <span className="font-medium">{sensorData.dm.z} m/s²</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No motion data</div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Gravity Data</h3>
                  {sensorData?.dm ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Gravity X</div>
                        <div className="text-lg font-medium">{sensorData.dm.gx} m/s²</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Gravity Y</div>
                        <div className="text-lg font-medium">{sensorData.dm.gy} m/s²</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Gravity Z</div>
                        <div className="text-lg font-medium">{sensorData.dm.gz} m/s²</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No gravity data</div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isRunning ? (
                    <button
                      onClick={startSensors}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                      Start Sensors
                    </button>
                  ) : (
                    <button
                      onClick={stopSensors}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                      Stop Sensors
                    </button>
                  )}
                  
                  <button
                    onClick={sendDataToESP32}
                    disabled={sending || !isRunning || !sensorData}
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
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">GyroNorm.js Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About GyroNorm.js</h3>
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  <li>Normalizes sensor data across different devices</li>
                  <li>Works on both iOS and Android</li>
                  <li>Handles browser compatibility issues</li>
                  <li>Provides consistent data format</li>
                  <li>Includes fallbacks for different sensor APIs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Alternative Approaches</h3>
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  <li><a href="/gyroscope/proven-approach" className="text-blue-600 hover:text-blue-800">Proven Approach</a> - Direct DeviceOrientation/Motion APIs</li>
                  <li><a href="/gyroscope/diagnostics" className="text-blue-600 hover:text-blue-800">Diagnostics</a> - Check device capabilities</li>
                  <li><a href="/gyroscope/minimal-test" className="text-blue-600 hover:text-blue-800">Minimal Test</a> - Simple sensor test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}