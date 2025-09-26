import React from 'react';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

interface CrisisInterventionQueueProps {
    users: any[];
    showToast: (message: string) => void;
    updateUserRecord: (mobile: string, updates: Partial<any>) => void;
}

const CrisisInterventionQueue: React.FC<CrisisInterventionQueueProps> = ({ users, showToast, updateUserRecord }) => {
    const crisisUsers = users.filter(user => user.inCrisis);

    const handleAction = (user: any, action: string) => {
        switch (action) {
            case 'Approve':
                updateUserRecord(user.mobile, { inCrisis: false });
                showToast(`Suggestion approved for ${user.firstName}. User status updated.`);
                break;
            case 'Modify':
                showToast(`Modification plan initiated for ${user.firstName}.`);
                break;
            case 'Contact':
                showToast(`Contact request sent for ${user.firstName}.`);
                break;
            default:
                break;
        }
    };

    return (
        <div className="bg-amber-900/40 border border-amber-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Crisis Intervention Queue</h2>
            </div>

            {crisisUsers.length === 0 ? (
                <p className="text-slate-400 text-center py-4">The queue is clear. No users have reported a crisis.</p>
            ) : (
                <div className="space-y-4">
                    {crisisUsers.map(user => (
                        <div key={user.mobile} className="bg-slate-800/60 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-slate-400">User ID: #{user.mobile.substring(5)}</p>
                                </div>
                                <p className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Needs Attention</p>
                            </div>
                            <div className="mt-3 border-t border-slate-700/50 pt-3">
                                <p className="text-sm text-slate-300 mb-2">
                                    <strong className="font-semibold text-slate-400">User's Situation:</strong> "{user.crisisInfo.description}"
                                </p>
                                <p className="text-sm p-3 bg-slate-700/70 rounded-md text-teal-300">
                                    <strong className="font-semibold text-teal-400">AI Suggestion:</strong> {user.crisisInfo.aiSuggestion}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <button onClick={() => handleAction(user, 'Approve')} className="text-xs flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-3 rounded-md transition">Approve Suggestion</button>
                                <button onClick={() => handleAction(user, 'Modify')} className="text-xs flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md transition">Modify Plan</button>
                                <button onClick={() => handleAction(user, 'Contact')} className="text-xs flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md transition">Contact User</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CrisisInterventionQueue;