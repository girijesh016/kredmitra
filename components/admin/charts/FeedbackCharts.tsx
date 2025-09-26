import React, { useMemo } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FeedbackChartsProps {
    users: any[];
}

const FeedbackCharts: React.FC<FeedbackChartsProps> = ({ users }) => {
    const allFeedback = useMemo(() => users.flatMap(u => u.feedback || []), [users]);

    const sentimentData = useMemo(() => {
        const sentiments = allFeedback.reduce((acc, f) => {
            acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        return Object.entries(sentiments).map(([name, value]) => ({ name, value }));
    }, [allFeedback]);
    
    const categoryData = useMemo(() => {
        const categories = allFeedback.reduce((acc, f) => {
            acc[f.category] = (acc[f.category] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        return Object.entries(categories).map(([name, value]) => ({ name, count: value }));
    }, [allFeedback]);

    const SENTIMENT_COLORS = { 'Positive': '#2dd4bf', 'Negative': '#f43f5e', 'Neutral': '#f59e0b' };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ minHeight: '300px' }}>
            <div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Feedback Sentiment</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS] || '#64748b'} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div>
                 <h3 className="text-lg font-semibold text-white mb-2 text-center">Feedback Categories</h3>
                 <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" width={80} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Bar dataKey="count" fill="#14b8a6" />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FeedbackCharts;
