'use client';

import { useState, useEffect } from 'react';

export default function SensorDiagnostics() {
  const [diagnostics, setDiagnostics] = useState({
    userAgent: '',
    deviceOrientationSupported: false,
    deviceMotionSupported: false,
    deviceOrientationEvent: false,
    deviceMotionEvent: false,
    permissionsApi: false,
    secureContext: false,
    touchSupport: false
  });
  
  const [testResults, setTestResults] = useState<{test: string, result: string}[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Run diagnostics on mount
  useEffect(() => {
    const runDiagnostics = () => {
      const results = [];
      
      // Basic environment info
      const userAgent = navigator.userAgent;
      results.push({ test: 'User Agent', result: userAgent });
      
      // Check APIs
      const deviceOrientationSupported = 'DeviceOrientationEvent' in window;
      const deviceMotionSupported = 'DeviceMotionEvent' in window;
      const permissionsApi = 'permissions' in navigator;
      const secureContext = window.isSecureContext;
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      results.push({ test: 'DeviceOrientationEvent API', result: deviceOrientationSupported ? 'Available' : 'Not Available' });
      results.push({ test: 'DeviceMotionEvent API', result: deviceMotionSupported ? 'Available' : 'Not Available' });
      results.push({ test: 'Permissions API', result: permissionsApi ? 'Available' : 'Not Available' });
      results.push({ test: 'Secure Context', result: secureContext ? 'Yes (HTTPS/localhost)' : 'No (HTTP)' });
      results.push({ test: 'Touch Support', result: touchSupport ? 'Yes' : 'No' });
      
      // Check actual event objects
      try {
        const deviceOrientationEvent = typeof DeviceOrientationEvent !== 'undefined';
        const deviceMotionEvent = typeof DeviceMotionEvent !== 'undefined';
        results.push({ test: 'DeviceOrientationEvent Object', result: deviceOrientationEvent ? 'Exists' : 'Does not exist' });
        results.push({ test: 'DeviceMotionEvent Object', result: deviceMotionEvent ? 'Exists' : 'Does not exist' });
        
        // Check permission request function (iOS)
        if (deviceOrientationSupported && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          results.push({ test: 'Permission Request Function', result: 'Available (iOS)' });
        } else {
          results.push({ test: 'Permission Request Function', result: 'Not Available' });
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        results.push({ test: 'Event Object Check', result: `Error: ${errorMessage}` });
      }
      
      setDiagnostics({
        userAgent,
        deviceOrientationSupported,
        deviceMotionSupported,
        deviceOrientationEvent: typeof DeviceOrientationEvent !== 'undefined',
        deviceMotionEvent: typeof DeviceMotionEvent !== 'undefined',
        permissionsApi,
        secureContext,
        touchSupport
      });
      
      setTestResults(results);
    };
    
    if (typeof window !== 'undefined') {
      runDiagnostics();
    }
  }, []);

  const runLiveTest = () => {
    setIsTesting(true);
    const liveResults = [...testResults];
    
    // Try to add event listeners and see if we get data
    let orientationReceived = false;
    let motionReceived = false;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!orientationReceived) {
        orientationReceived = true;
        liveResults.push({ 
          test: 'Device Orientation Event', 
          result: `Received - Alpha: ${event.alpha?.toFixed(2)}, Beta: ${event.beta?.toFixed(2)}, Gamma: ${event.gamma?.toFixed(2)}` 
        });
        setTestResults([...liveResults]);
      }
    };
    
    const handleMotion = (event: DeviceMotionEvent) => {
      if (!motionReceived) {
        motionReceived = true;
        const acc = event.acceleration;
        const accG = event.accelerationIncludingGravity;
        liveResults.push({ 
          test: 'Device Motion Event', 
          result: `Received - Acc X: ${acc?.x?.toFixed(2)}, Y: ${acc?.y?.toFixed(2)}, Z: ${acc?.z?.toFixed(2)}` 
        });
        setTestResults([...liveResults]);
      }
    };
    
    // Add listeners
    if (diagnostics.deviceOrientationSupported) {
      window.addEventListener('deviceorientation', handleOrientation);
      liveResults.push({ test: 'Added Orientation Listener', result: 'Success' });
    }
    
    if (diagnostics.deviceMotionSupported) {
      window.addEventListener('devicemotion', handleMotion);
      liveResults.push({ test: 'Added Motion Listener', result: 'Success' });
    }
    
    // Remove listeners after 5 seconds
    setTimeout(() => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      if (!orientationReceived) {
        liveResults.push({ test: 'Orientation Events', result: 'No events received (timeout)' });
      }
      if (!motionReceived) {
        liveResults.push({ test: 'Motion Events', result: 'No events received (timeout)' });
      }
      setTestResults([...liveResults]);
      setIsTesting(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sensor Diagnostics</h1>
          <p className="mt-2 text-gray-600">Diagnostic tool for device sensor capabilities</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-xl font-bold text-white">Device Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800 font-medium">Orientation API</div>
                <div className={`text-lg font-bold ${diagnostics.deviceOrientationSupported ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.deviceOrientationSupported ? 'Supported' : 'Not Supported'}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-800 font-medium">Motion API</div>
                <div className={`text-lg font-bold ${diagnostics.deviceMotionSupported ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.deviceMotionSupported ? 'Supported' : 'Not Supported'}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-800 font-medium">Secure Context</div>
                <div className={`text-lg font-bold ${diagnostics.secureContext ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.secureContext ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm text-amber-800 font-medium">Touch Support</div>
                <div className={`text-lg font-bold ${diagnostics.touchSupport ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.touchSupport ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
            
            <button
              onClick={runLiveTest}
              disabled={isTesting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing... (5s)
                </>
              ) : (
                'Run Live Sensor Test'
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600">
            <h2 className="text-xl font-bold text-white">Diagnostic Results</h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.test}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Troubleshooting Tips</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>If APIs show as {'"'}Not Available{'"'}, try a different browser</li>
                  <li>If {'"'}Secure Context{'"'} shows {'"'}No{'"'}, access via HTTPS or localhost</li>
                  <li>Some browsers require user interaction before sensor events work</li>
                  <li>Mobile devices generally have better sensor support than desktops</li>
                  <li>iOS requires permission requests to be triggered by user actions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}