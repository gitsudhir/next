'use client';

import { useState, useEffect } from 'react';

export default function ToonVsJsonPage() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [toonData, setToonData] = useState<any>(null);
  const [jsonLoading, setJsonLoading] = useState(true);
  const [toonLoading, setToonLoading] = useState(true);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [toonError, setToonError] = useState<string | null>(null);
  const [jsonSize, setJsonSize] = useState<number | null>(null);
  const [toonSize, setToonSize] = useState<number | null>(null);

  useEffect(() => {
    // Fetch JSON data
    // When running locally, we can't access the deployed APIs due to CORS
    // In production, these will be relative paths that work correctly
    const jsonUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'https://www.sudhirkumar.in/api/cars' 
      : '/api/cars';
      
    fetch(jsonUrl)
      .then(response => {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          setJsonSize(parseInt(contentLength, 10));
        }
        return response.json();
      })
      .then(data => {
        setJsonData(data);
        setJsonLoading(false);
      })
      .catch(error => {
        setJsonError(`Failed to fetch JSON data: ${error.message}. Note: When running locally, CORS restrictions prevent accessing deployed APIs.`);
        setJsonLoading(false);
      });

    // Fetch TOON data
    const toonUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'https://www.sudhirkumar.in/api/toon/cars' 
      : '/api/toon/cars';
      
    fetch(toonUrl)
      .then(response => {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          setToonSize(parseInt(contentLength, 10));
        }
        return response.text();
      })
      .then(data => {
        setToonData(data);
        setToonLoading(false);
      })
      .catch(error => {
        setToonError(`Failed to fetch TOON data: ${error.message}. Note: When running locally, CORS restrictions prevent accessing deployed APIs.`);
        setToonLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">TOON vs JSON Comparison</h1>
          <p className="text-lg text-gray-600">
            Comparing traditional JSON with TOON (Token-Optimized Object Notation) for reduced token usage
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What is TOON?</h2>
          <p className="text-gray-600 mb-4">
            TOON (Token-Optimized Object Notation) is a data format designed to replace JSON when communicating with LLMs,
            reducing token usage by 30-60%. It achieves this by using shorter syntax while maintaining human readability.
          </p>
          <p className="text-gray-600">
            Learn more at: <a href="https://www.toontools.app/" className="text-blue-600 hover:underline">toontools.app</a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* JSON Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">JSON Response</h2>
            </div>
            <div className="p-4">
              {jsonLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : jsonError ? (
                <div className="text-red-500">Error: {jsonError}</div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="font-medium">API Endpoint:</span>{' '}
                    <span className="break-all">
                      /api/cars
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Deployed at: https://www.sudhirkumar.in/api/cars
                    </p>
                  </div>
                  <div className="border rounded p-3 bg-gray-50 max-h-96 overflow-auto">
                    <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
                  </div>
                  {jsonSize && (
                    <div className="mt-3 text-sm text-gray-600">
                      Size: <span className="font-medium">{jsonSize} bytes</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* TOON Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-500 text-white py-3 px-4">
              <h2 className="text-xl font-semibold">TOON Response</h2>
            </div>
            <div className="p-4">
              {toonLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : toonError ? (
                <div className="text-red-500">Error: {toonError}</div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="font-medium">API Endpoint:</span>{' '}
                    <span className="break-all">
                      /api/toon/cars
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Deployed at: https://www.sudhirkumar.in/api/toon/cars
                    </p>
                  </div>
                  <div className="border rounded p-3 bg-gray-50 max-h-96 overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap">{toonData}</pre>
                  </div>
                  {toonSize && (
                    <div className="mt-3 text-sm text-gray-600">
                      Size: <span className="font-medium">{toonSize} bytes</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comparison Analysis</h2>
          
          {jsonSize && toonSize && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-lg text-gray-800 mb-2">Size Reduction</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-600">{jsonSize} bytes</div>
                  <div className="text-gray-600">JSON Size</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-green-600">{toonSize} bytes</div>
                  <div className="text-gray-600">TOON Size</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(((jsonSize - toonSize) / jsonSize) * 100)}% smaller
                  </div>
                  <div className="text-gray-600">Reduction</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Benefits of TOON:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Reduces token usage by 30-60% when communicating with LLMs</li>
                <li>Maintains human readability while using shorter syntax</li>
                <li>Faster transmission due to smaller payload size</li>
                <li>Lower bandwidth usage</li>
                <li>Cost-effective for high-volume API interactions with LLMs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Use Cases:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>LLM API integrations where token costs matter</li>
                <li>High-frequency data exchanges with AI services</li>
                <li>Mobile applications with limited bandwidth</li>
                <li>IoT devices with constrained resources</li>
                <li>Any scenario where payload size impacts performance or cost</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}