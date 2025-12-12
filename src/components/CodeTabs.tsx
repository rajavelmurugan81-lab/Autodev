
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';
import axios from 'axios';

interface Props {
    artifacts: Record<string, string | any>;
    jobId?: string;
}

export const CodeTabs: React.FC<Props> = ({ artifacts, jobId }) => {
    // Filter out non-code artifacts for tabs (like refined_story.md, quality_report.json)
    const filenames = Object.keys(artifacts).filter(f =>
        !f.endsWith('.md') && !f.endsWith('.json') && !f.endsWith('.sql') // Keep SQL though? Yes.
        // Actually keep everything except meta ones if we want
    );

    // Explicitly include schema.sql/js and ignore refined_story.md which is for diff viewer
    // quality_report.json is for card.

    const displayFiles = filenames.filter(f =>
        f !== 'refined_story.md' && f !== 'quality_report.json'
    );

    const [activeTab, setActiveTab] = useState(displayFiles[0]);
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        if (!activeTab && displayFiles.length > 0) {
            setActiveTab(displayFiles[0]);
        }
    }, [displayFiles, activeTab]);

    const handleCopy = () => {
        if (activeTab && artifacts[activeTab]) {
            navigator.clipboard.writeText(artifacts[activeTab]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRegenerate = async () => {
        if (!jobId || !activeTab) return;
        setRegenerating(true);
        try {
            // Determine component from filename
            let component = "";
            if (activeTab.includes("backend")) component = "backend";
            else if (activeTab.includes("frontend")) component = "frontend";
            else if (activeTab.includes("test")) component = "tests";

            if (component) {
                await axios.post(`/api/regenerate/${component}`, { job_id: jobId });
                alert(`Regeneration started for ${component}. Watch the status!`);
            } else {
                alert("Cannot regenerate this file type directly.");
            }
        } catch (e) {
            console.error(e);
            alert("Regeneration failed");
        } finally {
            setRegenerating(false);
        }
    };

    if (displayFiles.length === 0) return null;

    const content = artifacts[activeTab];
    const language = getLanguage(activeTab);

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {displayFiles.map(filename => (
                        <button
                            key={filename}
                            onClick={() => setActiveTab(filename)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors whitespace-nowrap ${activeTab === filename
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                                }`}
                        >
                            {filename}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 pl-4 border-l border-slate-700 ml-4 shrink-0">
                    <button
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        className="p-2 text-slate-400 hover:text-blue-400 disabled:opacity-50"
                        title="Regenerate this component"
                    >
                        <RefreshCw size={18} className={regenerating ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 text-slate-400 hover:text-green-400"
                        title="Copy code"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    {jobId && (
                        <a
                            href={`/api/result/${jobId}`}
                            className="p-2 text-slate-400 hover:text-white"
                            target="_blank"
                            title="Download ZIP"
                        >
                            <Download size={18} />
                        </a>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 bg-[#1e1e1e]">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={language}
                    value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 }
                    }}
                />
            </div>
        </div>
    );
};

function getLanguage(filename: string): string {
    if (!filename) return 'javascript';
    if (filename.endsWith('.sql')) return 'sql';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) return 'typescript'; // Monaco handles loading
    if (filename.endsWith('.vue')) return 'html'; // Monaco often treats vue as html or needs setup
    if (filename.endsWith('.json')) return 'json';
    return 'javascript';
}
