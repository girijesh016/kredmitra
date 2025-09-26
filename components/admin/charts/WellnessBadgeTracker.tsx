import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WellnessBadgeTrackerProps {
    users: any[];
}

const BADGE_MASTER_LIST = [
    { id: 'onboarding', title: 'Onboarding' },
    { id: 'approval', title: 'Approval' },
    { id: 'first_payment', title: '1st Payment' },
    { id: 'halfway', title: 'Halfway' },
    { id: 'full_repayment', title: 'Repaid' },
];


const WellnessBadgeTracker: React.FC<WellnessBadgeTrackerProps> = ({ users }) => {
    const badgeData = useMemo(() => {
        const badgeCounts = BADGE_MASTER_LIST.map(masterBadge => {
            const count = users.reduce((acc, user) => {
                const userBadge = user.wellnessBadges?.find((b: any) => b.id === masterBadge.id);
                if (userBadge?.achieved) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return { name: masterBadge.title, users: count };
        });
        return badgeCounts;
    }, [users]);
    
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={badgeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Bar dataKey="users" fill="#f59e0b" name="Users Achieved" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WellnessBadgeTracker;
