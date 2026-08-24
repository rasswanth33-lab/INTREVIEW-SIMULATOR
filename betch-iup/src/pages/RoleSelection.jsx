import { useParams, Link, useNavigate } from 'react-router-dom';
import { companies } from '../data/mockData';
import { ArrowLeft } from 'lucide-react';
import RoleCard from '../components/RoleCard';

export default function RoleSelection() {
    const { companyId } = useParams();
    const navigate = useNavigate();

    const company = companies.find(c => c.id === companyId);

    if (!company) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Company not found</h2>
                    <button onClick={() => navigate('/companies')} className="text-blue-400 hover:text-blue-300">Go back to companies</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
            <button
                onClick={() => navigate('/companies')}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 w-max group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Companies
            </button>

            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold border border-white/10 text-white">
                    {company.logo}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{company.name} Roles</h1>
                    <p className="text-slate-400">Select a role to start your mock interview.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.roles.map(role => (
                    <RoleCard key={role.id} role={role} company={company} />
                ))}
            </div>
        </div>
    );
}
