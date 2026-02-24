import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companies, mockQuestions } from '../data/mockData';
import { Clock, AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';

export default function Interview() {
    const { companyId, roleId } = useParams();
    const navigate = useNavigate();

    const company = companies.find(c => c.id === companyId);
    const role = company?.roles.find(r => r.id === roleId);
    const questions = mockQuestions[roleId] || mockQuestions.frontend; // Fallback

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins defaults

    useEffect(() => {
        // Parse duration like "45 mins" to seconds
        if (role?.duration) {
            const minutes = parseInt(role.duration.split(' ')[0]) || 30;
            setTimeLeft(minutes * 60);
        }
    }, [role]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/results', { state: { answers, company, role } });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    if (!company || !role) {
        return <div className="text-center p-12 text-white">Invalid interview session.</div>;
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            // Finish
            navigate('/results', { state: { answers, company, role } });
        }
    };

    const isLast = currentIdx === questions.length - 1;
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="flex-1 flex flex-col bg-slate-900 absolute inset-0 z-50 animate-in fade-in duration-300">
            {/* Top Bar */}
            <header className="h-16 border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm">
                        {company.logo}
                    </div>
                    <span className="font-semibold text-slate-200">{company.name} Mock Interview</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm font-medium font-mono">
                        <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-800 shrink-0">
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8 md:py-16">
                <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
                    <div className="mb-8 flex items-center gap-3 text-sm font-medium text-slate-400">
                        <span className="px-2 py-1 bg-white/5 rounded-md border border-white/10">Question {currentIdx + 1} of {questions.length}</span>
                        <span className="flex items-center gap-1.5 text-orange-400"><AlertCircle className="w-4 h-4" /> Not recorded</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-white leading-tight">
                        {questions[currentIdx].text}
                    </h2>

                    <QuestionCard
                        question={questions[currentIdx]}
                        currentIdx={currentIdx}
                        total={questions.length}
                        answerText={answers[questions[currentIdx].id] || ''}
                        onAnswerChange={(id, value) => setAnswers({ ...answers, [id]: value })}
                    />
                </div>

                <div className="flex items-center justify-end shrink-0 pt-4 border-t border-white/5">
                    <button
                        onClick={handleNext}
                        className={`px-8 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg ${isLast
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                            : 'bg-white text-slate-900 hover:bg-slate-200'
                            }`}
                    >
                        {isLast ? 'Submit Interview' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
}
