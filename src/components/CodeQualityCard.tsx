
import { Shield, Check, AlertTriangle } from 'lucide-react';

interface QualityReport {
    maintainability_score: number;
    readability_score: number;
    security_score: number;
    recommendations: string[];
    summary: string;
}

export function CodeQualityCard({ report }: { report: QualityReport }) {
    if (!report) return null;

    const renderScore = (label: string, score: number) => {
        let color = "bg-red-500";
        if (score >= 8) color = "bg-green-500";
        else if (score >= 5) color = "bg-yellow-500";

        return (
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                    <span>{label}</span>
                    <span>{score}/10</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${score * 10}%` }} />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-4">
            <h4 className="font-semibold flex items-center gap-2 text-slate-100">
                <Shield className="text-purple-400" size={18} /> Code Quality Audit
            </h4>

            <div className="grid grid-cols-3 gap-4">
                {renderScore("Maintainability", report.maintainability_score)}
                {renderScore("Readability", report.readability_score)}
                {renderScore("Security", report.security_score)}
            </div>

            <div className="text-sm text-slate-300 border-t border-slate-700 pt-3">
                <p className="italic mb-2">"{report.summary}"</p>
                <ul className="space-y-1">
                    {report.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs">
                            <AlertTriangle size={12} className="text-yellow-500 mt-1 shrink-0" />
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
