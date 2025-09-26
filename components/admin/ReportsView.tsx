import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import FeedbackCharts from './charts/FeedbackCharts';
import WellnessBadgeTracker from './charts/WellnessBadgeTracker';

interface ReportsViewProps {
    users: any[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ users }) => {
    const scoreDistributionData = useMemo(() => {
        const buckets = {
            '< 600': 0,
            '600-700': 0,
            '700-800': 0,
            '> 800': 0,
        };
        users.forEach(user => {
            if (user.creditScore < 600) buckets['< 600']++;
            else if (user.creditScore <= 700) buckets['600-700']++;
            else if (user.creditScore <= 800) buckets['700-800']++;
            else buckets['> 800']++;
        });
        return Object.entries(buckets).map(([name, value]) => ({ name, users: value }));
    }, [users]);

    const loanStatusData = useMemo(() => {
        const statuses = users.reduce((acc, user) => {
            const status = user.loanStatus || 'None';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        return Object.entries(statuses).map(([name, value]) => ({ name, value }));
    }, [users]);

    const PIE_COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#6b7280'];

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
            
            <div className="bg-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">AI Performance & User Feedback</h2>
                <FeedbackCharts users={users} />
            </div>
            
             <div className="bg-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Financial Wellness Tracker</h2>
                <WellnessBadgeTracker users={users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Credit Score Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={scoreDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Bar dataKey="users" fill="#14b8a6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Loan Status Overview</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={loanStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                    {loanStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
