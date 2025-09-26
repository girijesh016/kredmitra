
import React, { useState, useEffect, useRef } from 'react';
import { UserData, Language, ScoreData } from '../types';
import { generateClarifyingQuestions } from '../services/geminiService';
import { translations } from './translations';

interface UssdSimulatorProps {
    onComplete: () => void;
    language: Language;
    processApplication: (data: Partial<UserData>) => Promise<ScoreData | null>;
    onBack: () => void;
}

interface UssdStep {
    id: string;
    question: string;
    options?: string[];
    isNumeric?: boolean;
    maxLength?: number;
    nextStep?: (input: string) => string;
    isClarification?: boolean;
    originalQuestion?: string;
    dataKey?: string; 
    dataType?: 'string' | 'number' | 'boolean'; 
}

const generateSteps = (language: Language): UssdStep[] => {
    const t = translations[language].ussd;
    const common = translations[language];
    const profQuestions = translations[language].professionQuestions;

    const shgMemberIndex = translations.en.professions.indexOf("SHG Member");
    const ussdProfessions = common.professions.filter((_, index) => index !== shgMemberIndex);

    const professionNextStep = (input: string): string => {
        const selectedProfessionTranslated = ussdProfessions[parseInt(input, 10) - 1];
        const originalIndex = common.professions.indexOf(selectedProfessionTranslated);
        const professionEnglish = translations.en.professions[originalIndex];

        if (professionEnglish === 'Small Farmer') return 'farmer_q2';
        if (professionEnglish === 'Gig Worker') return 'gig_q2';
        if (professionEnglish === 'Kirana Shop Owner') return 'kirana_q2';
        if (professionEnglish === 'Micro-Entrepreneur') return 'micro_q3';
        return 'financialStatement_optional';
    };

    return [
        { id: 'name', question: t.welcome },
        { id: 'phone', question: t.phone, isNumeric: true, maxLength: 10 },
        { id: 'aadhaar', question: t.aadhaar, isNumeric: true, maxLength: 12 },
        { id: 'profession', question: `${t.profession}\n${ussdProfessions.map((p, i) => `${i + 1}. ${p}`).join('\n')}`, options: ussdProfessions, nextStep: professionNextStep },
        
        { id: 'farmer_q2', question: profQuestions['Small Farmer'].landSizeAcres.label, isNumeric: true, dataKey: 'landSizeAcres', dataType: 'number', nextStep: () => 'financialStatement_optional' },
        { id: 'gig_q2', question: profQuestions['Gig Worker'].avgDailyEarnings.label, isNumeric: true, dataKey: 'avgDailyEarnings', dataType: 'number', nextStep: () => 'financialStatement_optional' },
        { id: 'kirana_q2', question: profQuestions['Kirana Shop Owner'].inventoryValue.label, isNumeric: true, dataKey: 'inventoryValue', dataType: 'number', nextStep: () => 'financialStatement_optional' },
        { id: 'micro_q3', question: profQuestions['Micro-Entrepreneur'].avgMonthlyProfit.label, isNumeric: true, dataKey: 'avgMonthlyProfit', dataType: 'number', nextStep: () => 'financialStatement_optional' },


        { id: 'financialStatement_optional', question: t.financialStatementOptional, options: [t.yes, t.no], nextStep: (input) => input === '1' ? 'financialStatement' : 'analyzing' },
        { id: 'financialStatement', question: t.financialStatement },
        
        { id: 'analyzing', question: t.analyzing },
        
        { id: 'pincode', question: t.pincode, isNumeric: true, maxLength: 6 },
        { id: 'incomeType', question: `${t.incomeType}\n${common.incomeTypes.map((it, i) => `${i + 1}. ${it}`).join('\n')}`, options: common.incomeTypes },
        { id: 'bankName', question: t.bankName },
        { id: 'accountNumber', question: t.accountNumber, isNumeric: true },
        { id: 'ifscCode', question: t.ifscCode },
        { id: 'savingsHabit', question: t.savingsHabit, options: [t.yes, t.no] },
        { id: 'hasReference', question: t.hasReference, options: [t.yes, t.no], nextStep: (input) => input === '1' ? 'referenceName' : 'q1' },
        { id: 'referenceName', question: t.referenceName },
        { id: 'referenceRelationship', question: t.referenceRelationship },
        { id: 'q1', question: `${common.psychometricQuestions.q1.question}\n${common.psychometricQuestions.q1.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`, options: common.psychometricQuestions.q1.options },
    ];
};

