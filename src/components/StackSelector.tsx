
import { useState } from 'react';
import { Layers, Database, Code, Server } from 'lucide-react';

interface StackSelectorProps {
    onChange: (prefs: { frontend: string; backend: string; database: string }) => void;
}

export function StackSelector({ onChange }: StackSelectorProps) {
    const [prefs, setPrefs] = useState({
        frontend: "React",
        backend: "Node/Express",
        database: "PostgreSQL"
    });

    const handleChange = (key: string, value: string) => {
        const newPrefs = { ...prefs, [key]: value };
        setPrefs(newPrefs);
        onChange(newPrefs);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Layers className="text-blue-400" /> Stack Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Frontend */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Code size={16} /> Frontend
                    </label>
                    <select
                        value={prefs.frontend}
                        onChange={(e) => handleChange('frontend', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="React">React (Vite)</option>
                        <option value="Vue">Vue 3 (Vite)</option>
                    </select>
                </div>

                {/* Backend */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Server size={16} /> Backend
                    </label>
                    <select
                        value={prefs.backend}
                        onChange={(e) => handleChange('backend', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Node/Express">Node.js / Express</option>
                        <option value="Flask">Python / Flask</option>
                        <option value="FastAPI">Python / FastAPI</option>
                    </select>
                </div>

                {/* Database */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Database size={16} /> Database
                    </label>
                    <select
                        value={prefs.database}
                        onChange={(e) => handleChange('database', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MySQL">MySQL</option>
                        <option value="MongoDB">MongoDB</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
