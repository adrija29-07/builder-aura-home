import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";

interface TTSSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
}

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ttsSettings, setTTSSettings] = useState<TTSSettings>({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !ttsSettings.voice) {
        setTTSSettings(prev => ({ ...prev, voice: voices[0].name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [ttsSettings.voice]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);
    
    if (command.includes('read code') || command.includes('start reading')) {
      readCode();
    } else if (command.includes('stop reading') || command.includes('stop')) {
      stopReading();
    } else if (command.includes('pause')) {
      pauseReading();
    } else if (command.includes('resume') || command.includes('continue')) {
      resumeReading();
    } else if (command.includes('next line')) {
      readNextLine();
    } else if (command.includes('previous line')) {
      readPreviousLine();
    } else if (command.includes('explain code')) {
      explainCode();
    } else if (command.includes('check errors')) {
      checkErrors();
    } else if (command.includes('clear code')) {
      clearCode();
    } else if (command.includes('repeat')) {
      repeatLastSpoken();
    }
  };

  // Text-to-Speech functions
  const speak = (text: string, onEnd?: () => void) => {
    if (!text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(voice => voice.name === ttsSettings.voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = ttsSettings.rate;
    utterance.pitch = ttsSettings.pitch;
    utterance.volume = ttsSettings.volume;

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsReading(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setLastSpokenText(text);
  };

  const readCode = () => {
    if (!code.trim()) {
      speak("No code to read. Please enter or upload some code first.");
      return;
    }

    setIsReading(true);
    setCurrentLine(0);
    
    // Process code for better reading
    const lines = code.split('\n');
    const processedCode = lines.map((line, index) => {
      if (line.trim() === '') return `Line ${index + 1}: Empty line`;
      
      // Add line numbers and process special characters
      let processedLine = `Line ${index + 1}: ` + line
        .replace(/\{/g, ' opening brace ')
        .replace(/\}/g, ' closing brace ')
        .replace(/\[/g, ' opening bracket ')
        .replace(/\]/g, ' closing bracket ')
        .replace(/\(/g, ' opening parenthesis ')
        .replace(/\)/g, ' closing parenthesis ')
        .replace(/;/g, ' semicolon ')
        .replace(/:/g, ' colon ')
        .replace(/,/g, ' comma ')
        .replace(/\./g, ' dot ')
        .replace(/=/g, ' equals ')
        .replace(/\+/g, ' plus ')
        .replace(/-/g, ' minus ')
        .replace(/\*/g, ' asterisk ')
        .replace(/\//g, ' slash ')
        .replace(/</g, ' less than ')
        .replace(/>/g, ' greater than ');
      
      return processedLine;
    }).join('. ');

    speak(processedCode);
  };

  const readCurrentLine = () => {
    const lines = code.split('\n');
    if (currentLine < lines.length) {
      const line = lines[currentLine];
      const announcement = line.trim() === '' 
        ? `Line ${currentLine + 1}: Empty line`
        : `Line ${currentLine + 1}: ${line}`;
      speak(announcement);
    }
  };

  const readNextLine = () => {
    const lines = code.split('\n');
    if (currentLine < lines.length - 1) {
      setCurrentLine(prev => prev + 1);
      setTimeout(() => readCurrentLine(), 100);
    } else {
      speak("End of code reached.");
    }
  };

  const readPreviousLine = () => {
    if (currentLine > 0) {
      setCurrentLine(prev => prev - 1);
      setTimeout(() => readCurrentLine(), 100);
    } else {
      speak("Already at the beginning of the code.");
    }
  };

  const pauseReading = () => {
    if (isReading && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (isReading && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const repeatLastSpoken = () => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    } else {
      speak("Nothing to repeat.");
    }
  };

  // Code analysis functions
  const explainCode = () => {
    if (!code.trim()) {
      speak("No code to explain. Please enter or upload some code first.");
      return;
    }

    // Basic code structure analysis
    const lines = code.split('\n').filter(line => line.trim() !== '');
    let explanation = `This code has ${lines.length} non-empty lines. `;

    // Check for common patterns
    const functions = code.match(/function\s+\w+|def\s+\w+|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=/g);
    if (functions && functions.length > 0) {
      explanation += `It contains ${functions.length} function or variable declaration${functions.length > 1 ? 's' : ''}. `;
    }

    const loops = code.match(/for\s*\(|while\s*\(|for\s+\w+\s+in/g);
    if (loops && loops.length > 0) {
      explanation += `There are ${loops.length} loop${loops.length > 1 ? 's' : ''}. `;
    }

    const conditionals = code.match(/if\s*\(|else\s*if\s*\(|else\s*\{/g);
    if (conditionals && conditionals.length > 0) {
      explanation += `The code includes ${conditionals.length} conditional statement${conditionals.length > 1 ? 's' : ''}. `;
    }

    speak(explanation || "I can analyze the basic structure of the code for you.");
  };

  const checkErrors = () => {
    if (!code.trim()) {
      speak("No code to check. Please enter or upload some code first.");
      return;
    }

    // Basic syntax checking
    const lines = code.split('\n');
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') return;

      // Check for common syntax issues
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;

      if (openBraces !== closeBraces) {
        errors.push(`Line ${index + 1}: Mismatched braces`);
      }
      if (openParens !== closeParens) {
        errors.push(`Line ${index + 1}: Mismatched parentheses`);
      }
    });

    if (errors.length > 0) {
      speak(`Found ${errors.length} potential error${errors.length > 1 ? 's' : ''}: ${errors.join(', ')}`);
    } else {
      speak("No obvious syntax errors detected in the code.");
    }
  };

  // Voice recognition toggle
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

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
      // Alt + R to read code
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        readCode();
      }
      // Alt + S to stop reading
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        stopReading();
      }
      // Alt + P to pause/resume
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        if (isPaused) resumeReading();
        else pauseReading();
      }
      // Alt + V to toggle voice commands
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        speak(`File ${file.name} loaded successfully. ${content.split('\n').length} lines of code.`);
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
        speak(`File ${file.name} loaded successfully via drag and drop. ${content.split('\n').length} lines of code.`);
      };
      reader.readAsText(file);
    }
  };

  const clearCode = () => {
    setCode("");
    setCurrentLine(0);
    textareaRef.current?.focus();
    speak("Code cleared.");
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      textareaRef.current?.focus();
      speak(`Code pasted from clipboard. ${text.split('\n').length} lines of code.`);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      speak("Failed to paste from clipboard. Please try again.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      speak("Code copied to clipboard.");
    } catch (err) {
      console.error('Failed to copy to clipboard: ', err);
      speak("Failed to copy to clipboard. Please try again.");
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
            Upload, edit, and listen to your code with full voice controls
          </p>
        </header>

        {/* Voice Controls */}
        <Card className={`p-6 mb-6 ${themeClasses}`}>
          <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Voice Controls
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Button
              onClick={readCode}
              disabled={!code.trim() || isReading}
              className={`${buttonThemeClasses}`}
              aria-label="Read code aloud"
            >
              🔊 Read Code
            </Button>
            <Button
              onClick={isPaused ? resumeReading : pauseReading}
              disabled={!isReading}
              className={`${buttonThemeClasses}`}
              aria-label={isPaused ? "Resume reading" : "Pause reading"}
            >
              {isPaused ? '▶️' : '⏸️'} {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={stopReading}
              disabled={!isReading}
              className={`${buttonThemeClasses}`}
              aria-label="Stop reading"
            >
              ⏹️ Stop
            </Button>
            <Button
              onClick={explainCode}
              disabled={!code.trim()}
              className={`${buttonThemeClasses}`}
              aria-label="Explain code structure"
            >
              💡 Explain
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={checkErrors}
              disabled={!code.trim()}
              className={`${buttonThemeClasses}`}
              aria-label="Check for syntax errors"
            >
              🔍 Check Errors
            </Button>
            <Button
              onClick={toggleListening}
              className={`${buttonThemeClasses} ${isListening ? 'bg-red-500 text-white' : ''}`}
              aria-label={`${isListening ? 'Stop' : 'Start'} voice commands`}
            >
              🎤 {isListening ? 'Stop Listening' : 'Voice Commands'}
            </Button>
            <Button
              onClick={repeatLastSpoken}
              disabled={!lastSpokenText}
              className={`${buttonThemeClasses}`}
              aria-label="Repeat last spoken text"
            >
              🔄 Repeat
            </Button>
          </div>

          {isListening && (
            <div className={`mt-4 p-3 rounded border ${highContrast ? 'bg-yellow-900 border-yellow-500' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${highContrast ? 'text-yellow-200' : 'text-blue-700'}`}>
                🎤 Listening for voice commands... Try saying: "read code", "stop reading", "explain code", "check errors"
              </p>
            </div>
          )}
        </Card>

        {/* TTS Settings */}
        <Card className={`p-6 mb-6 ${themeClasses}`}>
          <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Voice Settings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                Voice
              </Label>
              <Select value={ttsSettings.voice} onValueChange={(value) => setTTSSettings(prev => ({...prev, voice: value}))}>
                <SelectTrigger className={themeClasses}>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                Speed: {ttsSettings.rate.toFixed(1)}x
              </Label>
              <Slider
                value={[ttsSettings.rate]}
                onValueChange={(value) => setTTSSettings(prev => ({...prev, rate: value[0]}))}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                Pitch: {ttsSettings.pitch.toFixed(1)}
              </Label>
              <Slider
                value={[ttsSettings.pitch]}
                onValueChange={(value) => setTTSSettings(prev => ({...prev, pitch: value[0]}))}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                Volume: {Math.round(ttsSettings.volume * 100)}%
              </Label>
              <Slider
                value={[ttsSettings.volume]}
                onValueChange={(value) => setTTSSettings(prev => ({...prev, volume: value[0]}))}
                min={0}
                max={1}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        </Card>

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
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + R</kbd> Read code</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + S</kbd> Stop reading</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + P</kbd> Pause/Resume</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + V</kbd> Toggle voice commands</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + F</kbd> Focus code editor</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + H</kbd> Toggle high contrast</div>
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
                {isReading && (
                  <span className="ml-4">
                    🔊 Reading{isPaused ? ' (Paused)' : ''}...
                  </span>
                )}
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
              Use Alt+R to read the code aloud, or enable voice commands with Alt+V.
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
              <Button
                onClick={() => speak(`Code analysis: ${code.split('\n').length} total lines, ${code.length} characters, ${code.split('\n').filter(line => line.trim().length > 0).length} non-empty lines.`)}
                variant="outline"
                size="sm"
                className={`mt-4 ${buttonThemeClasses}`}
                aria-label="Read code analysis aloud"
              >
                🔊 Read Analysis
              </Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
