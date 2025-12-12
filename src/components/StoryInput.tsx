
import React, { useState } from 'react';

interface Props {
    onRun: (story: string) => void;
    isLoading: boolean;
}

export const StoryInput: React.FC<Props> = ({ onRun, isLoading }) => {
    const [story, setStory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (story.trim()) {
            onRun(story);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-brand-primary">1. Describe Your Feature</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full h-32 bg-slate-700 text-white p-4 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="E.g., I want a todo list app where users can add tasks, mark them as done, and filter by status..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={`mt-4 w-full py-2 px-4 rounded-md font-semibold transition-colors ${isLoading
                            ? 'bg-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    disabled={isLoading || !story.trim()}
                >
                    {isLoading ? 'Agents Working...' : 'Generate System'}
                </button>
            </form>
        </div>
    );
};