const UssdSimulator: React.FC<UssdSimulatorProps> = ({ onComplete, language, processApplication, onBack }) => {

    const t = translations[language];
    const [steps, setSteps] = useState<UssdStep[]>(() => generateSteps(language));
    const [stepIndex, setStepIndex] = useState(0);
    const [userData, setUserData] = useState<Partial<UserData>>({
        psychometricResponses: {},
        clarificationResponses: [],
        alternativeData: {},
        financialStatement: "",
    });
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'collecting' | 'processing' | 'processed' | 'error'>('collecting');
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const hasAnalyzed = useRef(false);
    const currentStep = steps[stepIndex];
    const isAnalyzingStep = currentStep?.id === 'analyzing';
    
    useEffect(() => {
        if (inputRef.current && status === 'collecting') {
            inputRef.current.focus();
        }
    }, [stepIndex, status]);

    useEffect(() => {
        const analyzeStatement = async () => {
            if (isAnalyzingStep && !hasAnalyzed.current) {
                hasAnalyzed.current = true; 
                try {
                    const questions = await generateClarifyingQuestions(userData.financialStatement || "");
                    const clarificationSteps: UssdStep[] = questions.map((q, i) => ({
                        id: `clarification_${i}`,
                        question: q,
                        isClarification: true,
                        originalQuestion: q,
                    }));

                    if (clarificationSteps.length > 0) {
                        setSteps(prevSteps => {
                            const analyzingIndex = prevSteps.findIndex(s => s.id === 'analyzing');
                            const newSteps = [...prevSteps];
                            if (analyzingIndex !== -1) {
                                newSteps.splice(analyzingIndex + 1, 0, ...clarificationSteps);
                            }
                            return newSteps;
                        });
                    }
                    
                    const analyzingIndex = steps.findIndex(s => s.id === 'analyzing');
                    setStepIndex(analyzingIndex + 1);

                } catch (err) {
                    console.error("Error generating questions, skipping.", err);
                    const analyzingIndex = steps.findIndex(s => s.id === 'analyzing');
                    setStepIndex(analyzingIndex + 1);
                }
            }
        };
        analyzeStatement();
    }, [isAnalyzingStep, userData.financialStatement, steps]);

    const handleValueChange = (newValue: string) => {
        let value = newValue;
        setError('');

        if (currentStep.isNumeric) {
            value = value.replace(/\D/g, '');
        }
        if (currentStep.maxLength && value.length > currentStep.maxLength) {
            value = value.slice(0, currentStep.maxLength);
        }
        setInputValue(value);
    };

    const handleKeypadClick = (key: string) => {
        if (status !== 'collecting' && status !== 'processed') return;
        handleValueChange(inputValue + key);
    };

    const handleClear = () => {
        handleValueChange('');
    };


    const handleSubmit = () => {
        if (status === 'processed') {
            onComplete();
            return;
        }
        if(isAnalyzingStep) return;

        if (!inputValue.trim() && currentStep.id !== 'financialStatement') {
            setError(t.errors.emptyInput);
            return;
        }
        
        let newData = JSON.parse(JSON.stringify(userData));
        let nextStepIndex = stepIndex + 1;
        let selectedValue = inputValue;

        if (currentStep.options) {
            const index = parseInt(inputValue, 10) - 1;
            if (index < 0 || index >= currentStep.options.length) {
                setError(t.errors.invalidSelection);
                return;
            }
            selectedValue = currentStep.options[index];
        }

        if (currentStep.dataKey) {
            let value: any = selectedValue;
            if (currentStep.dataType === 'number') value = parseInt(inputValue, 10);
            if (currentStep.dataType === 'boolean') value = selectedValue === t.ussd.yes;
            (newData.alternativeData as any)[currentStep.dataKey] = value;
        } else if (['profession', 'incomeType'].includes(currentStep.id)) {
            newData[currentStep.id] = selectedValue;
        } else if (['q1', 'q2', 'q3'].includes(currentStep.id)) {
            (newData.psychometricResponses as any)[currentStep.id] = selectedValue;
        } else if (currentStep.isClarification) {
            newData.clarificationResponses!.push({ question: currentStep.originalQuestion!, answer: inputValue });
        } else if (currentStep.id === 'referenceName') {
            newData.referenceContact = { ...(newData.referenceContact || {}), name: inputValue } as any;
        } else if (currentStep.id === 'referenceRelationship') {
            newData.referenceContact = { ...(newData.referenceContact || {}), relationship: inputValue } as any;
        } else {
             if (currentStep.id !== 'financialStatement_optional') {
                (newData as any)[currentStep.id] = inputValue;
             }
        }
        
        setUserData(newData);

        if (currentStep.id === 'q1') {
            setStatus('processing');
            processApplication(newData).then(scoreData => {
                if (scoreData) {
                    setFinalScore(scoreData.finalScore);
                    setStatus('processed');
                } else {
                    setError('Could not process application. Please try again.');
                    setStatus('error');
                }
            });
            return;
        }

        if (currentStep.nextStep) {
            const nextId = currentStep.nextStep(inputValue);
            const foundIndex = steps.findIndex(s => s.id === nextId);
            if(foundIndex > -1) {
                nextStepIndex = foundIndex;
            }
        } else {
            const currentIndexInSteps = steps.findIndex(s => s.id === currentStep.id);
            if (currentIndexInSteps !== -1 && currentIndexInSteps + 1 < steps.length) {
                nextStepIndex = currentIndexInSteps + 1;
            }
        }
        
        if (currentStep.id === 'financialStatement') {
            const analyzingIndex = steps.findIndex(s => s.id === 'analyzing');
            if (analyzingIndex !== -1) {
                nextStepIndex = analyzingIndex;
            }
        }

        setInputValue('');
        setError('');
        setStepIndex(nextStepIndex);
    };
    
    const renderScreenContent = () => {
        switch (status) {
            case 'collecting':
                return (
                    <>
                        <p className="whitespace-pre-wrap text-sm leading-tight flex-grow">{currentStep?.question}</p>
                        <div className="relative mt-1">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => handleValueChange(e.target.value)}
                                className="w-full bg-transparent text-white font-bold h-6 border-none focus:outline-none focus:ring-0 text-left p-0"
                                autoFocus
                            />
                            <div className="absolute left-0 bottom-0 w-full h-px bg-white/50"></div>
                             {isAnalyzingStep && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>}
                        </div>
                        {error && <p className="text-red-400 text-xs mt-1 h-4">{error}</p>}
                    </>
                );
            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-4 text-sm">{t.ussd.analyzing}</p>
                    </div>
                );
            case 'processed':
                 return (
                     <p className="whitespace-pre-wrap flex-grow text-sm">{t.ussd.finalScoreMessage.replace('{score}', finalScore?.toString() || 'N/A')}</p>
                 );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                );
        }
    };
    
    const KeypadButton: React.FC<{ number: string, letters?: string, onClick: () => void, className?: string }> = ({ number, letters, onClick, className = '' }) => (
        <button
            onClick={onClick}
            className={`h-12 bg-gray-600 rounded-md text-white flex flex-col items-center justify-center leading-none p-1 transition-all duration-100 ease-in-out shadow-sm border-b-2 border-gray-800 hover:bg-gray-500 active:shadow-inner active:bg-gray-700 active:border-b-0 active:translate-y-px ${className}`}
        >
            <span className="text-xl font-sans font-semibold">{number}</span>
            {letters && <span className="text-[9px] tracking-widest font-sans uppercase text-gray-300">{letters}</span>}
        </button>
    );

    return (
        <div className="animate-fade-in flex justify-center items-center p-4">
            <div className="w-full max-w-[280px] bg-[#313843] rounded-[2rem] border-4 border-black p-2 font-mono text-white shadow-2xl">
                {/* Screen Area */}
                <div className="bg-black p-4 rounded-xl">
                     <div className="flex justify-between items-center text-xs text-gray-400 mb-1 px-1">
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M0 13.5h4v-13H0v13zm5 0h4V.5H5v13zm5 0h4V.5h-4v13z"/></svg>
                            <span>4G</span>
                        </div>
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1v12H2V1h12zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"/><path d="M12.5 3H11v8h1.5V3z"/></svg>
                    </div>
                    <div className="bg-[#4a7267] rounded p-2 min-h-[14rem] flex flex-col justify-between text-base text-white font-medium tracking-wide font-sans">
                       {renderScreenContent()}
                    </div>
                </div>

                <div className="text-center py-2 text-xl font-bold tracking-wider text-gray-400">NOKIA</div>
                
                {/* Keypad */}
                <div className="px-2 pb-2">
                     <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                        <button className="h-8 bg-gray-600 rounded-md"></button>
                        <div className="h-8 bg-gray-600 rounded-full flex items-center justify-center p-1">
                            <div className="w-full h-full bg-gray-700 rounded-full"></div>
                        </div>
                        <button onClick={handleClear} className="h-8 bg-gray-600 rounded-md flex items-center justify-center text-xs text-gray-300 font-sans font-bold hover:bg-gray-500 active:bg-gray-700">C</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                        <KeypadButton number="1" letters=".," onClick={() => handleKeypadClick('1')} />
                        <KeypadButton number="2" letters="abc" onClick={() => handleKeypadClick('2')} />
                        <KeypadButton number="3" letters="def" onClick={() => handleKeypadClick('3')} />
                        <KeypadButton number="4" letters="ghi" onClick={() => handleKeypadClick('4')} />
                        <KeypadButton number="5" letters="jkl" onClick={() => handleKeypadClick('5')} />
                        <KeypadButton number="6" letters="mno" onClick={() => handleKeypadClick('6')} />
                        <KeypadButton number="7" letters="pqrs" onClick={() => handleKeypadClick('7')} />
                        <KeypadButton number="8" letters="tuv" onClick={() => handleKeypadClick('8')} />
                        <KeypadButton number="9" letters="wxyz" onClick={() => handleKeypadClick('9')} />
                        <KeypadButton number="*" letters="-" onClick={() => handleKeypadClick('*')} />
                        <KeypadButton number="0" letters="+" onClick={() => handleKeypadClick('0')} />
                        <KeypadButton number="#" letters="_" onClick={() => handleKeypadClick('#')} />
                    </div>
                    <div className="mt-2.5 flex justify-between items-center gap-2.5">
                        <button onClick={handleSubmit} className="h-10 w-16 bg-green-600 rounded-md text-white flex items-center justify-center hover:bg-green-500 active:bg-green-700 transition-colors shadow-sm border-b-2 border-green-800">
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </button>
                        <button onClick={onBack} className="h-10 w-16 bg-red-600 rounded-md text-white flex items-center justify-center hover:bg-red-500 active:bg-red-700 transition-colors shadow-sm border-b-2 border-red-800">
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.62.72c-.4.13-.68.52-.68.95V12c0 .55.45 1 1 1h2.59l5.7 5.7c.39.39 1.02.39 1.41 0l.29-.29c.39-.39.39-1.02 0-1.41L13.41 12l4.29-4.29c.39-.39.39-1.02 0-1.41l-.29-.29c-.39-.39-1.02-.39-1.41 0L12.59 10H10c-.55 0-1-.45-1-1v-1.28c0-.43-.28-.82-.68-.95C7.15 6.25 5.6 6 4 6c-.55 0-1 .45-1 1s.45 1 1 1c1.31 0 2.58.19 3.77.54l-2.06 2.06c-.39.39-.39 1.02 0 1.41l.29.29c.39.39 1.02.39 1.41 0L12 9z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UssdSimulator;
