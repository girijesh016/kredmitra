import React from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { AppStep } from '../../../types';

interface ApplicationFunnelProps {
    users: any[];
}

const ApplicationFunnel: React.FC<ApplicationFunnelProps> = ({ users }) => {
    const funnelData = [
        {
            name: 'Onboarding',
            value: users.filter(u => u.appStep >= AppStep.ONBOARDING).length,
            fill: '#14b8a6', // teal-500
        },
        {
            name: 'Scored',
            value: users.filter(u => u.appStep >= AppStep.SCORE_RESULT).length,
            fill: '#0d9488', // teal-600
        },
        {
            name: 'Validated',
            value: users.filter(u => u.appStep >= AppStep.COMMUNITY_VALIDATION).length,
            fill: '#0f766e', // teal-700
        },
        {
            name: 'Loan Active',
            value: users.filter(u => u.appStep >= AppStep.REPAYMENT_DASHBOARD).length,
            fill: '#115e59', // teal-800
        },
    ];

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <FunnelChart>
                    <Tooltip />
                    <Funnel
                        dataKey="value"
                        data={funnelData}
                        isAnimationActive
                    >
                        <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ApplicationFunnel;
