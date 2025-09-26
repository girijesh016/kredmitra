import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface ProcessingProps {
    steps: { text: string; delay: number }[];
}

const Processing: React.FC<ProcessingProps> = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, steps[currentStep].delay);
            return () => clearTimeout(timer);
        }
    }, [currentStep, steps]);

    return (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-6 w-32 h-32 flex items-center justify-center">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                 <span className="animate-ping absolute inline-flex h-3/4 w-3/4 rounded-full bg-teal-500 opacity-75" style={{animationDelay: '0.2s'}}></span>
                <div className="relative w-24 h-24 rounded-full bg-teal-600 shadow-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-12 w-12 text-white" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Your Profile</h2>
            <p className="text-slate-600 mb-6 max-w-md">Our AI agents are working together to build a complete picture of your financial health. This may take a moment.</p>
            
            <div className="w-full max-w-md space-y-3">
                {steps.slice(0, currentStep + 1).map((step, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-lg transition-all duration-500 ${index === currentStep ? 'bg-teal-50 scale-105 shadow-sm' : 'bg-slate-50/60'}`}>
                        {index < currentStep ? (
                             <div className="w-6 h-6 mr-3 flex-shrink-0 flex items-center justify-center bg-teal-500 text-white rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        ) : (
                            <svg className="w-6 h-6 text-teal-600 mr-3 animate-spin flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span className={`text-sm font-medium ${index === currentStep ? 'text-teal-600' : 'text-slate-500'}`}>{step.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Processing;