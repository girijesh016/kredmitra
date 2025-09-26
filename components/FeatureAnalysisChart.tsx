import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { IntegratedProfile } from '../types';

interface FeatureAnalysisChartProps {
    profile: IntegratedProfile;
}

const FeatureAnalysisChart: React.FC<FeatureAnalysisChartProps> = ({ profile }) => {
    
    const data = [
        {
            subject: 'Financial Discipline',
            A: Math.round(((profile.utility.paymentDisciplineScore + profile.banking.incomePredictability) / 2) * 100),
            fullMark: 100,
        },
        {
            subject: 'Community Standing',
            A: Math.round(profile.telecom.simStabilityScore * 100),
            fullMark: 100,
        },
        {
            subject: 'Savings Capacity',
            A: Math.round(profile.banking.savingsCapacity * 100),
            fullMark: 100,
        },
        {
            subject: 'Location Factors',
            A: Math.round(profile.geospatial.localEconomicStabilityScore * 100),
            fullMark: 100,
        },
        {
            subject: 'Consistency',
            A: Math.round(profile.telecom.rechargeConsistency * 100),
            fullMark: 100,
        },
    ];

    return (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-lg animate-fade-in">
             <h3 className="text-xl font-bold mb-1 text-slate-800">Integrated Feature Analysis</h3>
             <p className="text-slate-600 text-sm mb-4">This chart shows your profile strength across various verified data points.</p>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} />
                        <Radar name="Your Profile" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FeatureAnalysisChart;