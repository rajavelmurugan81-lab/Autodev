
import { DiffEditor } from '@monaco-editor/react';

interface DiffViewerProps {
    oldValue: string;
    newValue: string;
}

export function DiffViewer({ oldValue, newValue }: DiffViewerProps) {
    if (!oldValue || !newValue) return null;

    return (
        <div className="rounded-lg overflow-hidden border border-slate-700 mt-4 shadow-lg">
            <div className="bg-slate-800 p-2 text-xs text-slate-400 font-mono border-b border-slate-700 flex justify-between px-4">
                <span>Original Story</span>
                <span>Refined Story</span>
            </div>
            <div className="h-[300px] bg-[#1e1e1e]">
                <DiffEditor
                    height="100%"
                    original={oldValue}
                    modified={newValue}
                    language="markdown"
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        renderSideBySide: true,
                        scrollBeyondLastLine: false
                    }}
                />
            </div>
        </div>
    );
}
