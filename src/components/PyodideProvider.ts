// Singleton Pyodide loader — shared across all components on the page
let pyodidePromise: Promise<any> | null = null;

export function getPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      // Only add script tag once
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js';
        script.async = true;
        await new Promise<void>((res, rej) => {
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }
      const pyodide = await (window as any).loadPyodide();
      resolve(pyodide);
    } catch (err) {
      pyodidePromise = null; // allow retry
      reject(err);
    }
  });

  return pyodidePromise;
}

/**
 * Format a Python traceback into a student-friendly error message.
 * Example output: "Fout op regel 3\nNameError: naam 'x' is niet gedefinieerd"
 */
function filterTraceback(raw: string): string {
  const lines = raw.split('\n');

  // Extract the last line number from a <exec> frame
  let lineNumber: string | null = null;
  for (const line of lines) {
    const match = line.match(/File "<exec>", line (\d+)/);
    if (match) {
      lineNumber = match[1];
    }
  }

  // Extract the error line (e.g. "NameError: name 'x' is not defined")
  // It's the last non-empty line that looks like "ErrorType: message"
  let errorLine = '';
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (trimmed && /^[A-Z]\w*(Error|Exception|Warning)/.test(trimmed)) {
      errorLine = trimmed;
      break;
    }
  }

  if (!errorLine) {
    // Fallback: use the last non-empty line
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim()) {
        errorLine = lines[i].trim();
        break;
      }
    }
  }

  if (!errorLine) return raw;

  const parts: string[] = [];
  if (lineNumber) {
    parts.push(`Fout op regel ${lineNumber}`);
  }
  parts.push(errorLine);

  return parts.join('\n');
}

export async function runPython(pyodide: any, code: string): Promise<string> {
  pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

  let didError = false;
  try {
    await pyodide.runPythonAsync(code);
  } catch {
    didError = true;
  }

  const stdout = pyodide.runPython('sys.stdout.getvalue()');
  const stderr = pyodide.runPython('sys.stderr.getvalue()');

  pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

  if (didError && stderr) {
    // The traceback lands in stderr — filter out Pyodide internals
    const filtered = filterTraceback(stderr);
    return (stdout ? stdout + '\n' : '') + filtered;
  }

  return stdout + (stderr ? `\n${stderr}` : '');
}
