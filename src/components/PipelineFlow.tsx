
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader, AlertCircle } from 'lucide-react';

interface Step {
    name: string;
    status: "PENDING" | "RUNNING" | "DONE" | "FAILED";
}

interface PipelineFlowProps {
    steps: Step[];
}

const STEP_ORDER = [
    "PromptRefiner",
    "StoryParser",
    "DBSchemaAgent",
    "BackendAgent",
    "FrontendAgent",
    "TestAgent",
    "CodeQualityAgent"
];

const STEP_LABELS: Record<string, string> = {
    PromptRefiner: "Refine",
    StoryParser: "Parse",
    DBSchemaAgent: "Schema",
    BackendAgent: "Backend",
    FrontendAgent: "Frontend",
    TestAgent: "Tests",
    CodeQualityAgent: "Audit"
};

export function PipelineFlow({ steps }: PipelineFlowProps) {
    const getStatus = (name: string) => {
        const step = steps.find(s => s.name === name);
        return step ? step.status : "PENDING";
    };

    return (
        <div className="w-full overflow-x-auto p-4 bg-slate-900 rounded-lg border border-slate-700 mb-6">
            <div className="flex items-center justify-between min-w-[600px] relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-0" />

                {STEP_ORDER.map((stepName, index) => {
                    const status = getStatus(stepName);
                    let color = "bg-slate-700 border-slate-600";
                    let icon = <Circle size={16} className="text-slate-400" />;

                    if (status === "RUNNING") {
                        color = "bg-yellow-900 border-yellow-500 ring-4 ring-yellow-900/40";
                        icon = <Loader size={16} className="text-yellow-400 animate-spin" />;
                    } else if (status === "DONE") {
                        color = "bg-green-900 border-green-500";
                        icon = <CheckCircle size={16} className="text-green-400" />;
                    } else if (status === "FAILED") {
                        color = "bg-red-900 border-red-500";
                        icon = <AlertCircle size={16} className="text-red-400" />;
                    }

                    return (
                        <div key={stepName} className="relative z-10 flex flex-col items-center gap-2">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: status === "RUNNING" ? 1.1 : 1, opacity: 1 }}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${color} transition-colors duration-300`}
                            >
                                {icon}
                            </motion.div>
                            <span className={`text-xs font-semibold ${status === "PENDING" ? "text-slate-500" : "text-slate-200"}`}>
                                {STEP_LABELS[stepName]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
