
import React from 'react';
import { Loader2, CheckCircle, Circle, XCircle } from 'lucide-react';

interface Step {
    name: string;
    status: string;
}

interface Props {
    steps: Step[];
    logs: Record<string, string>;
}

export const AgentStatus: React.FC<Props> = ({ steps, logs }) => {
    // Default steps if none provided yet
    const AGENT_SEQUENCE = [
        "PromptRefiner",
        "StoryParser",
        "DBSchemaAgent",
        "BackendAgent",
        "FrontendAgent",
        "TestAgent"
    ];

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'DONE': return <CheckCircle className="text-green-500" />;
            case 'RUNNING': return <Loader2 className="animate-spin text-blue-500" />;
            case 'FAILED': return <XCircle className="text-red-500" />;
            default: return <Circle className="text-slate-600" />;
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-brand-primary">2. Agent Orchestration</h2>
            <div className="space-y-4">
                {AGENT_SEQUENCE.map((agentName) => {
                    const step = steps.find(s => s.name === agentName);
                    const status = step?.status || 'PENDING';
                    const log = logs[agentName];

                    return (
                        <div key={agentName} className="border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono font-semibold text-lg">{agentName}</span>
                                {getStatusIcon(status)}
                            </div>
                            {log && (
                                <div className="text-sm text-slate-400 bg-slate-900 p-2 rounded font-mono">
                                    {log}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
