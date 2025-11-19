'use client';

import { useState, useEffect } from 'react';

export default function MatrixControl() {
  const [esp32IP, setEsp32IP] = useState('192.168.1.100');
  const [text, setText] = useState('HELLO');
  const [pattern, setPattern] = useState([
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
  ]);
  const [matrixStatus, setMatrixStatus] = useState({ status: 'unknown', type: 'unknown' });
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Check matrix status
  const checkStatus = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://${esp32IP}/api/matrix/status`);
      if (response.ok) {
        const data = await response.json();
        setMatrixStatus(data);
        setIsConnected(data.status === 'connected');
        setMessage(`Matrix status: ${data.status}`);
      } else {
        throw new Error('Failed to get matrix status');
      }
    } catch (error) {
      console.error('Error checking matrix status:', error);
      setIsConnected(false);
      setMessage('Error: Could not connect to ESP32 device');
    } finally {
      setIsLoading(false);
    }
  };

  // Display text on matrix
  const displayText = async () => {
    if (!text.trim()) {
      setMessage('Please enter some text');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://${esp32IP}/api/matrix/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.toUpperCase() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('Text displayed successfully');
        } else {
          setMessage(`Error: ${data.message || 'Failed to display text'}`);
        }
      } else {
        throw new Error('Failed to send text to matrix');
      }
    } catch (error) {
      console.error('Error displaying text:', error);
      setMessage('Error: Could not send text to ESP32 device');
    } finally {
      setIsLoading(false);
    }
  };

  // Display pattern on matrix
  const displayPattern = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://${esp32IP}/api/matrix/pattern`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('Pattern displayed successfully');
        } else {
          setMessage(`Error: ${data.message || 'Failed to display pattern'}`);
        }
      } else {
        throw new Error('Failed to send pattern to matrix');
      }
    } catch (error) {
      console.error('Error displaying pattern:', error);
      setMessage('Error: Could not send pattern to ESP32 device');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear matrix
  const clearMatrix = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://${esp32IP}/api/matrix/clear`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('Matrix cleared successfully');
        } else {
          setMessage(`Error: ${data.message || 'Failed to clear matrix'}`);
        }
      } else {
        throw new Error('Failed to clear matrix');
      }
    } catch (error) {
      console.error('Error clearing matrix:', error);
      setMessage('Error: Could not clear ESP32 device');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle LED in pattern
  const toggleLED = (row: number, col: number) => {
    const newPattern = [...pattern];
    newPattern[row][col] = newPattern[row][col] === 0 ? 1 : 0;
    setPattern(newPattern);
  };

  // Predefined patterns
  const smileyPattern = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0]
  ];

  const heartPattern = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const loadPattern = (newPattern: number[][]) => {
    setPattern(newPattern);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MAX7219 8x8 LED Matrix Control</h1>
          <p className="mt-2 text-gray-600">Control your ESP32-connected LED matrix</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-xl font-bold text-white">Device Configuration</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">ESP32 IP Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={esp32IP}
                  onChange={(e) => setEsp32IP(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 192.168.1.100"
                />
                <button
                  onClick={checkStatus}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  {isLoading ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800 font-medium">Connection Status</div>
                <div className={`text-lg font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-800 font-medium">Matrix Type</div>
                <div className="text-lg font-bold text-purple-600">
                  {matrixStatus.type === 'unknown' ? 'Not checked' : matrixStatus.type}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p className="text-center">{message}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Display Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
              <h2 className="text-xl font-bold text-white">Text Display</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Text to Display</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter text (4 chars max)"
                  maxLength={4}
                />
                <p className="mt-1 text-sm text-gray-500">Maximum 4 characters</p>
              </div>
              
              <button
                onClick={displayText}
                disabled={isLoading || !isConnected}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                {isLoading ? 'Sending...' : 'Display Text'}
              </button>
            </div>
          </div>
          
          {/* Pattern Display Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600">
              <h2 className="text-xl font-bold text-white">Pattern Display</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Pattern</label>
                <div className="inline-grid grid-cols-8 gap-1 p-2 bg-gray-100 rounded-lg">
                  {pattern.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => toggleLED(rowIndex, colIndex)}
                        className={`w-6 h-6 cursor-pointer rounded-sm border ${cell === 1 ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'}`}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Predefined Patterns</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadPattern(smileyPattern)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-3 rounded-lg transition duration-300 text-sm"
                  >
                    Smiley
                  </button>
                  <button
                    onClick={() => loadPattern(heartPattern)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-3 rounded-lg transition duration-300 text-sm"
                  >
                    Heart
                  </button>
                  <button
                    onClick={() => loadPattern(Array(8).fill(Array(8).fill(0)))}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-3 rounded-lg transition duration-300 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <button
                onClick={displayPattern}
                disabled={isLoading || !isConnected}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                {isLoading ? 'Sending...' : 'Display Pattern'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Clear Button */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <button
              onClick={clearMatrix}
              disabled={isLoading || !isConnected}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              {isLoading ? 'Clearing...' : 'Clear Matrix'}
            </button>
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600">
            <h2 className="text-xl font-bold text-white">API Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Available Endpoints</h3>
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  <li><span className="font-mono">GET /api/matrix/health</span> - Check if matrix is available</li>
                  <li><span className="font-mono">GET /api/matrix/status</span> - Get detailed status</li>
                  <li><span className="font-mono">POST /api/matrix/text</span> - Display text</li>
                  <li><span className="font-mono">POST /api/matrix/pattern</span> - Display custom pattern</li>
                  <li><span className="font-mono">POST /api/matrix/clear</span> - Clear the matrix</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Usage Tips</h3>
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  <li>Ensure ESP32 is connected to the same network</li>
                  <li>Enter the correct IP address of your ESP32 device</li>
                  <li>Click &quot;Check Status&quot; to verify connection</li>
                  <li>Text is limited to 4 characters maximum</li>
                  <li>Patterns are 8x8 grids of 1s (on) and 0s (off)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}