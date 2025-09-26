import React from 'react';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { FlagIcon } from '../icons/FlagIcon';

interface DetailedUserViewProps {
    user: any;
    onBack: () => void;
    showToast: (message: string) => void;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, description: string }> = ({ title, value, icon, description }) => (
    <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center text-slate-400 mb-2">
            {icon}
            <h4 className="ml-2 text-sm font-medium">{title}</h4>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
);

const RiskFlag: React.FC<{ title: string, description: string, level: 'High' | 'Medium' }> = ({ title, description, level }) => {
    const color = level === 'High' ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-amber-500 bg-amber-500/10 text-amber-300';
    return (
        <div className={`border-l-4 p-4 rounded-r-lg flex items-start gap-4 ${color}`}>
            <div className="flex-shrink-0 pt-1">
                <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
                <h5 className="font-semibold text-white">{title}</h5>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
};

// Copied from UserOverviewTable to be self-contained
const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const styles = {
        Low: 'bg-green-500/10 text-green-400',
        Medium: 'bg-amber-500/10 text-amber-400',
        High: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[level]} mt-2`}>{level}</span>;
}

const DetailedUserView: React.FC<DetailedUserViewProps> = ({ user, onBack, showToast }) => {
    const confidenceScore = 87; // Mock data

    const riskFlagMap: { [key: string]: { description: string, level: 'High' | 'Medium' } } = {
        'SIM Swap': { description: "Recent SIM swap detected. This could be a sign of fraudulent activity.", level: 'High' },
        'Multiple Aadhaar Linked': { description: "Multiple Aadhaar numbers linked to the same phone number. This could indicate identity fraud.", level: 'Medium' },
        'High Churn Risk': { description: "High probability of the user switching to another network. This may indicate dissatisfaction or financial instability.", level: 'Medium' }
    };

    const handleActionClick = (action: string) => {
        showToast(`${action} action sent to user's registered phone number.`);
    };

    const getScoreColorClass = (score: number) => {
        if (score > 700) return 'text-green-400';
        if (score > 600) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-sm text-slate-400">{user.mobile}</p>
                </div>
                 <button onClick={onBack} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors">
                    &larr; Back to Users
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1 bg-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Credit Score</h3>
                    <p className={`text-6xl font-bold ${getScoreColorClass(user.creditScore)}`}>{user.creditScore}</p>
                    <RiskBadge level={user.riskLevel} />
                </div>
                <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Confidence Score</h3>
                    <div className="w-full bg-slate-700 rounded-full h-4">
                        <div className="bg-teal-500 h-4 rounded-full" style={{ width: `${confidenceScore}%` }}></div>
                    </div>
                    <p className="text-right mt-1 text-sm font-bold text-teal-400">{confidenceScore}%</p>
                    <p className="text-xs text-slate-500 mt-2">Confidence in the AI's assessment based on data quality and consistency.</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Underwriting Details</h2>
            
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Derived Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="SIM Age (Days)" value={user.simAgeDays} icon={<SparklesIcon className="w-4 h-4" />} description="Longer age indicates a more stable user." />
                    <StatCard title="Recharges (Last 6m)" value={user.rechargesLast6M} icon={<SparklesIcon className="w-4 h-4" />} description="Higher frequency suggests consistent usage." />
                    <StatCard title="Avg Top-Up Amount" value={`₹${user.avgTopUp.toFixed(2)}`} icon={<SparklesIcon className="w-4 h-4" />} description="Higher value may indicate better capacity." />
                    <StatCard title="Recharge Variance" value={user.rechargeVariance} icon={<SparklesIcon className="w-4 h-4" />} description="High variance might indicate irregular income." />
                    <StatCard title="Mobility Index" value={user.mobilityIndex} icon={<SparklesIcon className="w-4 h-4" />} description="Higher index may mean a more mobile user." />
                    <StatCard title="Suspicious SIM Swaps" value={user.simSwaps} icon={<SparklesIcon className="w-4 h-4" />} description="Swaps in last 12 months can be a red flag." />
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Flags</h3>
                <div className="space-y-4">
                    {user.riskFlags.length > 0 ? (
                        user.riskFlags.map((flag: string) => (
                           <RiskFlag key={flag} title={flag} description={riskFlagMap[flag]?.description || ''} level={riskFlagMap[flag]?.level || 'Medium'} />
                        ))
                    ) : (
                        <div className="text-center py-4 bg-slate-800 rounded-lg">
                           <p className="text-slate-500">No significant risk flags detected for this user.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                 <h3 className="text-lg font-semibold text-white mb-4">Recommended Actions</h3>
                 <div className="flex items-center gap-4">
                     <button onClick={() => handleActionClick("Vouching")} className="flex-1 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 transition-colors flex items-center justify-center gap-2">
                         <ShieldCheckIcon className="w-5 h-5"/> Proceed to Vouch
                     </button>
                      <button onClick={() => handleActionClick("Document Request")} className="flex-1 bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                          <DocumentTextIcon className="w-5 h-5"/> Request Documents
                     </button>
                      <button onClick={() => handleActionClick("Manual Review Flag")} className="flex-1 bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-2">
                          <FlagIcon className="w-5 h-5"/> Flag for Manual Review
                     </button>
                 </div>
            </div>

        </div>
    );
};

export default DetailedUserView;
