import { Link } from 'react-router-dom';
import { Clock, FileCode2, PlayCircle } from 'lucide-react';

export default function RoleCard({ role, company }) {
    return (
        <div className="group glass-card p-6 hover:scale-[1.01] hover:bg-white/10 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-2">{role.title}</h3>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-emerald-400" /> {role.duration}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <FileCode2 className="w-4 h-4 text-blue-400" /> {role.questions} Questions
                </span>
            </div>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                This interview simulates {company.name}'s actual {role.title} rounds. You will be tested on core concepts under time pressure.
            </p>

            <Link
                to={`/interview/${company.id}/${role.id}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-semibold hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40"
            >
                <PlayCircle className="w-5 h-5" /> Start Interview Context
            </Link>
        </div>
    );
}
