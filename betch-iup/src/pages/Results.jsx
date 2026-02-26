import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Target, TrendingUp, AlertTriangle, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionId, company, role } = location.state || {};

    const [resultsData, setResultsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.getSessionResults(sessionId);
                if (res.status === 'success') {
                    setResultsData(res.data);
                } else {
                    setError('Could not fetch results');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load interview results.');
            } finally {
                setIsLoading(false);
            }
        };

        if (sessionId) {
            fetchResults();
        } else {
            setIsLoading(false);
        }
    }, [sessionId]);

    if (!sessionId) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">No Interview Data</h2>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-white text-slate-900 rounded-full font-medium">Go Home</button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900 absolute inset-0 z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-300 text-lg animate-pulse">Computing your AI Evaluation...</p>
                </div>
            </div>
        );
    }

    if (error || !resultsData) {
        return <div className="text-center p-12 text-white">{error || "Something went wrong"}</div>;
    }

    const { sessionDetails, answersFeedback } = resultsData;
    const score = sessionDetails.totalScore;
    const total = answersFeedback.length;

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
                            <div className="text-2xl font-semibold text-white">{sessionDetails.confidence}</div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-blue-400 mb-2 font-medium">
                                <CheckCircle2 className="w-5 h-5" /> Questions Attempted
                            </div>
                            <div className="text-2xl font-semibold text-white">{total} of {total}</div>
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
                        {answersFeedback.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm"><span className="text-emerald-500 shrink-0">•</span> {f.feedback?.strength || 'Good logical thinking'}</li>
                        ))}
                    </ul>
                </div>

                <div className="glass-card p-6 border-t border-t-white/30">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <AlertTriangle className="w-5 h-5 text-orange-400" /> Areas to Improve
                    </h3>
                    <ul className="space-y-3 text-slate-300">
                        {answersFeedback.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm"><span className="text-orange-500 shrink-0">•</span> {f.feedback?.weakness || 'Requires deeper articulation'}</li>
                        ))}
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
