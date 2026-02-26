import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companies } from '../data/mockData';
import { Clock, AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { api } from '../services/api';

export default function Interview() {
    const { companyId, roleId } = useParams();
    const navigate = useNavigate();

    const company = companies.find(c => c.id === companyId);
    const role = company?.roles.find(r => r.id === roleId);

    const [questions, setQuestions] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins defaults

    useEffect(() => {
        const initInterview = async () => {
            try {
                // Map full role titles to short DB keywords
                const roleMap = {
                    'Frontend Developer': 'Frontend',
                    'Frontend Engineer': 'Frontend',
                    'Backend Developer': 'Backend',
                    'Full Stack Developer': 'Full Stack Developer',
                    'Software Development Engineer': 'Software Engineer',
                    'Software Engineer': 'Software Engineer',
                    'Data Analyst': 'Data Analyst',
                    'SDE I': 'SDE I',
                    'SDE': 'Software Engineer',
                };

                const targetRole = roleMap[role?.title] ?? role?.title ?? 'Frontend';
                const targetCompany = company?.name || 'TCS';

                const res = await api.startInterview(targetCompany, targetRole, 'Medium');

                if (res.status === 'success') {
                    setQuestions(res.data.questions);
                    setSessionId(res.data.session._id);
                    setIsLoading(false);
                } else {
                    setError(res.message);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to connect to backend server. Make sure it's running on port 5000.");
                setIsLoading(false);
            }
        };

        if (company && role) {
            initInterview();
        }

        // Parse duration like "45 mins" to seconds
        if (role?.duration) {
            const minutes = parseInt(role.duration.split(' ')[0]) || 30;
            setTimeLeft(minutes * 60);
        }
    }, [company, role]);

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

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900 absolute inset-0 z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-300 text-lg animate-pulse">Initializing your {company.name} AI Interview Environment...</p>
                </div>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900 absolute inset-0 z-50 p-6">
                <div className="bg-white/10 p-8 rounded-2xl max-w-lg text-center border border-white/20">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Setup Failed</h2>
                    <p className="text-slate-300 mb-6">{error || "No dynamic questions found in database for this role."}</p>
                    <button onClick={() => navigate('/companies')} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Go Back</button>
                </div>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = async () => {
        const currentQuestion = questions[currentIdx];
        const answerText = answers[currentQuestion._id] || '';

        try {
            // Optional: Show loading state here
            await api.submitAnswer(sessionId, currentQuestion._id, answerText);

            if (currentIdx < questions.length - 1) {
                setCurrentIdx(currentIdx + 1);
            } else {
                // Finish
                navigate('/results', { state: { sessionId, company, role } });
            }
        } catch (err) {
            console.error("Failed to submit answer", err);
            alert("Failed to save answer. Please check your connection.");
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
                        answerText={answers[questions[currentIdx]._id] || ''}
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
