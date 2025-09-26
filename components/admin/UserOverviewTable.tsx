import React, { useState, useMemo } from 'react';

interface UserOverviewTableProps {
    users: any[];
    onViewUser: (userId: string) => void;
}

const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const styles = {
        Low: 'bg-green-500/10 text-green-400',
        Medium: 'bg-amber-500/10 text-amber-400',
        High: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>{level}</span>;
}

const UserOverviewTable: React.FC<UserOverviewTableProps> = ({ users, onViewUser }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.mobile.includes(searchTerm)
        );
    }, [users, searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-800 rounded-2xl p-6">
                 <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-white">User Management</h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 text-sm rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Credit Score</th>
                                <th scope="col" className="px-6 py-3">Risk Level</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Days Overdue</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/40">
                                    <td className="px-6 py-4 font-mono text-slate-300">#{user.id.substring(0,5)}</td>
                                    <td className="px-6 py-4 font-medium text-white">{user.firstName} {user.lastName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/50 text-slate-400'}`}>{user.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{user.creditScore}</td>
                                    <td className="px-6 py-4"><RiskBadge level={user.riskLevel} /></td>
                                    <td className="px-6 py-4">{user.dueDate || 'N/A'}</td>
                                    <td className={`px-6 py-4 font-bold ${user.daysOverdue > 0 ? 'text-red-400' : 'text-slate-400'}`}>{user.daysOverdue > 0 ? user.daysOverdue : '0'}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onViewUser(user.id)} className="font-medium text-teal-400 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            <p>No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOverviewTable;