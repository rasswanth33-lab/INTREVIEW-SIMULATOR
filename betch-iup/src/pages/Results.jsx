import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Target, TrendingUp, AlertTriangle, RotateCcw } from 'lucide-react';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { answers, company, role } = location.state || {};

    if (!answers) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">No Interview Data</h2>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-white text-slate-900 rounded-full font-medium">Go Home</button>
                </div>
            </div>
        );
    }

    // Dummy analytics generator based on answers count
    const answeredCount = Object.keys(answers).filter(k => answers[k].trim().length > 10).length;
    // Let's assume there were typically 5 questions for fallback or use role.questions
    const total = role?.questions || 5;
    const score = Math.round((answeredCount / total) * 100) || 15; // default low score if nothing typed

    return (
        <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-5 duration-700 relative z-10">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20 text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Interview Completed</h1>
                <p className="text-lg text-slate-400">Here's your preliminary performance report for {company.name} - {role.title}</p>
            </div>

            <div className="glass-card p-6 md:p-10 mb-8 border-t border-t-white/30">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center relative shrink-0">
                        {/* SVG circle for progress could go here, fallback to simple CSS circle */}
                        <div
                            className="absolute inset-0 rounded-full border-8 border-blue-500 border-l-transparent border-b-transparent transform rotate-45"
                        ></div>
                        <div className="text-center">
                            <span className="text-5xl font-bold text-white">{score}</span>
                            <span className="text-xl text-slate-400">/100</span>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-emerald-400 mb-2 font-medium">
                                <Target className="w-5 h-5" /> Overall Rating
                            </div>
                            <div className="text-2xl font-semibold text-white">{score > 70 ? 'Strong Hire' : score > 40 ? 'Borderline' : 'Needs Practice'}</div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-blue-400 mb-2 font-medium">
                                <CheckCircle2 className="w-5 h-5" /> Questions Attempted
                            </div>
                            <div className="text-2xl font-semibold text-white">{answeredCount} of {total}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="glass-card p-6 border-t border-t-white/30">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <TrendingUp className="w-5 h-5 text-emerald-400" /> Key Strengths
                    </h3>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex gap-3"><span className="text-emerald-500">•</span> Completeness in answered sections</li>
                        <li className="flex gap-3"><span className="text-emerald-500">•</span> Time management (finished early)</li>
                    </ul>
                </div>

                <div className="glass-card p-6 border-t border-t-white/30">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <AlertTriangle className="w-5 h-5 text-orange-400" /> Areas to Improve
                    </h3>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex gap-3"><span className="text-orange-500">•</span> Deeper explanation of core concepts</li>
                        <li className="flex gap-3"><span className="text-orange-500">•</span> Handling edge cases in theoretical answers</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => navigate('/companies')}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105"
                >
                    <RotateCcw className="w-5 h-5" />
                    Practice Another Interview
                </button>
            </div>
        </div>
    );
}
