import React, { useState, useRef, useEffect } from 'react';
import type { UserData, AdditionalDocument, Language, ScoreData } from '../types';
// FIX: Import JourneyStep from the shared types file to resolve dependencies.
import { JourneyStep } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { CameraIcon } from './icons/CameraIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { getOnboardingHelp, verifyDocumentAuthenticity, simulateVernacularOcr, getConsentExplanation, generateClarifyingQuestions } from '../services/geminiService';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { PuzzlePieceIcon } from './icons/PuzzlePieceIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { ComputerDesktopIcon } from './icons/ComputerDesktopIcon';
import { DevicePhoneMobileIcon } from './icons/DevicePhoneMobileIcon';
import UssdSimulator from './UssdSimulator';
import { XMarkIcon } from './icons/XMarkIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { FingerPrintIcon } from './icons/FingerPrintIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { CurrencyRupeeIcon } from './icons/CurrencyRupeeIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { LinkIcon } from './icons/LinkIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { CloudArrowUpIcon } from './icons/CloudArrowUpIcon';
import { translations, supportedLanguages } from './translations';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { verifyUserInTestDB } from '../services/testingDatabase';


interface OnboardingProps {
  onComplete: (data: UserData, source: 'webapp' | 'ussd') => void;
  language: Language;
  setLanguage: (language: Language) => void;
  processUssdApplication?: (data: UserData) => Promise<ScoreData | null>;
  onVerificationFailed: () => void;
}

// FIX: Removed local JourneyStep enum as it's now imported from types.ts.
enum InputMode {
  TYPE,
  SPEAK,
  UPLOAD,
  CONNECT,
}

// State for an uploaded document within the component
interface UploadedDocState {
  id: number;
  name: string;
  mimeType: string;
  base64Data: string;
  previewUrl: string;
  status: 'loading' | 'verified' | 'error';
  verificationMessage: string;
  category: 'Identity' | 'Work' | 'Asset' | 'Other';
}


// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;


