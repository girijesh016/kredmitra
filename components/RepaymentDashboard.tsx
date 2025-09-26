import React, { useState, useEffect, useRef } from 'react';
import type { SelectedLoan, UserData, BudgetCategory, DiaryEntry, SavingsPlan, Reminder, PredictiveIntervention, FinancialWellnessBadge, FeedbackAnalysis } from '../types';
import Chatbot from './Chatbot';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { analyzeUserFeedback, analyzeBudget, getFinancialLiteracyTip, createSavingsPlan, analyzeFinancialDiaryEntry, getReschedulingOptions, generateReminderMessage, predictiveInterventionCheck } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { BellIcon } from './icons/BellIcon';
import { StarIcon } from './icons/StarIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { FaceNeutralIcon } from './icons/FaceNeutralIcon';

// SpeechRecognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
}

interface RepaymentDashboardProps {
  loan: SelectedLoan;
  userData: UserData;
}

const RepaymentDashboard: React.FC<RepaymentDashboardProps> = ({ loan, userData }) => {
  const [currentLoan, setCurrentLoan] = useState(loan);
  const progress = (currentLoan.repaid / currentLoan.amount) * 100;
  const amountRemaining = currentLoan.amount - currentLoan.repaid;

  const [tip, setTip] = useState<string | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [budgetText, setBudgetText] = useState('');
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetCategory[] | null>(null);
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);

  // New features state
  const [literacyTip, setLiteracyTip] = useState<string>('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsPlan, setSavingsPlan] = useState<SavingsPlan | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisDescription, setCrisisDescription] = useState('');
  const [isCrisisLoading, setIsCrisisLoading] = useState(false);
  const [crisisOptions, setCrisisOptions] = useState<{ intro: string, options: string[] } | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [intervention, setIntervention] = useState<PredictiveIntervention | null>(null);
  
  const recognitionRef = useRef(recognition);

  // Fetch initial data & run predictive check
  useEffect(() => {
    getFinancialLiteracyTip(userData).then(setLiteracyTip);
    if(reminders.length === 0){
        generateReminderMessage(userData, currentLoan).then(msg => {
            setReminders([{id: 1, message: msg}]);
        });
    }

    // Proactive intervention check runs once on load
    const runInterventionCheck = async () => {
        const result = await predictiveInterventionCheck(diaryEntries);
        if (result.needsHelp) {
            setIntervention(result);
        }
    };
    runInterventionCheck();

  }, [userData, diaryEntries, currentLoan, reminders.length]);
  
  // Setup speech recognition handlers
  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    rec.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        const analysis = await analyzeFinancialDiaryEntry(transcript);
        const newEntry: DiaryEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          transcript,
          ...analysis
        };
        setDiaryEntries(prev => [newEntry, ...prev]);
      }
      setIsRecording(false);
    };
    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
          alert('Microphone permission was denied. To use the voice diary, please allow microphone access in your browser settings.');
      } else {
          alert(`An error occurred during voice recognition: ${event.error}. Please try again.`);
      }
      setIsRecording(false);
    };
  }, []);

  const handleGetTip = async () => { setIsTipLoading(true); setTip(await getFinancialLiteracyTip(userData)); setIsTipLoading(false) };
  
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsFeedbackLoading(true);
      try {
          const analysis = await analyzeUserFeedback(feedback);
          setFeedbackAnalysis(analysis);
      } catch (e) {
          setFeedbackAnalysis({ sentiment: 'Neutral', category: 'Feedback', summary: 'Thank you for your feedback!' });
      } finally {
          setIsFeedbackLoading(false);
      }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsBudgetLoading(true); setBudgetAnalysis(await analyzeBudget(budgetText)); setIsBudgetLoading(false) };
  const handlePlanSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsPlanLoading(true); setSavingsPlan(await createSavingsPlan(savingsGoal, Number(savingsAmount), userData)); setIsPlanLoading(false) };
  
  const handleToggleRecording = () => {
      const rec = recognitionRef.current;
      if (!rec) {
          alert("Sorry, your browser does not support voice recording.");
          return;
      }
      if (isRecording) {
          rec.stop();
          setIsRecording(false);
      } else {
          rec.start();
          setIsRecording(true);
      }
  };

  const handleCrisisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCrisisLoading(true);
    setCrisisOptions(null);
    const options = await getReschedulingOptions(crisisDescription, currentLoan);
    setCrisisOptions(options);
    setIsCrisisLoading(false);
  };

  const budgetTotal = budgetAnalysis ? budgetAnalysis.reduce((sum, item) => sum + item.amount, 0) : 0;
  const budgetColors = ['bg-teal-500', 'bg-amber-500', 'bg-teal-700', 'bg-amber-400', 'bg-teal-300', 'bg-amber-600'];

  return (
    <div className="space-y-8 animate-fade-in">
        {intervention && (
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-r-lg shadow-md animate-fade-in">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-bold">A Message from Coach Mitra</h3>
                        <p className="text-sm mt-1">{intervention.suggestion}</p>
                        <p className="text-xs mt-2">If you need help, please use the "Facing a financial difficulty?" link below or chat with me.</p>
                    </div>
                </div>
            </div>
        )}
        
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Your Loan Dashboard</h2>
            <p className="text-slate-600">Track your progress and get help from your financial coach.</p>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-teal-600">{currentLoan.name}</h3>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">Repayment Progress</span>
                            <span className="text-sm font-bold text-teal-600">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-4">
                            <div className="bg-teal-600 h-4 rounded-full" style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}></div>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm text-slate-500">Amount Remaining</p>
                        <p className="text-2xl font-bold">₹{amountRemaining.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="text-center md:text-left">
                        <p className="text-sm text-slate-500">Total Loan</p>
                        <p className="text-2xl font-bold text-slate-400">₹{currentLoan.amount.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
             <div className="mt-6 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Make a Payment
                </button>
                <button 
                    onClick={handleGetTip}
                    disabled={isTipLoading}
                    className="bg-white text-teal-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-100/50 border border-slate-300/80 transition duration-300 flex items-center gap-2 disabled:bg-slate-200 shadow-sm"
                >
                    <SparklesIcon className="h-5 w-5"/>
                    {isTipLoading ? "Thinking..." : "Get a Tip from Coach Mitra"}
                </button>
            </div>
            {tip && (
                <div className="mt-4 bg-amber-100 border-l-4 border-amber-500 p-3 rounded-r-lg text-sm text-amber-700 animate-fade-in">
                    <p><span className="font-bold">Coach's Tip:</span> {tip}</p>
                </div>
            )}
             <div className="mt-6 border-t border-slate-200/80 pt-4 text-center">
                <button onClick={() => setShowCrisisModal(true)} className="text-sm text-red-600 font-semibold hover:underline">
                    <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" /> Facing a financial difficulty?
                </button>
            </div>
        </div>
        
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Your Financial Wellness Journey</h3>
            <div className="relative pt-2">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                <div className="space-y-8">
                    {currentLoan.badges.map((badge) => (
                        <div key={badge.id} className="relative pl-12">
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${badge.achieved ? 'bg-teal-500 shadow-md ring-4 ring-white/80' : 'bg-slate-300'}`}>
                                <StarIcon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className={`font-bold transition-colors ${badge.achieved ? 'text-slate-800' : 'text-slate-400'}`}>{badge.title}</h4>
                            <p className={`text-sm transition-colors ${badge.achieved ? 'text-slate-600' : 'text-slate-400'}`}>{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {literacyTip && (
             <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <LightBulbIcon className="h-8 w-8 text-amber-500 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm text-slate-800">Tip of the Day for a {userData.profession}</h4>
                    <p className="text-sm text-slate-600">{literacyTip}</p>
                </div>
            </div>
        )}
        
         {reminders.length > 0 && (
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                    <BellIcon className="h-6 w-6 text-teal-600"/>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Reminders from Coach Mitra</h3>
                        {reminders.map(r => <p key={r.id} className="text-sm text-slate-600">{r.message}</p>)}
                    </div>
                </div>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <TrophyIcon className="h-8 w-8 text-amber-500"/>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Goal-Based Savings Planner</h3>
                        <p className="text-slate-600 text-sm">Let's plan for your next big goal!</p>
                    </div>
                </div>
                <form onSubmit={handlePlanSubmit} className="space-y-3">
                    <input type="text" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} placeholder="e.g., Buy a new cart" className="w-full px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" required/>
                    <input type="number" value={savingsAmount} onChange={(e) => setSavingsAmount(e.target.value)} placeholder="e.g., 10000" className="w-full px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" required/>
                    <button type="submit" disabled={isPlanLoading} className="w-full bg-amber-500 text-white font-bold py-2 rounded-lg hover:shadow-lg disabled:bg-slate-400 transition-all duration-300 transform hover:-translate-y-0.5">
                        {isPlanLoading ? "Creating Plan..." : "Create My Savings Plan"}
                    </button>
                </form>
                {savingsPlan && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                        <h4 className="font-bold">Your plan for "{savingsPlan.goal}":</h4>
                        {savingsPlan.steps.map((step, i) => (
                            <div key={i} className="p-2 bg-slate-100/80 rounded-lg">
                                <p className="font-semibold text-sm">Step {i+1}: {step.title}</p>
                                <p className="text-xs text-slate-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
             <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <BookOpenIcon className="h-8 w-8 text-teal-600"/>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Voice Financial Diary</h3>
                        <p className="text-slate-600 text-sm">Record a quick note about your day.</p>
                    </div>
                </div>
                <button onClick={handleToggleRecording} className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-white transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${isRecording ? 'bg-red-600' : 'bg-teal-600'}`}>
                    <MicrophoneIcon className="h-5 w-5"/>
                    {isRecording ? "Recording... Click to Stop" : "Record a New Entry"}
                </button>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
                    {diaryEntries.map(entry => (
                        <div key={entry.id} className="p-2 bg-slate-100/80 rounded-lg text-sm">
                            <p className="font-semibold">{entry.summary} ({entry.sentiment})</p>
                            <p className="text-xs text-slate-500">{entry.transcript.substring(0, 50)}...</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-1 text-slate-800">AI Budget Helper</h3>
            <p className="text-slate-600 text-sm mb-4">Describe your monthly expenses below and let Coach Mitra organize them for you. (e.g., "5000 for rent, 3000 on food, 1000 for travel...")</p>
            <form onSubmit={handleBudgetSubmit} className="space-y-3">
                <textarea
                    value={budgetText}
                    onChange={(e) => setBudgetText(e.target.value)}
                    placeholder="Tell me about your expenses..."
                    className="w-full px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    rows={3}
                    minLength={10}
                />
                <button type="submit" disabled={isBudgetLoading || budgetText.trim().length < 10} className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg disabled:bg-slate-400 transition-all duration-300 transform hover:-translate-y-0.5">
                    {isBudgetLoading ? "Analyzing Budget..." : "Analyze My Budget"}
                </button>
            </form>
             {budgetAnalysis && (
                <div className="mt-6 animate-fade-in">
                    <h4 className="font-bold text-slate-800">Your Spending Breakdown:</h4>
                    <div className="mt-3 space-y-3">
                        {budgetAnalysis.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-slate-700">{item.category}</span>
                                    <span className="text-slate-600">₹{item.amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="w-full bg-slate-200/80 rounded-full h-2.5">
                                    <div className={`${budgetColors[index % budgetColors.length]} h-2.5 rounded-full`} style={{ width: `${(item.amount / budgetTotal) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right font-bold text-lg">
                        Total: ₹{budgetTotal.toLocaleString('en-IN')}
                    </div>
                </div>
            )}
        </div>


        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-slate-800">Help Us Learn & Improve</h3>
            <p className="text-slate-600 text-sm mb-4">Your feedback helps our AI agents get smarter. How is your experience so far?</p>
            {feedbackAnalysis ? (
                <div className="text-center p-4 bg-teal-100 text-teal-700 rounded-lg animate-fade-in flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        {feedbackAnalysis.sentiment === 'Positive' && <ThumbUpIcon className="w-8 h-8 text-teal-600" />}
                        {feedbackAnalysis.sentiment === 'Negative' && <ThumbDownIcon className="w-8 h-8 text-red-600" />}
                        {feedbackAnalysis.sentiment === 'Neutral' && <FaceNeutralIcon className="w-8 h-8 text-amber-500" />}
                        <div>
                            <p className="font-bold">Thank you! Your feedback has been analyzed.</p>
                            <p className="text-sm">Summary: "{feedbackAnalysis.summary}"</p>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleFeedbackSubmit} className="flex items-start space-x-2">
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="flex-1 px-3 py-2 border bg-slate-50/50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={2}
                        minLength={10}
                    />
                    <button type="submit" disabled={feedback.trim().length < 10 || isFeedbackLoading} className="bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg disabled:bg-slate-400 transition-all duration-300 transform hover:-translate-y-0.5">
                        {isFeedbackLoading ? "..." : "Submit"}
                    </button>
                </form>
            )}
        </div>

        <div className="bg-transparent p-0 rounded-2xl">
             <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-teal-600 rounded-lg shadow-md">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Chat with Coach Mitra</h3>
            </div>
            <Chatbot userData={userData} loan={currentLoan} mobile={userData.phone} />
        </div>
        
        {/* Crisis Modal */}
        {showCrisisModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl animate-fade-in-up">
                     <h3 className="text-xl font-bold mb-2 text-slate-800">Financial Difficulty Assistant</h3>
                    {!crisisOptions ? (
                        <form onSubmit={handleCrisisSubmit}>
                            <p className="text-slate-600 text-sm mb-4">We're sorry to hear you're facing issues. Please briefly describe your situation, and our AI assistant will suggest some options.</p>
                            <textarea
                                value={crisisDescription}
                                onChange={(e) => setCrisisDescription(e.target.value)}
                                className="w-full h-24 p-2 border rounded-lg bg-slate-50 border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="e.g., My crops were damaged by heavy rain..."
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCrisisModal(false)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                                <button type="submit" disabled={isCrisisLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-slate-400 hover:bg-red-700">
                                    {isCrisisLoading ? "Analyzing..." : "Get Options"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="animate-fade-in">
                            <p className="text-sm text-slate-700 mb-4">{crisisOptions.intro}</p>
                            <div className="space-y-2">
                                {crisisOptions.options.map((opt, i) => (
                                    <div key={i} className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm">{opt}</div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-4">These are AI suggestions. A loan officer will contact you to finalize any changes.</p>
                            <div className="mt-4 flex justify-end">
                                <button type="button" onClick={() => {setShowCrisisModal(false); setCrisisOptions(null); setCrisisDescription('')}} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default RepaymentDashboard;