import { Link } from 'react-router-dom';
import { Play, Building2 } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex-1 flex items-center justify-center p-6 text-center relative z-10">
            <div className="max-w-4xl space-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-slate-300 backdrop-blur-md mb-2 shadow-lg w-max mx-auto">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    New: TCS & Zoho Interview Packs Available
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 leading-tight">
                    Practice Real Company <br className="hidden md:block" /> Interviews Before You Face Them.
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Simulate real placement interviews with structured rounds and time pressure. Build confidence in a realistic, premium, zero-distraction environment.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
                    <Link
                        to="/companies"
                        className="group flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto justify-center"
                    >
                        <Play className="w-5 h-5 fill-slate-900 transition-transform group-hover:translate-x-1" />
                        Start Mock Interview
                    </Link>
                    <Link
                        to="/companies"
                        className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-md w-full sm:w-auto justify-center shadow-xl"
                    >
                        <Building2 className="w-5 h-5 text-slate-300" />
                        Browse Companies
                    </Link>
                </div>
            </div>
        </div>
    );
}
