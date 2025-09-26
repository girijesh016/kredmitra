import React, { useMemo } from 'react';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import ApplicationFunnel from './charts/ApplicationFunnel';
import ChannelPieChart from './charts/ChannelPieChart';
import { UserIcon } from '../icons/UserIcon';
import CrisisInterventionQueue from './CrisisInterventionQueue';

interface MainDashboardViewProps {
    users: any[];
    showToast: (message: string) => void;
    updateUserRecord: (mobile: string, updates: Partial<any>) => void;
}

const StatCard: React.FC<{ title: string, value: string, change?: string, changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="bg-slate-800 p-6 rounded-2xl">
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <div className="flex items-baseline gap-4 mt-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {change && changeType && (
                 <div className={`flex items-center text-sm font-semibold ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                    {changeType === 'increase' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    <span>{change}</span>
                </div>
            )}
        </div>
    </div>
);


const MainDashboardView: React.FC<MainDashboardViewProps> = ({ users, showToast, updateUserRecord }) => {

    const totalUsers = users.length;
    const activeLoans = users.filter(u => u.loanStatus === 'Active').length;
    const totalDisbursed = users.reduce((acc, user) => acc + (user.loanAmount || 0), 0);
    const portfolioAtRisk = users.filter(u => u.riskLevel === 'High' && u.loanStatus === 'Active').length / (activeLoans || 1);

    const portfolioData = useMemo(() => {
        const statuses = ['Active', 'Pending', 'Completed', 'Rejected'];
        const overview = statuses.map(status => {
            const filteredUsers = users.filter(u => u.loanStatus === status);
            return {
                status,
                count: filteredUsers.length,
                totalValue: filteredUsers.reduce((acc, user) => acc + (user.loanAmount || 0), 0)
            };
        });
        return overview;
    }, [users]);

    const recentUsers = useMemo(() => {
        return [...users]
            .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
            .slice(0, 5);
    }, [users]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <StatCard title="Total Users" value={totalUsers.toLocaleString()} />
                    <StatCard title="Active Loans" value={activeLoans.toLocaleString()} />
                    <StatCard title="Total Amount Disbursed" value={`₹${(totalDisbursed / 1000).toFixed(1)}k`} />
                    <StatCard title="Portfolio at Risk" value={`${(portfolioAtRisk * 100).toFixed(1)}%`} change="0.2%" changeType="decrease" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-800 rounded-2xl p-6">
                         <h2 className="text-xl font-bold text-white mb-4">Application Funnel</h2>
                         <ApplicationFunnel users={users} />
                    </div>
                     <div className="bg-slate-800 rounded-2xl p-6">
                         <h2 className="text-xl font-bold text-white mb-4">Channel Performance</h2>
                        <ChannelPieChart users={users} />
                    </div>
                </div>
                <div className="lg:col-span-3 space-y-8">
                    <CrisisInterventionQueue users={users} showToast={showToast} updateUserRecord={updateUserRecord} />
                    <div className="bg-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Loan Portfolio Overview</h2>
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Status</th>
                                        <th scope="col" className="px-4 py-3 text-right"># of Loans</th>
                                        <th scope="col" className="px-4 py-3 text-right">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolioData.map(item => (
                                        <tr key={item.status} className="border-b border-slate-700 last:border-b-0">
                                            <td className="px-4 py-3 font-medium text-white">{item.status}</td>
                                            <td className="px-4 py-3 text-right">{item.count}</td>
                                            <td className="px-4 py-3 text-right">₹{item.totalValue.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Recent User Activity</h2>
                        <ul className="space-y-4">
                            {recentUsers.map(user => (
                                <li key={user.mobile} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-slate-400">Status: {user.status} - Loan: {user.loanStatus}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 flex-shrink-0">{user.lastActivity}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MainDashboardView;