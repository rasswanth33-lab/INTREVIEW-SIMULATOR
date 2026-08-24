import { Link } from 'react-router-dom';
import { ChevronRight, Clock, BookOpen } from 'lucide-react';

export default function CompanyCard({ company }) {
    return (
        <div className="group glass-card p-6 md:p-8 hover:scale-[1.02] hover:bg-white/[0.08] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full border-t border-t-white/20">
            <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-3xl font-bold border border-white/5 shadow-inner group-hover:from-blue-500 group-hover:to-indigo-600 transition-colors duration-500 text-white">
                    {company.logo}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{company.name}</h2>
            </div>

            <div className="mt-auto space-y-6">
                <div className="flex items-center gap-5 text-sm font-medium text-slate-400">
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {company.roles.length} Roles available</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Avg. 45 min</span>
                </div>
                <Link
                    to={`/roles/${company.id}`}
                    className="flex items-center justify-between w-full px-5 py-3.5 bg-white/5 rounded-xl hover:bg-white text-white hover:text-slate-900 font-semibold transition-all duration-300 ring-1 ring-white/10 hover:ring-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    View Roles
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
