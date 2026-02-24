import { Link } from 'react-router-dom';
import { companies } from '../data/mockData';
import CompanyCard from '../components/CompanyCard';

export default function CompanySelection() {
    return (
        <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Select a Company</h1>
                <p className="text-lg text-slate-400 max-w-2xl">Choose your target company to browse mock interview scenarios tailored to their actual hiring processes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {companies.map(company => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
}
