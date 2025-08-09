// Shared API interface definitions between client and server

export interface DemoResponse {
  message: string;
  timestamp: string;
}

export interface CodeAnalysisRequest {
  code: string;
  language?: string;
}

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

export interface ErrorCheckResponse {
  errors: Array<{line: number, message: string, type: string}>;
  hasErrors: boolean;
  summary: string;
}
