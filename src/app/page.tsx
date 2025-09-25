'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, Check, Github, Sparkles } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, size: qrSize, errorCorrectionLevel: 'M' })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setQrDataUrl(data.qrDataUrl);
      } else {
        throw new Error(data.error || 'QR code generation failed');
      }
    } catch (error) {
      console.error('QR generation failed:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QR Generator
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Free & Open Source</p>
              </div>
            </div>
            <a
              href="https://github.com/Dark-Hunter-TR/QRCode-Generator-Web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Free QR Code Generator
            </Badge>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fast and Easy
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}QR Kod{' '}
            </span>
            Generate
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create QR codes instantly for URLs, text, or any data you need. 
            Completely free, open-source, and privacy-focused.
          </p>
        </div>

        {/* Main Generator */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>QR Code Generator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label htmlFor="qr-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL or Text
                </label>
                <div className="relative">
                  <textarea
                    id="qr-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com or enter your text..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             resize-none transition-all duration-200"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {text.length}/500
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  QR Code Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[128, 256, 512, 1024].map((size) => (
                    <button
                      key={size}
                      onClick={() => setQrSize(size)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        qrSize === size
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateQR}
                disabled={!text.trim() || isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-700 hover:to-purple-700 text-white border-0
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5" />
                    <span>QR Code Generator</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-600" />
                <span>Preview & Download</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {qrDataUrl ? (
                <div className="space-y-6">
                  {/* QR Preview */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <img
                        src={qrDataUrl}
                        alt="Generated QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={downloadQR}
                      className="h-12 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="h-12"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <QrCode className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your QR code will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why QR Generator?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast & Easy</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Create QR codes instantly. No complex settings.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Completely Free</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Create unlimited QR codes. No fees or registration required.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Open Source</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Code is open source. Safe and transparent.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              ❤️ developed as open source
            </p>
            <p className="text-sm">
              This project is licensed under MIT.{' '}
              <a
                href="https://github.com/Dark-Hunter-TR/QRCode-Generator-Web"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
