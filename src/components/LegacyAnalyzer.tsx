
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, FileCode } from 'lucide-react';

export const LegacyAnalyzer: React.FC = () => {
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/legacy/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysis(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-brand-primary">4. Legacy Code Analysis</h2>

            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                    {isAnalyzing ? (
                        <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
                    ) : (
                        <Upload className="mb-2 text-slate-400" size={32} />
                    )}
                    <p className="text-slate-300 font-semibold">
                        {isAnalyzing ? "Analyzing..." : "Upload existing code to analyze"}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        Supported: .js, .py, .java, .cpp
                    </p>
                </div>
            </div>

            {analysis && (
                <div className="mt-6 bg-slate-900 p-4 rounded-lg font-mono text-sm max-h-[300px] overflow-auto">
                    <div className="flex items-center gap-2 mb-2 text-green-400 border-b border-slate-700 pb-2">
                        <FileCode size={16} />
                        <span>Analysis Result</span>
                    </div>
                    <pre className="text-slate-300">
                        {JSON.stringify(analysis, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};