const Onboarding: React.FC<OnboardingProps> = ({ onComplete, language, setLanguage, processUssdApplication, onVerificationFailed }) => {
  const t = translations[language];

  const psychometricQuestions = t.psychometricQuestions;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    const langMap: Record<Language, string> = { en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN' };
    recognition.lang = langMap[language];
  }

  const Stepper: React.FC<{ currentStep: JourneyStep, onStepClick: (step: JourneyStep) => void }> = ({ currentStep, onStepClick }) => {
    const steps = t.stepper;

    return (
        <nav className="mb-8" aria-label="Progress">
            <ol role="list" className="grid grid-cols-5">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative flex flex-col items-center`}>
                        <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200" style={{ transform: 'translateX(-50%)', zIndex: -1 }}></div>
                         {currentStep > step.id && <div className="absolute top-4 left-0 w-full h-0.5 bg-teal-600" style={{zIndex: -1}}></div>}
                         {currentStep === step.id && <div className="absolute top-4 left-0 w-1/2 h-0.5 bg-teal-600" style={{zIndex: -1}}></div>}

                        <button
                            onClick={() => onStepClick(step.id)}
                            disabled={step.id > currentStep}
                            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 disabled:cursor-not-allowed"
                            style={{
                                borderColor: currentStep >= step.id ? '#0d9488' : '#e2e8f0',
                                backgroundColor: currentStep > step.id ? '#0d9488' : 'white'
                            }}
                        >
                            {currentStep > step.id ? (
                                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span className={`h-2.5 w-2.5 rounded-full ${currentStep === step.id ? 'bg-teal-600' : 'bg-transparent group-hover:bg-slate-300'}`} />
                            )}
                        </button>
                        <p className={`text-xs font-medium mt-2 text-center ${currentStep >= step.id ? 'text-teal-600' : 'text-slate-500'}`}>{step.name}</p>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

  const [step, setStep] = useState<JourneyStep>(JourneyStep.INFO);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TYPE);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState(''); // The generated OTP
  const [otpInput, setOtpInput] = useState(''); // The user's input
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [incomeType, setIncomeType] = useState('');
  const [financialStatement, setFinancialStatement] = useState('');
  const [financialStatementImage, setFinancialStatementImage] = useState<{mimeType: string, data: string} | null>(null);
  const [digitizedLedgerText, setDigitizedLedgerText] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<UploadedDocState[]>([]);
  const [referenceName, setReferenceName] = useState('');
  const [referenceRelationship, setReferenceRelationship] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalDocsFileInputRef = useRef<HTMLInputElement>(null);

  const [showHelpChat, setShowHelpChat] = useState(false);
  const [helpQuestion, setHelpQuestion] = useState('');
  const [helpResponse, setHelpResponse] = useState('');
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const [docVerification, setDocVerification] = useState<{status: 'loading' | 'verified' | 'error', message: string} | null>(null);
  const [ocrStatus, setOcrStatus] = useState<'loading' | 'done' | 'error' | null>(null);
  const [psychometricResponses, setPsychometricResponses] = useState<{ [key: string]: string }>({});
  const [showConsentExplanation, setShowConsentExplanation] = useState(false);
  const [consentExplanation, setConsentExplanation] = useState('');
  const [isConsentLoading, setIsConsentLoading] = useState(false);
  
  const [clarifyingQuestions, setClarifyingQuestions] = useState<{question: string, answer: string}[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const [feedbackKeywords, setFeedbackKeywords] = useState({ income: false, expenses: false, savings: false });

  // New states for the enhanced channel selection screen
  const [channel, setChannel] = useState<'select' | 'webapp' | 'ussd'>('select');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // New states for alternative data
  const [alternativeData, setAlternativeData] = useState<any>({});
  const [showAlternativeData, setShowAlternativeData] = useState(false);
  const [simAgeDays, setSimAgeDays] = useState('');
  const [avgTopupAmount, setAvgTopupAmount] = useState('');
  const [utilityBillsPaidLast6M, setUtilityBillsPaidLast6M] = useState('');
  const [dataUsageMb, setDataUsageMb] = useState('');
  const [tenure, setTenure] = useState('');
  const [contract, setContract] = useState('');
  const [paperlessBilling, setPaperlessBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [monthlyCharges, setMonthlyCharges] = useState('');
  const [totalCharges, setTotalCharges] = useState('');

  // Bank details state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [ifscError, setIfscError] = useState('');

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    if (otpTimer > 0) {
        timerInterval = setInterval(() => {
            setOtpTimer(prev => prev - 1);
        }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpTimer]);
  
  useEffect(() => {
    const text = financialStatement.toLowerCase();
    setFeedbackKeywords({
        income: new RegExp(t.feedbackKeywords.income.join('|')).test(text),
        expenses: new RegExp(t.feedbackKeywords.expenses.join('|')).test(text),
        savings: new RegExp(t.feedbackKeywords.savings.join('|')).test(text),
    });
  }, [financialStatement, t.feedbackKeywords]);

  const handleStepClick = (clickedStep: JourneyStep) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        setFinancialStatement(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            setError(t.errors.micPermission);
        } else {
            setError(t.errors.speechRecognition);
        }
        setIsRecording(false);
    };
    
    recognition.onend = () => {
        if(isRecording) {
            setIsRecording(false);
        }
    };

    return () => {
        if (recognition) {
            recognition.stop();
        }
    };
  }, [isRecording, t.errors]);
  
  const handleSendOtp = () => {
    if (phone.length !== 10) return;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    alert(`${t.otpMessage} ${generatedOtp}`);
    setIsOtpSent(true);
    setOtpTimer(60);
    setError(null);
  };

  const handleVerifyOtp = () => {
    setIsOtpVerified(true);
    setOtpTimer(0);
    setError(null);
  };
  
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && profession && incomeType && location && isOtpVerified && aadhaar.length === 12 && pincode.length === 6 && bankName && accountNumber && ifscCode && !ifscError) {
      const isVerified = verifyUserInTestDB(
        name,
        aadhaar,
        phone,
        accountNumber
      );

      if (isVerified) {
        setStep(JourneyStep.CONSENT);
      } else {
        onVerificationFailed();
      }
    }
  };
  
  const prefillExample = (type: 'farmer' | 'gig') => {
      const example = t.prefill[type as keyof typeof t.prefill];
      setName(example.name);
      setProfession(example.profession);
      setLocation(example.location);
      setIncomeType(example.incomeType);
      setPincode(example.pincode);
      setAadhaar(example.aadhaar);
      setPhone(example.phone);
      setAccountNumber(example.bankAccountNumber);
      setBankName(example.bankName);
      setIfscCode(example.ifscCode);
      // For easy testing, auto-verify phone
      setIsOtpSent(true);
      setIsOtpVerified(true);
      setError(null);
  };

  const handleProfessionDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(JourneyStep.DATA_INPUT);
  };

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsGeneratingQuestions(true);
    setStep(JourneyStep.CLARIFICATION);
    try {
        const questions = await generateClarifyingQuestions(financialStatement);
        if (questions && questions.length > 0) {
            setClarifyingQuestions(questions.map(q => ({ question: q, answer: '' })));
        } else {
            setStep(JourneyStep.PSYCHOMETRIC);
        }
    } catch (error) {
        console.error("Failed to generate clarifying questions, skipping.", error);
        setStep(JourneyStep.PSYCHOMETRIC);
    } finally {
        setIsGeneratingQuestions(false);
    }
  };
  
  const handleClarificationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep(JourneyStep.PSYCHOMETRIC);
  };
  
  const getFinalUserData = (): UserData => {
    const finalAdditionalDocs: AdditionalDocument[] = additionalDocuments
        .filter(doc => doc.status === 'verified' || doc.status === 'error')
        .map(doc => ({
            name: doc.name,
            mimeType: doc.mimeType,
            data: doc.base64Data,
            verificationResult: doc.verificationMessage,
            category: doc.category,
        }));
        
    const finalAlternativeData = {
        ...alternativeData,
        simAgeDays: simAgeDays ? parseInt(simAgeDays) : undefined,
        avgTopupAmount: avgTopupAmount ? parseInt(avgTopupAmount) : undefined,
        utilityBillsPaidLast6M: utilityBillsPaidLast6M ? parseInt(utilityBillsPaidLast6M) : undefined,
        dataUsageMb: dataUsageMb ? parseInt(dataUsageMb) : undefined,
        tenure: tenure ? parseInt(tenure) : undefined,
        contract: contract as UserData['alternativeData']['contract'] || undefined,
        paperlessBilling,
        paymentMethod: paymentMethod as UserData['alternativeData']['paymentMethod'] || undefined,
        monthlyCharges: monthlyCharges ? parseFloat(monthlyCharges) : undefined,
        totalCharges: totalCharges ? parseFloat(totalCharges) : undefined,
    };

    return { 
        name, 
        phone,
        aadhaar,
        profession, 
        incomeType, 
        location, 
        pincode,
        financialStatement, 
        financialStatementImage: financialStatementImage || undefined, 
        digitizedLedgerText, 
        psychometricResponses, 
        additionalDocuments: finalAdditionalDocs,
        clarificationResponses: clarifyingQuestions.filter(q => q.answer.trim() !== ''),
        referenceContact: referenceName && referenceRelationship ? { name: referenceName, relationship: referenceRelationship } : undefined,
        alternativeData: finalAlternativeData,
        bankName,
        accountNumber,
        ifscCode
    };
  };
  
  const handlePsychometricSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onComplete(getFinalUserData(), 'webapp');
  };
  
  const handlePsychometricSkip = () => {
      onComplete(getFinalUserData(), 'webapp');
  };
  
  const handlePsychometricChange = (questionId: string, answer: string) => {
      setPsychometricResponses(prev => ({...prev, [questionId]: answer}));
  };
  
  const toggleRecording = () => {
    if (!recognition) {
        setError(t.errors.noVoiceSupport);
        return;
    }
    if (isRecording) {
        recognition.stop();
        setIsRecording(false);
    } else {
        recognition.start();
        setIsRecording(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocVerification({ status: 'loading', message: t.docAnalysis.analyzing });
      setOcrStatus('loading');
      setDigitizedLedgerText('');
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const base64String = (loadEvent.target?.result as string).split(',')[1];
        const imageData = {
            mimeType: file.type,
            data: base64String
        };
        setFinancialStatementImage(imageData);
        setImagePreview(loadEvent.target?.result as string);
        setFinancialStatement(prev => prev + ` [${t.docAnalysis.imageUploaded}: ${file.name}]`);

        try {
            const verificationResult = await verifyDocumentAuthenticity(imageData);
            setDocVerification({ status: 'verified', message: verificationResult });
        } catch (err) {
            setDocVerification({ status: 'error', message: t.docAnalysis.analysisError });
        }
        try {
            const ocrResult = await simulateVernacularOcr(imageData);
            setDigitizedLedgerText(ocrResult);
            setOcrStatus('done');
        } catch (err) {
            setDigitizedLedgerText(t.docAnalysis.ocrError);
            setOcrStatus('error');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAdditionalDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!(file instanceof File)) {
        return;
      }
      const id = Date.now() + Math.random();
      const newDoc: UploadedDocState = {
        id,
        name: file.name,
        mimeType: file.type,
        base64Data: '',
        previewUrl: URL.createObjectURL(file),
        status: 'loading',
        verificationMessage: t.docAnalysis.verifying,
        category: 'Other',
      };

      setAdditionalDocuments(prev => [...prev, newDoc]);

      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const base64Data = (loadEvent.target?.result as string).split(',')[1];
        
        setAdditionalDocuments(prev => prev.map(d => d.id === id ? { ...d, base64Data } : d));

        try {
          const verificationResult = await verifyDocumentAuthenticity({ mimeType: file.type, data: base64Data });
          setAdditionalDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'verified', verificationMessage: verificationResult } : d));
        } catch (err) {
          setAdditionalDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'error', verificationMessage: t.docAnalysis.verificationFailed } : d));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleDocCategoryChange = (id: number, category: 'Identity' | 'Work' | 'Asset' | 'Other') => {
    // FIX: Changed `d` to `doc` to correctly reference the current item in the map function.
    setAdditionalDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, category } : doc));
  };

  const removeAdditionalDoc = (id: number) => {
    setAdditionalDocuments(prev => prev.filter(doc => doc.id !== id));
  };
  
  const handleHelpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!helpQuestion.trim()) return;
      setIsHelpLoading(true);
      setHelpResponse('');
      try {
          const response = await getOnboardingHelp(helpQuestion);
          setHelpResponse(response);
      } catch (err) {
          setHelpResponse(t.help.error);
      } finally {
          setIsHelpLoading(false);
          setHelpQuestion('');
      }
  };
  
   const handleConsentExplanation = async (topic: string) => {
    setIsConsentLoading(true);
    setConsentExplanation('');
    setShowConsentExplanation(true);
    try {
        const explanation = await getConsentExplanation(topic);
        setConsentExplanation(explanation);
    } catch(e) {
        setConsentExplanation(t.consent.explanationFallback);
    } finally {
        setIsConsentLoading(false);
    }
   };

  const renderHelpChat = () => (
    <div className="fixed bottom-4 left-4 w-80 bg-white rounded-lg shadow-2xl z-50 animate-fade-in-up">
        <div className="p-3 bg-teal-600 text-white flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold text-sm">{t.help.title}</h3>
            <button onClick={() => setShowHelpChat(false)} className="font-bold text-xl">&times;</button>
        </div>
        <div className="p-3 h-48 overflow-y-auto text-sm space-y-2">
            <p className="bg-slate-100 p-2 rounded-lg">{t.help.greeting}</p>
            {helpResponse && <p className="bg-teal-100 p-2 rounded-lg">{helpResponse}</p>}
             {isHelpLoading && <p className="bg-teal-100 p-2 rounded-lg">...</p>}
        </div>
        <form onSubmit={handleHelpSubmit} className="p-2 border-t flex items-center">
            <input 
                type="text" 
                value={helpQuestion}
                onChange={(e) => setHelpQuestion(e.target.value)}
                placeholder={t.help.placeholder}
                className="flex-1 text-sm border-slate-300 rounded-full px-3 py-1 focus:ring-teal-500 focus:border-teal-500"
            />
            <button type="submit" className="ml-2 bg-teal-600 text-white rounded-full p-1.5 hover:bg-teal-700 disabled:bg-slate-400" disabled={isHelpLoading}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </button>
        </form>
    </div>
  );

  const renderInfoStep = () => {
    const isContinueDisabled = !name || !profession || !incomeType || !location || !isOtpVerified || aadhaar.length !== 12 || pincode.length !== 6 || !bankName || !accountNumber || !ifscCode || !!ifscError;
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">{t.info.title}</h2>
                <p className="text-slate-600 text-sm">{t.info.subtitle}</p>
                <div className="mt-3 flex justify-center items-center gap-4 text-xs text-slate-500 font-medium">
                    <span>{t.info.secure}</span>
                    <span>{t.info.compliant}</span>
                    <span>{t.info.multilingual}</span>
                </div>
            </div>
       
        {error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm" role="alert"><p>{error}</p></div>}
        <form onSubmit={handleInfoSubmit} className="space-y-5">
            <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t.info.fullNameLabel}</label>
                <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.fullNamePlaceholder} required />
                </div>
            </div>

            <div className="relative">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">{t.info.phoneLabel}</label>
                 <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="tel" id="phone" value={formatPhoneNumber(phone)} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))} maxLength={14} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="(xxx) xxx-xxxx" required disabled={isOtpVerified} />
                </div>
            </div>
            
            {!isOtpVerified && isOtpSent && (
                 <div className="space-y-2 animate-fade-in">
                    <label htmlFor="otp" className="block text-sm font-medium text-slate-700">{t.info.otpLabel}</label>
                    <div className="flex items-center gap-3">
                        <input type="text" id="otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').substring(0, 6))} maxLength={6} className="flex-grow px-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="123456" required />
                        <button type="button" onClick={handleVerifyOtp} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">{t.info.verifyButton}</button>
                    </div>
                    {otpTimer > 0 ? (
                        <p className="text-xs text-slate-500">{t.info.resendOtpTimer.replace('{otpTimer}', otpTimer.toString())}</p>
                    ) : (
                        <button type="button" onClick={handleSendOtp} className="text-xs text-teal-600 hover:underline">{t.info.resendOtpLink}</button>
                    )}
                </div>
            )}

            {!isOtpSent && !isOtpVerified && (
                 <button type="button" onClick={handleSendOtp} disabled={phone.length !== 10} className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400">
                    {t.info.sendOtpButton}
                </button>
            )}

            {isOtpVerified && <p className="text-teal-600 font-semibold text-sm flex items-center gap-2 animate-fade-in"><CheckBadgeIcon className="h-5 w-5"/> {t.info.phoneVerified}</p>}
            
            <div className="relative">
                <label htmlFor="aadhaar" className="block text-sm font-medium text-slate-700 mb-1">{t.info.aadhaarLabel}</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FingerPrintIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').substring(0, 12))} maxLength={12} pattern="\d{12}" className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.aadhaarPlaceholder} required />
                </div>
            </div>
            
            <div className="relative">
                <label htmlFor="profession" className="block text-sm font-medium text-slate-700 mb-1">{t.info.occupationLabel}</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <BriefcaseIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <select id="profession" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="" disabled>{t.info.selectOccupation}</option>
                        {t.professions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative sm:col-span-1">
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">{t.info.locationLabel}</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><MapPinIcon className="h-5 w-5 text-slate-400"/></div>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.locationPlaceholder} required />
                    </div>
                </div>
                <div className="relative">
                    <label htmlFor="pincode" className="block text-sm font-medium text-slate-700 mb-1">{t.info.pincodeLabel}</label>
                    <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').substring(0, 6))} maxLength={6} pattern="\d{6}" className="w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.pincodePlaceholder} required />
                </div>
            </div>

            <div className="relative">
                <label htmlFor="incomeType" className="flex items-center text-sm font-medium text-slate-700 mb-1">
                    {t.info.incomePatternLabel}
                    <div className="relative ml-2">
                        <button type="button" onMouseEnter={() => setIsTooltipVisible(true)} onMouseLeave={() => setIsTooltipVisible(false)} className="text-slate-400 hover:text-slate-600">
                            <InformationCircleIcon className="h-4 w-4" />
                        </button>
                        {isTooltipVisible && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 text-center z-10">
                                {t.info.incomePatternTooltip}
                            </div>
                        )}
                    </div>
                </label>
                <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CurrencyRupeeIcon className="h-5 w-5 text-slate-400"/></div>
                    <select id="incomeType" value={incomeType} onChange={(e) => setIncomeType(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" required>
                        <option value="" disabled>{t.info.selectIncomePattern}</option>
                        {t.incomeTypes.map(it => <option key={it} value={it}>{it}</option>)}
                    </select>
                </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/80">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.info.bankDetailsTitle}</h3>
                <div className="space-y-5">
                    <div className="relative">
                        <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 mb-1">{t.info.bankNameLabel}</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <BriefcaseIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.bankNamePlaceholder} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1">{t.info.accountNumberLabel}</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CurrencyRupeeIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.accountNumberPlaceholder} required />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="ifscCode" className="block text-sm font-medium text-slate-700 mb-1">{t.info.ifscCodeLabel}</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <LinkIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="text" id="ifscCode" value={ifscCode} 
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        setIfscCode(val);
                                        if (val && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(val)) {
                                            setIfscError(t.errors.ifsc);
                                        } else {
                                            setIfscError('');
                                        }
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder={t.info.ifscCodePlaceholder} required />
                            </div>
                            {ifscError && <p className="text-xs text-red-500 mt-1">{ifscError}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-600">{t.info.prefillLabel}</p>
                    <button type="button" onClick={() => prefillExample('farmer')} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200">{t.prefill.farmer.button}</button>
                    <button type="button" onClick={() => prefillExample('gig')} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200">{t.prefill.gig.button}</button>
                </div>
                 <a href="#" className="font-medium text-teal-600 hover:underline">{t.info.needHelpLink}</a>
            </div>

            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none" disabled={isContinueDisabled}>
                {t.info.continueButton}
            </button>
            <p className="text-center text-xs text-slate-500 pt-2">{t.info.stepDescription}</p>
        </form>
        </div>
    );
  };

  const renderConsentStep = () => (
    <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <ShieldCheckIcon className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.consent.title}</h2>
                    <p className="text-slate-600">{t.consent.subtitle}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2 text-sm sm:ml-4 self-end sm:self-start">
                 <div className="flex items-center flex-wrap justify-end gap-x-2 gap-y-1 font-medium text-slate-600">
                    {supportedLanguages.map((lang, index) => (
                        <React.Fragment key={lang.code}>
                            <button onClick={() => setLanguage(lang.code)} className={`${language === lang.code ? 'text-teal-600 font-bold' : 'cursor-pointer hover:text-teal-600'}`}>{lang.name}</button>
                            {index < supportedLanguages.length - 1 && <span className="text-slate-400">|</span>}
                        </React.Fragment>
                    ))}
                </div>
                <button className="text-slate-500 hover:text-teal-600" aria-label="Read consent form aloud">
                    <SpeakerWaveIcon className="h-6 w-6" />
                </button>
            </div>
        </div>

        <div className="flex justify-around items-center text-xs text-slate-600 font-medium bg-slate-100/80 p-3 rounded-lg border border-slate-200/80 mb-6">
            <span className="flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-slate-500" /> {t.consent.tag1}
            </span>
            <span className="flex items-center gap-2 text-teal-700">
                <CheckIcon className="w-4 h-4" /> {t.consent.tag2}
            </span>
            <span className="flex items-center gap-2 text-red-600">
                <XCircleIcon className="w-4 h-4" /> {t.consent.tag3}
            </span>
        </div>
        
        <div className="space-y-4 text-sm text-slate-600 bg-white/40 p-4 rounded-lg border border-slate-200/80">
            <p>{t.consent.main}</p>
            <ul className="space-y-4">
                {t.consent.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                        {index === 0 && <BriefcaseIcon className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />}
                        {index === 1 && <DocumentTextIcon className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />}
                        {index === 2 && <QuestionMarkCircleIcon className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />}
                        {index === 3 && <PhotoIcon className="h-5 w-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />}
                        <span>
                            {point.text}
                            <button onClick={() => handleConsentExplanation(point.topic)} className="ml-2 text-slate-400 hover:text-teal-600 inline-block align-middle" aria-label={point.ariaLabel}>
                                <InformationCircleIcon className="h-5 w-5" />
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
        
        {showConsentExplanation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowConsentExplanation(false)}>
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <h4 className="font-bold text-lg mb-2 text-slate-800">{t.consent.explanationTitle}</h4>
                    <p className="text-sm text-slate-600">{isConsentLoading ? t.consent.explanationLoading : consentExplanation}</p>
                    <button onClick={() => setShowConsentExplanation(false)} className="mt-4 w-full bg-slate-200 py-2 rounded-lg font-semibold hover:bg-slate-300">{t.consent.explanationGotIt}</button>
                </div>
            </div>
        )}

        <div className="mt-6 flex flex-col items-center">
             <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="consent-check" className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                <label htmlFor="consent-check" className="text-slate-600">{t.consent.checkboxLabel}</label>
            </div>
            <button onClick={() => setStep(JourneyStep.PROFESSION_QUESTIONS)} className="mt-4 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5">
                {t.consent.agreeButton}
            </button>
        </div>
    </div>
  );

  const renderProfessionQuestionsStep = () => {
    const questions = t.professionQuestions[profession as keyof typeof t.professionQuestions];
    if (!questions) return null;

    return (
      <div className="animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{t.professionQuestions.title}</h2>
          <p className="text-slate-600">{t.professionQuestions.subtitle}</p>
        </div>
        <form onSubmit={handleProfessionDetailsSubmit} className="space-y-4">
          {Object.entries(questions).map(([key, q]: [string, any]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{q.label}</label>
              {q.options ? (
                <select 
                  value={alternativeData[key] || ''} 
                  onChange={e => setAlternativeData(p => ({...p, [key]: e.target.value}))}
                  className="w-full px-3 py-2 border bg-slate-50 border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="" disabled>Select an option</option>
                  {q.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : q.label.toLowerCase().includes('yes/no') ? (
                 <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name={key} checked={alternativeData[key] === true} onChange={() => setAlternativeData(p => ({...p, [key]: true}))} className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500" />
                        <span className="ml-2 text-sm text-slate-700">Yes</span>
                    </label>
                     <label className="flex items-center">
                        <input type="radio" name={key} checked={alternativeData[key] === false} onChange={() => setAlternativeData(p => ({...p, [key]: false}))} className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500" />
                        <span className="ml-2 text-sm text-slate-700">No</span>
                    </label>
                </div>
              ) : (
                <input
                  type={q.type === 'number' ? "number" : "text"}
                  value={alternativeData[key] || ''}
                  onChange={e => setAlternativeData(p => ({...p, [key]: e.target.value}))}
                  placeholder={q.placeholder}
                  className="w-full px-3 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" className="mt-4 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5">
            {t.professionQuestions.submitButton}
          </button>
        </form>
      </div>
    );
  };


  const renderDataInputStep = () => (
    <div className="animate-fade-in">
         <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{t.data.title}</h2>
            <p className="text-slate-600">{t.data.subtitle}</p>
        </div>
      
        <div className="flex justify-center mb-4 space-x-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            <button onClick={() => setInputMode(InputMode.TYPE)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${inputMode === InputMode.TYPE ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/70'}`}>
                <PencilSquareIcon className="w-5 h-5 inline-block mr-1.5" />{t.data.type}
            </button>
            <button onClick={() => setInputMode(InputMode.SPEAK)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${inputMode === InputMode.SPEAK ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/70'}`}>
                <MicrophoneIcon className="w-5 h-5 inline-block mr-1.5" />{t.data.speak}
            </button>
            <button onClick={() => setInputMode(InputMode.UPLOAD)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${inputMode === InputMode.UPLOAD ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-white/70'}`}>
                 <CameraIcon className="w-5 h-5 inline-block mr-1.5" />{t.data.upload}
            </button>
        </div>

        <form onSubmit={handleDataSubmit}>
            {inputMode === InputMode.TYPE && (
                <div className="relative">
                    <textarea 
                        value={financialStatement}
                        onChange={e => setFinancialStatement(e.target.value)}
                        placeholder={t.data.textareaPlaceholder}
                        className="w-full h-40 p-3 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                        {feedbackKeywords.income && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{t.feedbackKeywords.income[0]} ✓</span>}
                        {feedbackKeywords.expenses && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{t.feedbackKeywords.expenses[0]} ✓</span>}
                        {feedbackKeywords.savings && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{t.feedbackKeywords.savings[0]} ✓</span>}
                    </div>
                </div>
            )}

            {inputMode === InputMode.SPEAK && (
                 <div className="flex flex-col items-center justify-center h-40 p-3 border-2 border-dashed bg-slate-50 border-slate-300 rounded-lg">
                    <button type="button" onClick={toggleRecording} className={`w-16 h-16 rounded-full flex items-center justify-center transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-600 text-white'}`}>
                        <MicrophoneIcon className="h-8 w-8" />
                    </button>
                    <p className="mt-3 text-sm text-slate-600">{isRecording ? t.data.speakStop : t.data.speakStart}</p>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            )}
             {inputMode === InputMode.UPLOAD && (
                 <div className="flex flex-col items-center justify-center h-40 p-3 border-2 border-dashed bg-slate-50 border-slate-300 rounded-lg">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-slate-600 hover:text-teal-600">
                        <CameraIcon className="h-10 w-10"/>
                        <span className="mt-2 text-sm font-medium">{t.data.uploadTitle}</span>
                        <span className="text-xs text-slate-500">{t.data.uploadSubtitle}</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
            )}
            {imagePreview && (
                <div className="mt-4 p-3 bg-slate-100/80 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">{t.docAnalysis.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <img src={imagePreview} alt={t.docAnalysis.alt} className="rounded-lg shadow-md max-h-48 object-contain"/>
                        <div className="space-y-2 text-sm">
                            {docVerification && (
                                <div className={`p-2 rounded-md ${docVerification.status === 'verified' ? 'bg-teal-100 text-teal-800' : docVerification.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <strong>{t.docAnalysis.docCheck}:</strong> {docVerification.message}
                                </div>
                            )}
                             {ocrStatus && (
                                <div className={`p-2 rounded-md ${ocrStatus === 'done' ? 'bg-amber-100 text-amber-800' : ocrStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <strong>{t.docAnalysis.ledgerReading}:</strong> 
                                    {ocrStatus === 'loading' ? t.docAnalysis.loading : <p className="font-mono text-xs bg-slate-800 text-white p-2 rounded mt-1 max-h-24 overflow-y-auto">{digitizedLedgerText}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{t.data.optional.title}</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.data.optional.refNameLabel}</label>
                        <input type="text" value={referenceName} onChange={(e) => setReferenceName(e.target.value)} placeholder={t.data.optional.refNamePlaceholder} className="w-full px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg" />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.data.optional.refRelationLabel}</label>
                        <input type="text" value={referenceRelationship} onChange={(e) => setReferenceRelationship(e.target.value)} placeholder={t.data.optional.refRelationPlaceholder} className="w-full px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg" />
                    </div>
                </div>
                
                <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <label htmlFor="additional-docs" className="block text-sm font-medium text-slate-700 mb-2">{t.data.optional.addDocsLabel}</label>
                     <div className="flex items-center justify-center w-full">
                        <label
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-100/70"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <CloudArrowUpIcon className="w-8 h-8 mb-2 text-slate-500" />
                                <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">{t.data.optional.clickToUpload}</span> {t.data.optional.dragAndDrop}</p>
                                <p className="text-xs text-slate-500">{t.data.optional.fileTypes}</p>
                            </div>
                            <input ref={additionalDocsFileInputRef} id="additional-docs" type="file" multiple className="hidden" onChange={handleAdditionalDocsUpload} accept="image/png, image/jpeg" />
                        </label>
                    </div> 
                </div>

                {additionalDocuments.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {additionalDocuments.map(doc => (
                            <div key={doc.id} className="p-2 border rounded-lg bg-white/50 flex items-center gap-3">
                                <img src={doc.previewUrl} alt={doc.name} className="w-12 h-12 rounded-md object-cover"/>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                    <p className={`text-xs ${doc.status === 'verified' ? 'text-teal-600' : doc.status === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>{doc.verificationMessage}</p>
                                </div>
                                 <select value={doc.category} onChange={(e) => handleDocCategoryChange(doc.id, e.target.value as any)} className="text-xs border-slate-300 rounded-md">
                                    {t.data.optional.docCategories.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <button type="button" onClick={() => removeAdditionalDoc(doc.id)} className="text-red-500 hover:text-red-700 p-1"><XMarkIcon className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                )}
                 
                 <div className="mt-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={showAlternativeData} onChange={() => setShowAlternativeData(!showAlternativeData)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        <span className="ml-3 text-sm font-medium text-slate-700">{t.data.optional.altDataLabel}</span>
                    </label>
                 </div>

                 {showAlternativeData && (
                    <div className="mt-4 p-4 border rounded-lg bg-slate-50/80 space-y-4 animate-fade-in">
                        <h4 className="text-sm font-semibold text-slate-600">{t.data.optional.altDataTitle}</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <input type="number" value={simAgeDays} onChange={e => setSimAgeDays(e.target.value)} placeholder={t.data.optional.simAge} className="w-full text-sm p-2 border rounded-md"/>
                            <input type="number" value={avgTopupAmount} onChange={e => setAvgTopupAmount(e.target.value)} placeholder={t.data.optional.avgRecharge} className="w-full text-sm p-2 border rounded-md"/>
                            <input type="number" value={utilityBillsPaidLast6M} onChange={e => setUtilityBillsPaidLast6M(e.target.value)} placeholder={t.data.optional.billsPaid} className="w-full text-sm p-2 border rounded-md"/>
                            <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder={t.data.optional.tenure} className="w-full text-sm p-2 border rounded-md"/>
                        </div>
                    </div>
                 )}
            </div>
            
            <button type="submit" className="mt-6 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5">
                {t.data.analyzeButton}
            </button>
        </form>
    </div>
  );
  
  const renderClarificationStep = () => (
      <div className="animate-fade-in">
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{t.clarification.title}</h2>
              <p className="text-slate-600">{t.clarification.subtitle}</p>
          </div>
          <form onSubmit={handleClarificationSubmit} className="space-y-4">
              {clarifyingQuestions.map((q, index) => (
                  <div key={index}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{q.question}</label>
                      <input 
                          type="text" 
                          value={q.answer}
                          onChange={(e) => {
                              const newAnswers = [...clarifyingQuestions];
                              newAnswers[index].answer = e.target.value;
                              setClarifyingQuestions(newAnswers);
                          }}
                          className="w-full px-3 py-2 border bg-slate-50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          required
                      />
                  </div>
              ))}
               <button type="submit" className="mt-4 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5">
                  {t.clarification.submitButton}
              </button>
          </form>
      </div>
  );
  
    const renderPsychometricStep = () => {
        const allAnswered = Object.keys(psychometricQuestions).length === Object.keys(psychometricResponses).length;
        return (
            <div className="animate-fade-in">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t.psychometric.title}</h2>
                    <p className="text-slate-600">{t.psychometric.subtitle}</p>
                </div>
                <form onSubmit={handlePsychometricSubmit} className="space-y-6">
                    {Object.entries(psychometricQuestions).map(([id, q]) => (
                        <div key={id}>
                            {/* FIX: Cast `q` to `any` to access properties on the untyped object from translations. */}
                            <h4 className="font-semibold text-slate-800 mb-2">{(q as any).question}</h4>
                            <fieldset className="space-y-2">
                                {/* FIX: Cast `q` to `any` to access properties on the untyped object from translations. */}
                                {(q as any).options.map((opt: string) => (
                                    <label key={opt} className="flex items-center p-3 border rounded-lg hover:bg-slate-100/70 has-[:checked]:bg-teal-50 has-[:checked]:border-teal-500">
                                        <input 
                                            type="radio"
                                            name={id}
                                            value={opt}
                                            checked={psychometricResponses[id] === opt}
                                            onChange={() => handlePsychometricChange(id, opt)}
                                            className="h-4 w-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                                        />
                                        <span className="ml-3 text-sm text-slate-700">{opt}</span>
                                    </label>
                                ))}
                            </fieldset>
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="button" onClick={handlePsychometricSkip} className="w-full px-4 py-3 text-sm font-medium rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300">
                            {t.psychometric.skipButton}
                        </button>
                        <button type="submit" disabled={!allAnswered} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none">
                            {t.psychometric.completeButton}
                        </button>
                    </div>
                </form>
            </div>
        )
    };
    
  const renderChannelChoice = () => (
    <div className="bg-white/60 p-8 rounded-2xl shadow-lg border border-slate-200/80 animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{t.channel.title}</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">{t.channel.subtitle}</p>
            <div className="mt-4 flex justify-center items-center gap-4 text-sm font-medium">
                <GlobeAltIcon className="w-5 h-5 text-slate-500" />
                 <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                    {supportedLanguages.map(lang => (
                        <button 
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)} 
                            className={`${language === lang.code ? 'text-teal-600 font-bold underline' : 'text-slate-600 hover:underline'}`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
             <button onClick={() => setChannel('webapp')} className="group text-center p-6 border-2 border-transparent rounded-xl bg-white hover:border-teal-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <ComputerDesktopIcon className="h-12 w-12 mx-auto text-slate-400 group-hover:text-teal-600 transition-colors" />
                <h3 className="mt-4 font-bold text-lg text-slate-800">{t.channel.webapp.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.channel.webapp.description}</p>
            </button>
            <button onClick={() => setChannel('ussd')} className="group text-center p-6 border-2 border-transparent rounded-xl bg-white hover:border-amber-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <DevicePhoneMobileIcon className="h-12 w-12 mx-auto text-slate-400 group-hover:text-amber-600 transition-colors" />
                <h3 className="mt-4 font-bold text-lg text-slate-800">{t.channel.ussd.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.channel.ussd.description}</p>
            </button>
        </div>
        <div className="text-center mt-8">
            <button onClick={() => setShowHelpModal(true)} className="text-sm font-medium text-teal-600 hover:underline">
                {t.channel.helpLink}
            </button>
        </div>
        {showHelpModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(false)}>
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-slate-800">{t.channel.helpModal.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        {t.channel.helpModal.points.map(point => (
                            <li key={point.title}>
                                <strong className="font-semibold text-slate-800">{point.title}:</strong> {point.description}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowHelpModal(false)} className="mt-6 w-full bg-slate-200 text-slate-800 font-bold py-2 rounded-lg hover:bg-slate-300">{t.channel.helpModal.closeButton}</button>
                </div>
            </div>
        )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case JourneyStep.INFO:
        return renderInfoStep();
      case JourneyStep.CONSENT:
        return renderConsentStep();
      case JourneyStep.PROFESSION_QUESTIONS:
        return renderProfessionQuestionsStep();
      case JourneyStep.DATA_INPUT:
        return renderDataInputStep();
      case JourneyStep.CLARIFICATION:
          return isGeneratingQuestions ? <div className="text-center p-8">Generating clarifying questions...</div> : renderClarificationStep();
      case JourneyStep.PSYCHOMETRIC:
        return renderPsychometricStep();
      default:
        return renderInfoStep();
    }
  };

  const renderHelpModal = () => (
        showHelpModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(false)}>
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-slate-800">{t.channel.helpModal.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        {t.channel.helpModal.points.map(point => (
                            <li key={point.title}>
                                <strong className="font-semibold text-slate-800">{point.title}:</strong> {point.description}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowHelpModal(false)} className="mt-6 w-full bg-slate-200 text-slate-800 font-bold py-2 rounded-lg hover:bg-slate-300">{t.channel.helpModal.closeButton}</button>
                </div>
            </div>
        )
    );

  if (channel === 'select') {
    return (
        <>
            {renderChannelChoice()}
            {renderHelpModal()}
        </>
    );
  }

  if (channel === 'ussd') {
      return <UssdSimulator 
        processApplication={async (data) => {
          if (processUssdApplication) {
            return await processUssdApplication(data as UserData);
          }
          return null;
        }}
        onComplete={() => onComplete({} as UserData, 'ussd')} 
        language={language}
        onBack={() => setChannel('select')} 
      />;
  }

  return (
    <div className="bg-white/60 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80">
      <Stepper currentStep={step} onStepClick={handleStepClick}/>
      {renderCurrentStep()}
      {!showHelpChat && (
        <button 
          onClick={() => setShowHelpChat(true)}
          className="fixed bottom-4 left-4 bg-teal-600 text-white rounded-full p-3 shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-110"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}
      {showHelpChat && renderHelpChat()}
    </div>
  );
};

// FIX: Add default export for the Onboarding component.
export default Onboarding;
