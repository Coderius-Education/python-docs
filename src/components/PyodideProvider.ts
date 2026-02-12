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

export async function runPython(pyodide: any, code: string): Promise<string> {
  pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

  await pyodide.runPythonAsync(code);

  const stdout = pyodide.runPython('sys.stdout.getvalue()');
  const stderr = pyodide.runPython('sys.stderr.getvalue()');

  pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

  return stdout + (stderr ? `\n${stderr}` : '');
}
