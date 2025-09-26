import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface CommunityValidationProps {
    verificationStep: string;
    onComplete: () => void;
}

const CommunityValidation: React.FC<CommunityValidationProps> = ({ verificationStep, onComplete }) => {
    const [status, setStatus] = useState<'pending' | 'processing' | 'complete'>('pending');

    useEffect(() => {
        const timer1 = setTimeout(() => setStatus('processing'), 1000);
        const timer2 = setTimeout(() => setStatus('complete'), 5000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const statusInfo = {
        pending: { text: 'Pending Initiation', color: 'text-slate-500' },
        processing: { text: 'Verification in Progress...', color: 'text-amber-600' },
        complete: { text: 'Verification Logged', color: 'text-teal-600' },
    };

    return (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-teal-600 shadow-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-white" />
                </div>
                 <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${status === 'processing' ? 'bg-amber-500' : status === 'complete' ? 'bg-teal-500' : 'bg-slate-400'}`}>
                    {status === 'processing' && <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {status === 'complete' && <CheckBadgeIcon className="h-6 w-6 text-white" />}
                    {status === 'pending' && <div className="h-6 w-6 text-white font-bold text-lg animate-pulse">...</div>}
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Human-in-the-Loop Review</h2>
            <p className="text-slate-600 mb-6 max-w-md">This manual verification step helps ensure fairness and accuracy. Thank you for your patience.</p>

            <div className="w-full max-w-2xl text-left bg-slate-50/80 p-4 rounded-lg border border-slate-200/80 mb-6">
                 <p className="text-sm font-bold text-slate-600 mb-1">AI-Suggested Verification Task:</p>
                 <p className="text-base text-slate-800 font-medium">{verificationStep}</p>
            </div>
            
            <div className="w-full max-w-sm mb-8">
                <p className="text-sm font-semibold mb-2">Status: <span className={statusInfo[status].color}>{statusInfo[status].text}</span></p>
                <div className="w-full bg-slate-200/80 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${status === 'complete' ? 'bg-teal-500' : 'bg-teal-600'}`}
                        style={{ width: status === 'pending' ? '10%' : status === 'processing' ? '50%' : '100%' }}
                    ></div>
                </div>
            </div>

            {status === 'complete' && (
                <div className="w-full max-w-2xl bg-teal-50 p-6 rounded-lg animate-fade-in border border-teal-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Next Steps</h3>
                    <p className="text-slate-600 mb-4">The manual verification has been logged. A final review may be required, and the review schedule will be communicated to you shortly.</p>
                    <button 
                        onClick={onComplete}
                        className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Proceed to Loan Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommunityValidation;