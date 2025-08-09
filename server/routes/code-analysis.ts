import { RequestHandler } from "express";
import { z } from "zod";

// Request schema validation
const CodeAnalysisRequest = z.object({
  code: z.string(),
  language: z.string().optional().default("javascript")
});

export interface CodeAnalysisResponse {
  explanation: string;
  structure: {
    functions: Array<{name: string, line: number, type: string}>;
    variables: Array<{name: string, line: number, type: string}>;
    loops: Array<{type: string, line: number}>;
    conditionals: Array<{type: string, line: number}>;
    comments: Array<{line: number, text: string}>;
    imports: Array<{module: string, line: number}>;
  };
  summary: {
    totalLines: number;
    codeLines: number;
    commentLines: number;
    blankLines: number;
    complexity: "low" | "medium" | "high";
  };
  readableExplanation: string;
  errors: Array<{line: number, message: string, type: string}>;
}

// Analyze JavaScript/TypeScript code structure
function analyzeJavaScript(code: string): CodeAnalysisResponse {
  const lines = code.split('\n');
  const structure = {
    functions: [] as Array<{name: string, line: number, type: string}>,
    variables: [] as Array<{name: string, line: number, type: string}>,
    loops: [] as Array<{type: string, line: number}>,
    conditionals: [] as Array<{type: string, line: number}>,
    comments: [] as Array<{line: number, text: string}>,
    imports: [] as Array<{module: string, line: number}>
  };

  const errors: Array<{line: number, message: string, type: string}> = [];
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;

    if (trimmedLine === '') {
      blankLines++;
      return;
    }

    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      commentLines++;
      structure.comments.push({
        line: lineNumber,
        text: trimmedLine.replace(/^\/\/|^\/\*|\*\/|^\*/g, '').trim()
      });
      return;
    }

    codeLines++;

    // Function declarations
    const functionMatch = trimmedLine.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)|let\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)|var\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function))/);
    if (functionMatch) {
      const name = functionMatch[1] || functionMatch[2] || functionMatch[3] || functionMatch[4];
      structure.functions.push({
        name,
        line: lineNumber,
        type: trimmedLine.includes('=>') ? 'arrow' : 'regular'
      });
    }

    // Variable declarations
    const variableMatch = trimmedLine.match(/(?:const\s+(\w+)|let\s+(\w+)|var\s+(\w+))\s*=(?!=)/);
    if (variableMatch && !functionMatch) {
      const name = variableMatch[1] || variableMatch[2] || variableMatch[3];
      structure.variables.push({
        name,
        line: lineNumber,
        type: variableMatch[1] ? 'const' : variableMatch[2] ? 'let' : 'var'
      });
    }

    // Loops
    if (trimmedLine.match(/\b(for|while|do\s*{)\b/)) {
      const loopType = trimmedLine.includes('for') ? 'for' : 
                      trimmedLine.includes('while') ? 'while' : 'do-while';
      structure.loops.push({
        type: loopType,
        line: lineNumber
      });
    }

    // Conditionals
    if (trimmedLine.match(/\b(if|else\s+if|else|switch)\b/)) {
      const condType = trimmedLine.includes('switch') ? 'switch' :
                       trimmedLine.includes('else if') ? 'else if' :
                       trimmedLine.includes('else') ? 'else' : 'if';
      structure.conditionals.push({
        type: condType,
        line: lineNumber
      });
    }

    // Imports
    const importMatch = trimmedLine.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)/);
    if (importMatch) {
      structure.imports.push({
        module: importMatch[1] || importMatch[2],
        line: lineNumber
      });
    }

    // Basic syntax error detection
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;

    if (openBraces !== closeBraces && openBraces > 0 && closeBraces > 0) {
      errors.push({
        line: lineNumber,
        message: "Mismatched curly braces",
        type: "syntax"
      });
    }
    if (openParens !== closeParens && openParens > 0 && closeParens > 0) {
      errors.push({
        line: lineNumber,
        message: "Mismatched parentheses",
        type: "syntax"
      });
    }
    if (openBrackets !== closeBrackets && openBrackets > 0 && closeBrackets > 0) {
      errors.push({
        line: lineNumber,
        message: "Mismatched square brackets",
        type: "syntax"
      });
    }

    // Missing semicolons (basic check)
    if (trimmedLine.match(/^(const|let|var|return)\s+.*[^;{}\s]$/) && !trimmedLine.includes('//')) {
      errors.push({
        line: lineNumber,
        message: "Missing semicolon",
        type: "syntax"
      });
    }
  });

  // Calculate complexity
  const complexityScore = structure.functions.length + structure.loops.length + structure.conditionals.length;
  const complexity: "low" | "medium" | "high" = 
    complexityScore <= 5 ? "low" : 
    complexityScore <= 15 ? "medium" : "high";

  // Generate readable explanation
  let explanation = `This ${structure.imports.length > 0 ? 'module' : 'code'} contains ${codeLines} lines of executable code`;
  
  if (structure.functions.length > 0) {
    explanation += ` and defines ${structure.functions.length} function${structure.functions.length > 1 ? 's' : ''}`;
    const functionNames = structure.functions.slice(0, 3).map(f => f.name).join(', ');
    if (structure.functions.length <= 3) {
      explanation += `: ${functionNames}`;
    } else {
      explanation += ` including ${functionNames} and ${structure.functions.length - 3} more`;
    }
  }

  if (structure.variables.length > 0) {
    explanation += `. It declares ${structure.variables.length} variable${structure.variables.length > 1 ? 's' : ''}`;
  }

  if (structure.loops.length > 0) {
    explanation += ` and uses ${structure.loops.length} loop${structure.loops.length > 1 ? 's' : ''}`;
  }

  if (structure.conditionals.length > 0) {
    explanation += ` with ${structure.conditionals.length} conditional statement${structure.conditionals.length > 1 ? 's' : ''}`;
  }

  if (structure.imports.length > 0) {
    explanation += `. The code imports ${structure.imports.length} module${structure.imports.length > 1 ? 's' : ''}`;
  }

  explanation += `. The complexity level is ${complexity}.`;

  return {
    explanation,
    structure,
    summary: {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines,
      complexity
    },
    readableExplanation: explanation,
    errors
  };
}

// Analyze Python code structure (basic implementation)
function analyzePython(code: string): CodeAnalysisResponse {
  const lines = code.split('\n');
  const structure = {
    functions: [] as Array<{name: string, line: number, type: string}>,
    variables: [] as Array<{name: string, line: number, type: string}>,
    loops: [] as Array<{type: string, line: number}>,
    conditionals: [] as Array<{type: string, line: number}>,
    comments: [] as Array<{line: number, text: string}>,
    imports: [] as Array<{module: string, line: number}>
  };

  const errors: Array<{line: number, message: string, type: string}> = [];
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;

    if (trimmedLine === '') {
      blankLines++;
      return;
    }

    if (trimmedLine.startsWith('#')) {
      commentLines++;
      structure.comments.push({
        line: lineNumber,
        text: trimmedLine.replace(/^#/, '').trim()
      });
      return;
    }

    codeLines++;

    // Function definitions
    const functionMatch = trimmedLine.match(/def\s+(\w+)\s*\(/);
    if (functionMatch) {
      structure.functions.push({
        name: functionMatch[1],
        line: lineNumber,
        type: 'function'
      });
    }

    // Variable assignments
    const variableMatch = trimmedLine.match(/^(\w+)\s*=/);
    if (variableMatch && !functionMatch) {
      structure.variables.push({
        name: variableMatch[1],
        line: lineNumber,
        type: 'variable'
      });
    }

    // Loops
    if (trimmedLine.match(/^(for|while)\s+/)) {
      const loopType = trimmedLine.startsWith('for') ? 'for' : 'while';
      structure.loops.push({
        type: loopType,
        line: lineNumber
      });
    }

    // Conditionals
    if (trimmedLine.match(/^(if|elif|else)(\s|:)/)) {
      const condType = trimmedLine.startsWith('elif') ? 'elif' :
                       trimmedLine.startsWith('else') ? 'else' : 'if';
      structure.conditionals.push({
        type: condType,
        line: lineNumber
      });
    }

    // Imports
    const importMatch = trimmedLine.match(/^(?:from\s+(\S+)\s+import|import\s+(\S+))/);
    if (importMatch) {
      structure.imports.push({
        module: importMatch[1] || importMatch[2],
        line: lineNumber
      });
    }

    // Basic indentation check
    if (line.match(/^\s+/) && !line.match(/^\s*(#|$)/)) {
      const indentation = line.match(/^\s*/)?.[0].length || 0;
      if (indentation % 4 !== 0) {
        errors.push({
          line: lineNumber,
          message: "Inconsistent indentation (should be multiples of 4 spaces)",
          type: "style"
        });
      }
    }
  });

  const complexityScore = structure.functions.length + structure.loops.length + structure.conditionals.length;
  const complexity: "low" | "medium" | "high" = 
    complexityScore <= 5 ? "low" : 
    complexityScore <= 15 ? "medium" : "high";

  let explanation = `This Python script contains ${codeLines} lines of code`;
  
  if (structure.functions.length > 0) {
    explanation += ` and defines ${structure.functions.length} function${structure.functions.length > 1 ? 's' : ''}`;
  }

  if (structure.loops.length > 0) {
    explanation += ` with ${structure.loops.length} loop${structure.loops.length > 1 ? 's' : ''}`;
  }

  if (structure.conditionals.length > 0) {
    explanation += ` and ${structure.conditionals.length} conditional${structure.conditionals.length > 1 ? 's' : ''}`;
  }

  explanation += `. The complexity is ${complexity}.`;

  return {
    explanation,
    structure,
    summary: {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines,
      complexity
    },
    readableExplanation: explanation,
    errors
  };
}

export const handleCodeAnalysis: RequestHandler = (req, res) => {
  try {
    const { code, language } = CodeAnalysisRequest.parse(req.body);

    if (!code.trim()) {
      return res.status(400).json({
        error: "No code provided for analysis"
      });
    }

    let analysis: CodeAnalysisResponse;

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
      case 'typescript':
      case 'ts':
      case 'jsx':
      case 'tsx':
        analysis = analyzeJavaScript(code);
        break;
      case 'python':
      case 'py':
        analysis = analyzePython(code);
        break;
      default:
        // Generic analysis for unsupported languages
        const lines = code.split('\n');
        const codeLines = lines.filter(line => line.trim() !== '' && !line.trim().startsWith('//')).length;
        const commentLines = lines.filter(line => line.trim().startsWith('//')).length;
        const blankLines = lines.filter(line => line.trim() === '').length;

        analysis = {
          explanation: `This code file contains ${lines.length} total lines.`,
          structure: {
            functions: [],
            variables: [],
            loops: [],
            conditionals: [],
            comments: [],
            imports: []
          },
          summary: {
            totalLines: lines.length,
            codeLines,
            commentLines,
            blankLines,
            complexity: "low" as const
          },
          readableExplanation: `This appears to be ${language} code with ${codeLines} lines of code and ${commentLines} comment lines.`,
          errors: []
        };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      error: "Failed to analyze code",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
