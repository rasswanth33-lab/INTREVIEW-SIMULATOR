import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, CheckCircle, XCircle } from 'lucide-react';

const LANGUAGE_MAP = {
    javascript: { pistonLang: 'javascript', version: '18.15.0' },
    python: { pistonLang: 'python', version: '3.10.0' },
    java: { pistonLang: 'java', version: '15.0.2' },
    cpp: { pistonLang: 'c++', version: '10.2.0' },
};

const DEFAULT_CODE = {
    javascript: `// Write your solution here\nfunction solution() {\n    // your code\n    console.log("Hello, World!");\n}\n\nsolution();`,
    python: `# Write your solution here\ndef solution():\n    # your code\n    print("Hello, World!")\n\nsolution()`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
};

// --- Technical: Monaco Code Editor with output panel ---
function CodeEditor({ question, answerText, onAnswerChange }) {
    const [lang, setLang] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODE.javascript);
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [runStatus, setRunStatus] = useState(null); // 'ok' | 'error' | null

    const runCode = async () => {
        setRunning(true);
        setOutput('');
        setRunStatus(null);
        try {
            const langInfo = LANGUAGE_MAP[lang];
            const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: langInfo.pistonLang,
                    version: langInfo.version,
                    files: [{ content: code }],
                }),
            });
            const data = await res.json();
            const out = data.run?.output || data.run?.stderr || 'No output';
            setOutput(out);
            setRunStatus(data.run?.stderr ? 'error' : 'ok');
            // Save code as answer text
            onAnswerChange(question._id, code);
        } catch {
            setOutput('Failed to run code. Please check your internet connection.');
            setRunStatus('error');
        } finally {
            setRunning(false);
        }
    };

    const handleEditorChange = (value) => {
        setCode(value || '');
        onAnswerChange(question._id, value || '');
    };

    const switchLang = (newLang) => {
        setLang(newLang);
        setCode(DEFAULT_CODE[newLang]);
        setOutput('');
        setRunStatus(null);
    };

    return (
        <div className="flex-1 flex flex-col gap-3 mb-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2">
                    {Object.keys(LANGUAGE_MAP).map(l => (
                        <button
                            key={l}
                            onClick={() => switchLang(l)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${lang === l ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                        >
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={runCode}
                    disabled={running}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                    {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {running ? 'Running...' : 'Run Code'}
                </button>
            </div>

            {/* Monaco Editor */}
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl flex-1" style={{ minHeight: '280px' }}>
                <Editor
                    height="280px"
                    language={lang === 'cpp' ? 'cpp' : lang}
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12 },
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                />
            </div>

            {/* Output Panel */}
            {(output || running) && (
                <div className={`rounded-xl p-4 border text-sm font-mono ${runStatus === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 border-slate-700 text-emerald-300'}`}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase">
                        {runStatus === 'ok' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {runStatus === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                        Output
                    </div>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
            )}
        </div>
    );
}

// --- Aptitude: Multiple Choice Question ---
function AptitudeQuestion({ question, answerText, onAnswerChange }) {
    const options = question.options || ['Option A', 'Option B', 'Option C', 'Option D'];

    return (
        <div className="flex-1 flex flex-col gap-4 mb-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select one answer</p>
            {options.map((opt, i) => {
                const selected = answerText === opt;
                const labels = ['A', 'B', 'C', 'D'];
                return (
                    <button
                        key={i}
                        onClick={() => onAnswerChange(question._id, opt)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${selected
                            ? 'bg-blue-500/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'}`}
                    >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${selected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            {labels[i]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {selected && <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />}
                    </button>
                );
            })}
        </div>
    );
}

// --- Text Area: Default for HR questions ---
function TextAnswer({ question, answerText, onAnswerChange }) {
    return (
        <div className="flex-1 flex flex-col mb-8">
            <textarea
                className="flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none min-h-[280px] font-sans"
                placeholder="Type your answer here... Be thorough and use specific examples where possible."
                value={answerText}
                onChange={(e) => onAnswerChange(question._id, e.target.value)}
                spellCheck={false}
            />
        </div>
    );
}

// --- Main Exported QuestionCard ---
export default function QuestionCard({ question, currentIdx, total, answerText, onAnswerChange }) {
    const type = question?.type || 'HR';

    if (type === 'Technical') {
        return <CodeEditor question={question} answerText={answerText} onAnswerChange={onAnswerChange} />;
    }

    if (type === 'Aptitude') {
        return <AptitudeQuestion question={question} answerText={answerText} onAnswerChange={onAnswerChange} />;
    }

    return <TextAnswer question={question} answerText={answerText} onAnswerChange={onAnswerChange} />;
}
