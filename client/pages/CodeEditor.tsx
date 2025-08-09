import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { CodeAnalysisResponse } from "@shared/api";
import "../types/speech";

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
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isDictating, setIsDictating] = useState(false);
  const [dictationText, setDictationText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

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
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (isDictating) {
          // Handle dictation mode
          setDictationText(interimTranscript);
          if (finalTranscript) {
            handleDictation(finalTranscript);
          }
        } else if (finalTranscript) {
          // Handle voice commands
          handleVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsDictating(false);
        setDictationText('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isDictating]);

  // Handle voice dictation
  const handleDictation = (transcript: string) => {
    let processedText = transcript;

    // Convert speech to code-friendly format
    processedText = processedText
      .replace(/\bopen paren\b/g, '(')
      .replace(/\bclose paren\b/g, ')')
      .replace(/\bopen bracket\b/g, '[')
      .replace(/\bclose bracket\b/g, ']')
      .replace(/\bopen brace\b/g, '{')
      .replace(/\bclose brace\b/g, '}')
      .replace(/\bsemicolon\b/g, ';')
      .replace(/\bcomma\b/g, ',')
      .replace(/\bdot\b/g, '.')
      .replace(/\bequals\b/g, '=')
      .replace(/\bplus\b/g, '+')
      .replace(/\bminus\b/g, '-')
      .replace(/\basterisk\b/g, '*')
      .replace(/\bslash\b/g, '/')
      .replace(/\bless than\b/g, '<')
      .replace(/\bgreater than\b/g, '>')
      .replace(/\bquote\b/g, '"')
      .replace(/\bsingle quote\b/g, "'")
      .replace(/\bnew line\b/g, '\n')
      .replace(/\btab\b/g, '\t')
      .replace(/\bfunction\b/g, 'function')
      .replace(/\bconst\b/g, 'const')
      .replace(/\blet\b/g, 'let')
      .replace(/\bvar\b/g, 'var')
      .replace(/\bif\b/g, 'if')
      .replace(/\belse\b/g, 'else')
      .replace(/\bfor\b/g, 'for')
      .replace(/\bwhile\b/g, 'while')
      .replace(/\breturn\b/g, 'return');

    // Add the processed text to the code
    setCode(prev => prev + processedText + ' ');
    setDictationText('');
  };

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);

    if (command.includes('start dictation') || command.includes('begin dictation')) {
      startDictation();
    } else if (command.includes('stop dictation') || command.includes('end dictation')) {
      stopDictation();
    } else if (command.includes('read code') || command.includes('start reading')) {
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

  // Enhanced code analysis with backend API
  const analyzeCodeWithAPI = async () => {
    if (!code.trim()) {
      speak("No code to analyze. Please enter or upload some code first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/code-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const analysis: CodeAnalysisResponse = await response.json();
      setCodeAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('Code analysis error:', error);
      speak("Sorry, I couldn't analyze the code. Please try again.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Code analysis functions
  const explainCode = async () => {
    const analysis = await analyzeCodeWithAPI();
    if (analysis) {
      const explanation = analysis.readableExplanation;
      speak(explanation);

      // Provide more detailed explanation if requested
      setTimeout(() => {
        if (analysis.structure.functions.length > 0) {
          const functionDetails = analysis.structure.functions
            .map(f => `Function ${f.name} on line ${f.line}`)
            .join(', ');
          speak(`Functions found: ${functionDetails}`);
        }

        if (analysis.errors.length > 0) {
          speak(`I also found ${analysis.errors.length} potential issue${analysis.errors.length > 1 ? 's' : ''}.`);
        }
      }, 3000);
    }
  };

  const checkErrors = async () => {
    const analysis = await analyzeCodeWithAPI();
    if (analysis) {
      if (analysis.errors.length > 0) {
        const errorSummary = `Found ${analysis.errors.length} potential error${analysis.errors.length > 1 ? 's' : ''}.`;
        speak(errorSummary);

        // Read first few errors in detail
        const detailedErrors = analysis.errors.slice(0, 3).map(error =>
          `Line ${error.line}: ${error.message}`
        ).join('. ');

        setTimeout(() => {
          speak(detailedErrors);
        }, 2000);
      } else {
        speak("No syntax errors detected in the code. Great job!");
      }
    }
  };

  // Voice recognition toggle
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsDictating(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Voice dictation controls
  const startDictation = () => {
    if (!isListening) {
      recognitionRef.current?.start();
      setIsListening(true);
    }
    setIsDictating(true);
    speak("Dictation mode started. Speak your code and I'll convert it to text.");
  };

  const stopDictation = () => {
    setIsDictating(false);
    setDictationText('');
    speak("Dictation mode stopped.");
  };

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
    } else {
      startDictation();
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
      // Alt + E to explain code
      if (e.altKey && e.key === 'e') {
        e.preventDefault();
        explainCode();
      }
      // Alt + C to check errors
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        checkErrors();
      }
      // Alt + D to toggle dictation
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDictation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  // Auto-detect language from file extension
  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'javascript';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const detectedLanguage = detectLanguage(file.name);
      setLanguage(detectedLanguage);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        speak(`File ${file.name} loaded successfully as ${detectedLanguage}. ${content.split('\n').length} lines of code.`);
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
      const detectedLanguage = detectLanguage(file.name);
      setLanguage(detectedLanguage);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        speak(`File ${file.name} loaded successfully via drag and drop as ${detectedLanguage}. ${content.split('\n').length} lines of code.`);
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
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        speak("Clipboard API not available. Please paste manually with Ctrl+V in the code editor.");
        textareaRef.current?.focus();
        return;
      }

      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setCode(text);
        textareaRef.current?.focus();
        speak(`Code pasted from clipboard. ${text.split('\n').length} lines of code.`);
      } else {
        speak("Clipboard is empty. Nothing to paste.");
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // Focus the textarea so user can paste manually
      textareaRef.current?.focus();
      speak("Clipboard access is restricted. Please paste manually with Ctrl+V or Cmd+V in the code editor.");
    }
  };

  const copyToClipboard = async () => {
    if (!code.trim()) {
      speak("No code to copy.");
      return;
    }

    try {
      // Method 1: Modern Clipboard API (if available and allowed)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        speak("Code copied to clipboard using modern API.");
        return;
      }

      // Method 2: Fallback to execCommand (deprecated but still works)
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);

      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        speak("Code copied to clipboard using fallback method.");
        return;
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard: ', err);

      // Method 3: Final fallback - select the text in the textarea for manual copy
      try {
        if (textareaRef.current) {
          textareaRef.current.select();
          textareaRef.current.setSelectionRange(0, 99999);
          speak("Code selected in editor. Press Ctrl+C or Cmd+C to copy manually.");
          return;
        }
      } catch (selectErr) {
        console.error('Failed to select text: ', selectErr);
      }

      // Last resort: inform user about manual copy
      speak("Clipboard access is restricted. Please select all text manually with Ctrl+A and copy with Ctrl+C.");
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
              disabled={!code.trim() || isAnalyzing}
              className={`${buttonThemeClasses}`}
              aria-label="Explain code structure"
            >
              💡 {isAnalyzing ? 'Analyzing...' : 'Explain'}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={checkErrors}
              disabled={!code.trim() || isAnalyzing}
              className={`${buttonThemeClasses}`}
              aria-label="Check for syntax errors"
            >
              🔍 {isAnalyzing ? 'Checking...' : 'Check Errors'}
            </Button>
            <Button
              onClick={toggleListening}
              className={`${buttonThemeClasses} ${isListening && !isDictating ? 'bg-red-500 text-white' : ''}`}
              aria-label={`${isListening && !isDictating ? 'Stop' : 'Start'} voice commands`}
            >
              🎤 {isListening && !isDictating ? 'Stop Listening' : 'Voice Commands'}
            </Button>
            <Button
              onClick={toggleDictation}
              className={`${buttonThemeClasses} ${isDictating ? 'bg-blue-500 text-white' : ''}`}
              aria-label={`${isDictating ? 'Stop' : 'Start'} voice dictation`}
            >
              ✍️ {isDictating ? 'Stop Dictation' : 'Voice Dictation'}
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

          {isListening && !isDictating && (
            <div className={`mt-4 p-3 rounded border ${highContrast ? 'bg-yellow-900 border-yellow-500' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm ${highContrast ? 'text-yellow-200' : 'text-blue-700'}`}>
                🎤 Listening for voice commands... Try saying: "read code", "stop reading", "explain code", "check errors", "start dictation"
              </p>
            </div>
          )}

          {isDictating && (
            <div className={`mt-4 p-3 rounded border ${highContrast ? 'bg-blue-900 border-blue-500' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-sm ${highContrast ? 'text-blue-200' : 'text-green-700'}`}>
                ✍️ Dictation mode active... Speak your code. Say "stop dictation" when finished.
              </p>
              {dictationText && (
                <p className={`text-xs mt-2 font-mono ${highContrast ? 'text-blue-100' : 'text-green-600'}`}>
                  Preview: {dictationText}
                </p>
              )}
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

        {/* Code Language Selection */}
        <Card className={`p-6 mb-6 ${themeClasses}`}>
          <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Code Settings
          </h2>
          <div className="mb-6">
            <Label className={`block mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
              Programming Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className={`w-64 ${themeClasses}`}>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <p className={`text-xs mt-1 ${highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
              Language is auto-detected from file extensions, but you can override it here
            </p>
          </div>

          <h3 className={`text-lg font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
            Accessibility Settings
          </h3>
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
              {highContrast ? '���' : '🌙'} High Contrast
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
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + E</kbd> Explain code</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + C</kbd> Check errors</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Alt + D</kbd> Toggle dictation</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + A</kbd> Select all text</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + C</kbd> Copy selected text</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-black text-xs">Ctrl/Cmd + V</kbd> Paste from clipboard</div>
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
                  aria-label="Paste code from clipboard or focus editor for manual paste"
                >
                  📋 Paste Code
                </Button>
                <p className={`text-xs mt-1 ${highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
                  Paste from clipboard or use Ctrl+V in editor
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
                    aria-label="Copy code to clipboard or select text for manual copy"
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
                Basic Code Analysis
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

          {/* Detailed Code Analysis Section */}
          {codeAnalysis && (
            <Card className={`p-6 mt-6 ${themeClasses}`}>
              <h3 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>
                Detailed Code Analysis
              </h3>

              {/* Summary */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                  Summary
                </h4>
                <p className={`mb-2 ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                  {codeAnalysis.readableExplanation}
                </p>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${highContrast ? 'text-yellow-200' : 'text-gray-600'}`}>
                  <div><span className="font-medium">Code Lines:</span> {codeAnalysis.summary.codeLines}</div>
                  <div><span className="font-medium">Comments:</span> {codeAnalysis.summary.commentLines}</div>
                  <div><span className="font-medium">Blank Lines:</span> {codeAnalysis.summary.blankLines}</div>
                  <div><span className="font-medium">Complexity:</span> <span className={`capitalize ${codeAnalysis.summary.complexity === 'high' ? 'text-red-500' : codeAnalysis.summary.complexity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{codeAnalysis.summary.complexity}</span></div>
                </div>
              </div>

              {/* Code Structure */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Functions */}
                {codeAnalysis.structure.functions.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                      Functions ({codeAnalysis.structure.functions.length})
                    </h4>
                    <div className={`space-y-1 text-sm ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                      {codeAnalysis.structure.functions.slice(0, 5).map((func, index) => (
                        <div key={index}>
                          <span className="font-mono">{func.name}</span> (line {func.line}, {func.type})
                        </div>
                      ))}
                      {codeAnalysis.structure.functions.length > 5 && (
                        <div>...and {codeAnalysis.structure.functions.length - 5} more</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Variables */}
                {codeAnalysis.structure.variables.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                      Variables ({codeAnalysis.structure.variables.length})
                    </h4>
                    <div className={`space-y-1 text-sm ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                      {codeAnalysis.structure.variables.slice(0, 5).map((variable, index) => (
                        <div key={index}>
                          <span className="font-mono">{variable.name}</span> (line {variable.line}, {variable.type})
                        </div>
                      ))}
                      {codeAnalysis.structure.variables.length > 5 && (
                        <div>...and {codeAnalysis.structure.variables.length - 5} more</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Loops & Conditionals */}
                {(codeAnalysis.structure.loops.length > 0 || codeAnalysis.structure.conditionals.length > 0) && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                      Control Flow
                    </h4>
                    <div className={`space-y-1 text-sm ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                      {codeAnalysis.structure.loops.map((loop, index) => (
                        <div key={`loop-${index}`}>
                          {loop.type} loop (line {loop.line})
                        </div>
                      ))}
                      {codeAnalysis.structure.conditionals.map((cond, index) => (
                        <div key={`cond-${index}`}>
                          {cond.type} statement (line {cond.line})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Imports */}
                {codeAnalysis.structure.imports.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${highContrast ? 'text-yellow-200' : 'text-gray-700'}`}>
                      Imports ({codeAnalysis.structure.imports.length})
                    </h4>
                    <div className={`space-y-1 text-sm ${highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                      {codeAnalysis.structure.imports.slice(0, 3).map((imp, index) => (
                        <div key={index}>
                          <span className="font-mono">{imp.module}</span> (line {imp.line})
                        </div>
                      ))}
                      {codeAnalysis.structure.imports.length > 3 && (
                        <div>...and {codeAnalysis.structure.imports.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Errors */}
              {codeAnalysis.errors.length > 0 && (
                <div className="mb-6">
                  <h4 className={`font-semibold mb-2 text-red-600`}>
                    Issues Found ({codeAnalysis.errors.length})
                  </h4>
                  <div className="space-y-2">
                    {codeAnalysis.errors.slice(0, 5).map((error, index) => (
                      <div key={index} className={`p-2 rounded border-l-4 border-red-500 ${highContrast ? 'bg-red-900/20' : 'bg-red-50'}`}>
                        <div className="text-sm">
                          <span className="font-medium">Line {error.line}:</span> {error.message}
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${highContrast ? 'bg-red-800' : 'bg-red-100'}`}>
                            {error.type}
                          </span>
                        </div>
                      </div>
                    ))}
                    {codeAnalysis.errors.length > 5 && (
                      <div className="text-sm text-gray-500">...and {codeAnalysis.errors.length - 5} more issues</div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={() => speak(codeAnalysis.readableExplanation)}
                  variant="outline"
                  className={buttonThemeClasses}
                  aria-label="Read detailed analysis aloud"
                >
                  🔊 Read Full Analysis
                </Button>
                {codeAnalysis.errors.length > 0 && (
                  <Button
                    onClick={() => {
                      const errorSummary = codeAnalysis.errors.slice(0, 3).map(e =>
                        `Line ${e.line}: ${e.message}`
                      ).join('. ');
                      speak(`Found ${codeAnalysis.errors.length} issues. ${errorSummary}`);
                    }}
                    variant="outline"
                    className={buttonThemeClasses}
                    aria-label="Read errors aloud"
                  >
                    🚨 Read Errors
                  </Button>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
