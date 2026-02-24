import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="w-full px-6 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">Betch IUp – Interview Lab</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/companies" className="text-slate-300 hover:text-white transition-colors duration-300">
                        Companies
                    </Link>
                    <button className="px-5 py-2.5 bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}
