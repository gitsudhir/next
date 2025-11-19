'use client';

import { useState, useEffect } from 'react';

export default function ESP32Control() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esp32IP, setEsp32IP] = useState('192.168.1.23');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load IP from localStorage on component mount
  useEffect(() => {
    const savedIP = localStorage.getItem('esp32IP');
    if (savedIP) {
      setEsp32IP(savedIP);
    }
  }, []);

  // Save IP to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('esp32IP', esp32IP);
  }, [esp32IP]);

  // Format date for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Fetch data from ESP32 server via proxy
  const fetchData = async () => {
    if (!esp32IP) {
      setError('Please enter an IP address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/esp32/status?ip=${encodeURIComponent(esp32IP)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      setData(result);
      setIsConnected(true);
      setLastUpdated(formatTime(new Date()));
    } catch (err) {
      setIsConnected(false);
      setError(`Failed to connect to ESP32 at ${esp32IP}. Please check the IP address and ensure the device is online.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data every 10 seconds
  useEffect(() => {
    // Initial fetch
    fetchData();
    
    const interval = setInterval(() => {
      if (esp32IP) {
        fetchData();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [esp32IP]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ESP32 Status Monitor</h1>
          <p className="text-gray-600">Monitor your ESP32 devices in real-time</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600">
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
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
                
                {lastUpdated && (
                  <div className="text-blue-100 text-sm">
                    Updated: {lastUpdated}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loading && !data ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Connecting to ESP32 at {esp32IP}...</p>
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
                    <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Troubleshooting Tips</h4>
                  <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                    <li>Check that your ESP32 is powered on and connected to Wi-Fi</li>
                    <li>Verify the IP address is correct (current: {esp32IP})</li>
                    <li>Try pinging the IP address from your computer</li>
                    <li>Ensure your ESP32 web server is running</li>
                  </ul>
                </div>
              </div>
            ) : data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Device Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-700">Connected</span>
                      </div>
                      {data.deviceId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Device ID:</span>
                          <span className="font-medium">{data.deviceId}</span>
                        </div>
                      )}
                      {data.ip && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">IP Address:</span>
                        </div>
                      )}
                      {data.uptime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Uptime:</span>
                          <span className="font-medium">{data.uptime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"></path>
                      </svg>
                      Sensor Readings
                    </h3>
                    <div className="space-y-2">
                      {data.temperature ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="font-medium">{data.temperature}°C</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No temperature data</div>
                      )}
                      
                      {data.humidity ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humidity:</span>
                          <span className="font-medium">{data.humidity}%</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No humidity data</div>
                      )}
                      
                      {data.lightLevel ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Light Level:</span>
                          <span className="font-medium">{data.lightLevel}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No light data</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    Raw Response Data
                  </h3>
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto max-h-40 text-sm">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Not Connected</h3>
                <p className="mt-1 text-sm text-gray-500">Enter your ESP32 IP address and click Connect to get started.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">Monitoring Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Automatic Updates</h3>
                <p className="text-blue-700 text-sm">Data refreshes automatically every 10 seconds to provide real-time monitoring of your ESP32 device.</p>
              </div>
              
              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Persistent Configuration</h3>
                <p className="text-green-700 text-sm">IP address is saved in your browser and will persist between sessions for convenience.</p>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Status Monitoring</h3>
                <p className="text-purple-700 text-sm">Continuous connection status monitoring with clear indicators for device availability.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>ESP32 Status Monitor • Automatically refreshes every 10 seconds</p>
        </div>
      </div>
    </div>
  );
}