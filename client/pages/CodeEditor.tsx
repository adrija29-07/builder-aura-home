import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + = to increase font size
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        setFontSize(prev => Math.min(prev + 2, 32));
      }
      // Ctrl/Cmd + - to decrease font size
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setFontSize(prev => Math.max(prev - 2, 12));
      }
      // Ctrl/Cmd + 0 to reset font size
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setFontSize(16);
      }
      // Alt + H to toggle high contrast
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setHighContrast(prev => !prev);
      }
      // Alt + F to focus code editor
      if (e.altKey && e.key === 'f') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const clearCode = () => {
    setCode("");
    textareaRef.current?.focus();
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      textareaRef.current?.focus();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard: ', err);
    }
  };

  const themeClasses = highContrast 
    ? "bg-black text-yellow-300 border-yellow-300" 
    : "bg-white text-black border-gray-300";

  const buttonThemeClasses = highContrast
    ? "bg-yellow-300 text-black hover:bg-yellow-400 border-yellow-300"
    : "";

  return (
    <div className={`min-h-screen p-4 transition-colors ${highContrast ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Accessible Code Editor
          </h1>
          <p className={`text-lg ${highContrast ? 'text-yellow-200' : 'text-gray-600'}`}>
            Phase 1: Upload, Paste, and Edit Code with Full Accessibility
          </p>
        </header>

        {/* Accessibility Controls */}
        <Card className={`p-6 mb-6 ${themeClasses}`}>
          <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Accessibility Settings
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className={highContrast ? 'text-yellow-200' : 'text-gray-700'}>
                Font Size:
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}
                  aria-label="Decrease font size"
                  className={buttonThemeClasses}
                >
                  A-
                </Button>
                <span className={`text-sm px-2 ${highContrast ? 'text-yellow-200' : 'text-gray-600'}`}>
                  {fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(prev => Math.min(prev + 2, 32))}
                  aria-label="Increase font size"
                  className={buttonThemeClasses}
                >
                  A+
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setHighContrast(prev => !prev)}
              aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
              className={buttonThemeClasses}
            >
              {highContrast ? '🌞' : '🌙'} High Contrast
            </Button>
          </div>
          
          {/* Keyboard shortcuts help */}
          <details className="mt-4">
            <summary className={`cursor-pointer font-medium ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
              Keyboard Shortcuts
            </summary>
            <div className={`mt-2 text-sm space-y-1 ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + =</kbd> Increase font size</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + -</kbd> Decrease font size</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + 0</kbd> Reset font size</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + H</kbd> Toggle high contrast</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + F</kbd> Focus code editor</div>
            </div>
          </details>
        </Card>

        <main id="main-content">
          {/* File Upload Section */}
          <Card className={`p-6 mb-6 ${themeClasses}`}>
            <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
              Code Input Methods
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload" className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                  Upload File
                </Label>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-describedby="file-upload-desc"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className={`w-full ${buttonThemeClasses}`}
                  aria-describedby="file-upload-desc"
                >
                  📁 Choose File
                </Button>
                <p id="file-upload-desc" className={`text-xs mt-1 ${highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
                  Supports: .js, .jsx, .ts, .tsx, .py, .html, .css, .json, .txt
                </p>
              </div>

              {/* Clipboard Paste */}
              <div>
                <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                  From Clipboard
                </Label>
                <Button
                  onClick={pasteFromClipboard}
                  variant="outline"
                  className={`w-full ${buttonThemeClasses}`}
                  aria-label="Paste code from clipboard"
                >
                  📋 Paste Code
                </Button>
                <p className={`text-xs mt-1 ${highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
                  Paste code from your clipboard
                </p>
              </div>

              {/* Clear/Copy Actions */}
              <div>
                <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                  Actions
                </Label>
                <div className="space-y-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className={`w-full ${buttonThemeClasses}`}
                    disabled={!code}
                    aria-label="Copy code to clipboard"
                  >
                    📄 Copy
                  </Button>
                  <Button
                    onClick={clearCode}
                    variant="outline"
                    size="sm"
                    className={`w-full ${buttonThemeClasses}`}
                    disabled={!code}
                    aria-label="Clear all code"
                  >
                    🗑️ Clear
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Drag & Drop Area + Code Editor */}
          <Card className={`p-6 ${themeClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
                Code Editor
              </h2>
              <div className={`text-sm ${highContrast ? 'text-yellow-200' : 'text-gray-600'}`}>
                Lines: {code.split('\n').length} | Characters: {code.length}
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg transition-colors ${
                isDragOver 
                  ? (highContrast ? 'border-yellow-300 bg-yellow-900/20' : 'border-blue-400 bg-blue-50')
                  : (highContrast ? 'border-yellow-500' : 'border-gray-300')
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragOver && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10`}>
                  <div className={`text-2xl font-semibold ${highContrast ? 'text-yellow-300' : 'text-white'}`}>
                    Drop your file here
                  </div>
                </div>
              )}

              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here, upload a file, or drag and drop a file into this area..."
                className={`min-h-[500px] font-mono resize-none border-0 focus:ring-0 ${themeClasses}`}
                style={{ fontSize: `${fontSize}px` }}
                aria-label="Code editor"
                aria-describedby="editor-instructions"
              />
            </div>

            <p id="editor-instructions" className={`text-sm mt-2 ${highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
              You can type directly, paste code, upload a file, or drag and drop files into the editor area.
            </p>
          </Card>

          {/* Status/Info Section */}
          {code && (
            <Card className={`p-4 mt-6 ${themeClasses}`}>
              <h3 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
                Code Analysis
              </h3>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${highContrast ? 'text-yellow-200' : 'text-gray-600'}`}>
                <div>
                  <span className="font-medium">Total Lines:</span> {code.split('\n').length}
                </div>
                <div>
                  <span className="font-medium">Characters:</span> {code.length}
                </div>
                <div>
                  <span className="font-medium">Words:</span> {code.split(/\s+/).filter(word => word.length > 0).length}
                </div>
                <div>
                  <span className="font-medium">Non-empty Lines:</span> {code.split('\n').filter(line => line.trim().length > 0).length}
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
