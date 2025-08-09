import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Index() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  // Load saved preferences
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '18');
    setHighContrast(savedContrast);
    setFontSize(savedFontSize);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('fontSize', fontSize.toString());
  }, [highContrast, fontSize]);

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
        setFontSize(prev => Math.max(prev - 2, 14));
      }
      // Alt + H to toggle high contrast
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setHighContrast(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themeClasses = highContrast 
    ? "bg-black text-yellow-300" 
    : "bg-gray-50 text-gray-900";

  const cardThemeClasses = highContrast
    ? "bg-gray-900 text-yellow-300 border-yellow-500"
    : "bg-white text-gray-900 border-gray-200";

  const buttonThemeClasses = highContrast
    ? "bg-yellow-400 text-black hover:bg-yellow-300 border-yellow-400"
    : "";

  return (
    <div className={`min-h-screen transition-colors ${themeClasses}`} style={{ fontSize: `${fontSize}px` }}>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 text-base"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-4xl" role="img" aria-label="Accessibility symbol">♿</span>
            <span className="text-4xl" role="img" aria-label="Computer">💻</span>
            <span className="text-4xl" role="img" aria-label="Speech bubble">💬</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className={highContrast ? "text-yellow-300" : "text-blue-600"}>
              Accessible Coding 
            </span>
            <br />
            <span className={highContrast ? "text-yellow-200" : "text-gray-700"}>
              Website
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-4xl mx-auto">
            Helping visually impaired developers code with ease through voice guidance, 
            high contrast interfaces, and intelligent code assistance.
          </p>

          {/* Accessibility Controls */}
          <Card className={`p-6 mb-8 ${cardThemeClasses}`}>
            <h2 className="text-xl font-semibold mb-4">Quick Accessibility Settings</h2>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <span>Font Size:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
                  aria-label="Decrease font size"
                  className={buttonThemeClasses}
                >
                  A-
                </Button>
                <span className="px-2 font-mono">{fontSize}px</span>
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
              <Button
                variant="outline"
                onClick={() => setHighContrast(prev => !prev)}
                aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
                className={buttonThemeClasses}
              >
                {highContrast ? '🌞' : '🌙'} High Contrast
              </Button>
            </div>
          </Card>
        </header>

        <main id="main-content">
          {/* Main Toolbar */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Main Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`p-6 ${cardThemeClasses} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className="text-4xl mb-4" role="img" aria-label="Upload code">📁</div>
                  <h3 className="text-xl font-semibold mb-3">Upload Code</h3>
                  <p className="mb-4">Upload or paste your code files for analysis and voice reading</p>
                  <Link to="/editor">
                    <Button className={`w-full text-lg py-3 ${buttonThemeClasses}`}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className="text-4xl mb-4" role="img" aria-label="Read code aloud">🔊</div>
                  <h3 className="text-xl font-semibold mb-3">Read Code</h3>
                  <p className="mb-4">Listen to your code being read aloud with smart pronunciation</p>
                  <Link to="/editor">
                    <Button className={`w-full text-lg py-3 ${buttonThemeClasses}`}>
                      Read Code
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className="text-4xl mb-4" role="img" aria-label="Explain code">💡</div>
                  <h3 className="text-xl font-semibold mb-3">Explain Code</h3>
                  <p className="mb-4">Get plain-language explanations of code structure and logic</p>
                  <Link to="/editor">
                    <Button className={`w-full text-lg py-3 ${buttonThemeClasses}`}>
                      Explain Code
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className="text-4xl mb-4" role="img" aria-label="Check errors">🔍</div>
                  <h3 className="text-xl font-semibold mb-3">Check Errors</h3>
                  <p className="mb-4">Find and hear about syntax errors and potential issues</p>
                  <Link to="/editor">
                    <Button className={`w-full text-lg py-3 ${buttonThemeClasses}`}>
                      Check Errors
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Accessibility Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="Voice">🎤</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Voice Navigation</h3>
                    <p>Control the interface with voice commands like "read next line" or "explain function"</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="High contrast">🌓</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">High Contrast Mode</h3>
                    <p>Switch to high contrast themes for better visibility and reduced eye strain</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="Large text">🔤</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Adjustable Font Size</h3>
                    <p>Increase text size for better readability, with support for very large fonts</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="Keyboard">⌨️</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
                    <p>Full keyboard support with logical tab order and customizable shortcuts</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="Screen reader">📖</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Screen Reader Friendly</h3>
                    <p>Optimized for NVDA, JAWS, VoiceOver and other assistive technologies</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${cardThemeClasses}`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl" role="img" aria-label="Error detection">⚠️</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Audio Error Alerts</h3>
                    <p>Hear about syntax errors and code issues with clear, spoken explanations</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Keyboard Shortcuts Help */}
          <section>
            <Card className={`p-6 ${cardThemeClasses}`}>
              <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">Font Size</h3>
                  <ul className="space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-gray-200 rounded text-black">Ctrl/Cmd + =</kbd> Increase font size</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-200 rounded text-black">Ctrl/Cmd + -</kbd> Decrease font size</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Accessibility</h3>
                  <ul className="space-y-1">
                    <li>• <kbd className="px-2 py-1 bg-gray-200 rounded text-black">Alt + H</kbd> Toggle high contrast</li>
                    <li>• <kbd className="px-2 py-1 bg-gray-200 rounded text-black">Tab</kbd> Navigate between elements</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className={`border-t pt-8 ${highContrast ? 'border-yellow-600' : 'border-gray-300'}`}>
            <p className="mb-4">
              Built with accessibility in mind for the visually impaired developer community
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#accessibility" className={`hover:underline ${highContrast ? 'text-yellow-200' : 'text-blue-600'}`}>
                Accessibility Guide
              </a>
              <a href="#contact" className={`hover:underline ${highContrast ? 'text-yellow-200' : 'text-blue-600'}`}>
                Contact Support
              </a>
              <a href="#help" className={`hover:underline ${highContrast ? 'text-yellow-200' : 'text-blue-600'}`}>
                Help & Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
