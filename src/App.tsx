
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StoryInput } from './components/StoryInput';
import { AgentStatus } from './components/AgentStatus';
import { CodeTabs } from './components/CodeTabs';
import { LegacyAnalyzer } from './components/LegacyAnalyzer';
import { StackSelector } from './components/StackSelector';
import { PipelineFlow } from './components/PipelineFlow';
import { DiffViewer } from './components/DiffViewer';
import { CodeQualityCard } from './components/CodeQualityCard';
import { Bot, Sparkles, Layout } from 'lucide-react';

function App() {
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastStory, setLastStory] = useState("");

    // New State for Stack
    const [stackPrefs, setStackPrefs] = useState({
        frontend: "React",
        backend: "Node/Express",
        database: "PostgreSQL"
    });

    // Polling interval
    useEffect(() => {
        let interval: any;
        if (jobId && jobStatus?.status !== 'COMPLETED' && jobStatus?.status !== 'FAILED') {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`/api/status/${jobId}`);
                    setJobStatus(res.data);
                    if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
                        setIsLoading(false);
                        clearInterval(interval);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [jobId, jobStatus?.status]);

    const handleRun = async (story: string) => {
        setIsLoading(true);
        setJobStatus(null);
        setLastStory(story);
        try {
            const res = await axios.post('/api/run', {
                story,
                stack_preferences: stackPrefs
            });
            setJobId(res.data.job_id);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
            alert("Failed to start agents");
        }
    };

    const refinedStory = jobStatus?.artifacts?.['refined_story.md'] || "";
    const qualityReport = jobStatus?.artifacts?.['quality_report.json'] ?
        (typeof jobStatus.artifacts['quality_report.json'] === 'string'
            ? JSON.parse(jobStatus.artifacts['quality_report.json'])
            : jobStatus.artifacts['quality_report.json'])
        : null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <div className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            AutoDev <span className="text-blue-400">CAP</span>
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                            <Sparkles size={14} className="text-yellow-400" /> Gemini 2.5 Flash
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Visual Pipeline */}
                {jobId && (
                    <section>
                        <PipelineFlow steps={jobStatus?.steps || []} />
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEft Column: Controls & Input */}
                    <div className="lg:col-span-4 space-y-6">
                        <StackSelector onChange={setStackPrefs} />
                        <StoryInput onRun={handleRun} isLoading={isLoading} />

                        {/* Status (Log) */}
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Live Logs</h3>
                            <AgentStatus
                                steps={jobStatus?.steps || []}
                                logs={jobStatus?.logs || {}}
                            />
                        </div>
                    </div>

                    {/* Right Column: Output & Artifacts */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Diff Viewer (Show when refined story is ready) */}
                        {refinedStory && lastStory && (
                            <DiffViewer oldValue={lastStory} newValue={refinedStory} />
                        )}

                        {/* Quality Card */}
                        {qualityReport && (
                            <CodeQualityCard report={qualityReport} />
                        )}

                        {/* Code Tabs */}
                        <CodeTabs
                            artifacts={jobStatus?.artifacts || {}}
                            jobId={jobId || undefined}
                        />

                        {/* Legacy Analyzer */}
                        <LegacyAnalyzer />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
