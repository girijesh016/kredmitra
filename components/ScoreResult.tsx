import React, { useState, useEffect } from 'react';
import type { ScoreData, LoanOption, UserData, GeospatialAnalysis, ScoreSimulation, IntegratedProfile } from '../types';
import { getRagExplanation, simulateScoreChange, getScoreDeepDive, generateVouchingSms, getPersonalizedActionableInsight } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { UserIcon } from './icons/UserIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { PuzzlePieceIcon } from './icons/PuzzlePieceIcon';
import FeatureAnalysisChart from './FeatureAnalysisChart';


interface ScoreResultProps {
  userData: UserData;
  scoreData: ScoreData;
  loanOptions: LoanOption[];
  onAcceptLoan: (loan: LoanOption) => void;
  geoAnalysis: GeospatialAnalysis | null;
  integratedProfile: IntegratedProfile | null;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const percentage = ((score - 300) / (850 - 300)) * 100;
    const strokeDashoffset = 283 * (1 - percentage / 100);
    const scoreColorClass = score > 700 ? 'text-teal-500' : score > 600 ? 'text-amber-500' : 'text-red-500';

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                </defs>
                <circle className="text-slate-200/80" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className={scoreColorClass}
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="url(#gaugeGradient)"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColorClass}`}>
                <span className="text-5xl font-bold tracking-tight">{score}</span>
                <span className="text-sm font-medium">Final Score</span>
            </div>
        </div>
    );
};

const DimensionScore: React.FC<{ title: string; score: number; description: string, icon: React.ReactNode }> = ({ title, score, description, icon }) => {
    const scoreColor = score > 700 ? 'bg-teal-500' : score > 600 ? 'bg-amber-500' : 'bg-red-500';
    return (
        <div className="bg-white/50 p-4 rounded-xl text-center border border-slate-200/80 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                    {icon}
                    <h4 className="font-semibold text-slate-700">{title}</h4>
                </div>
                <div className={`mx-auto w-20 h-20 rounded-full border-4 border-white/80 shadow-inner flex items-center justify-center font-bold text-2xl ${scoreColor} text-white`}>
                    {score}
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 px-2">{description}</p>
        </div>
    )
}

const AgentCard: React.FC<{ title: string; rationale: string; onDeepDive?: () => void; risk?: 'Low' | 'Medium' | 'High'; dynamicNote?: string; icon: React.ReactNode; borderColor: string; }> = ({ title, rationale, onDeepDive, risk, dynamicNote, icon, borderColor }) => {
    const riskColor = risk === 'Low' ? 'text-teal-600 bg-teal-100' : risk === 'Medium' ? 'text-amber-600 bg-amber-100' : risk === 'High' ? 'text-red-600 bg-red-100' : 'text-slate-600';
    return (
        <div className={`bg-white/60 p-4 rounded-lg border border-slate-200/80 flex flex-col border-l-4 ${borderColor}`}>
            <div className="flex items-center mb-2">
                {icon}
                <h4 className="font-bold text-slate-800 ml-2">{title}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-2 flex-grow">
                {rationale}
                {onDeepDive && <button onClick={onDeepDive} className="text-teal-600 text-xs font-semibold ml-1 hover:underline">Learn more</button>}
            </p>
            {dynamicNote && dynamicNote !== "N/A" && (
                <div className="mb-3 mt-1 p-2 bg-slate-100/80 rounded-md text-xs text-slate-700 flex items-start gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5"/> 
                    <div>
                        <span className="font-semibold">Dynamic Risk Adjustment:</span> {dynamicNote}
                    </div>
                </div>
            )}
            {risk && <p className={`text-sm font-bold inline-block px-2 py-1 rounded-md self-start ${riskColor}`}>{risk} Risk</p>}
        </div>
    );
};

const ScoreResult: React.FC<ScoreResultProps> = ({ userData, scoreData, loanOptions, onAcceptLoan, geoAnalysis, integratedProfile }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplainLoading, setIsExplainLoading] = useState(false);
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [isDeepDiveLoading, setIsDeepDiveLoading] = useState(false);
  const [smsPreview, setSmsPreview] = useState<string | null>(null);
  const [isSmsLoading, setIsSmsLoading] = useState(false);
  const [actionableInsight, setActionableInsight] = useState<string>('');
  
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<ScoreSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);


  useEffect(() => {
    getPersonalizedActionableInsight(userData, scoreData).then(setActionableInsight);
  }, [userData, scoreData]);

  const handleExplainClick = async () => {
    setIsExplainLoading(true);
    setExplanation(null);
    try {
        const result = await getRagExplanation(scoreData);
        setExplanation(result);
    } catch (e) {
        setExplanation("Sorry, I couldn't get an explanation right now. Please try again.");
    } finally {
        setIsExplainLoading(false);
    }
  };
  
  const handleDeepDive = async () => {
      setIsDeepDiveLoading(true);
      setDeepDive(null);
      try {
          const result = await getScoreDeepDive(scoreData);
          setDeepDive(result);
      } catch (e) {
          setDeepDive("Could not get details at this time.");
      } finally {
          setIsDeepDiveLoading(false);
      }
  };
  
  const handleSmsPreview = async () => {
      setIsSmsLoading(true);
      setSmsPreview(null);
      try {
          const result = await generateVouchingSms(userData);
          setSmsPreview(result);
      } catch (e) {
          // No user-facing error, just hide modal if it fails
      } finally {
          setIsSmsLoading(false);
      }
  };

  const handleSimulateClick = async () => {
    if (!selectedScenario) return;
    setIsSimulating(true);
    setSimulationResult(null);
    try {
        const result = await simulateScoreChange(scoreData, selectedScenario);
        setSimulationResult(result);
    } catch (e) {
        setSimulationResult({ newScore: scoreData.finalScore, rationale: "Sorry, the simulator couldn't run right now."});
    } finally {
        setIsSimulating(false);
    }
  };

  const scenarios = [
    "I make all my utility bill payments digitally for the next 3 months.",
    "I join a local Self-Help Group (SHG).",
    "I secure a stable, monthly income source.",
    "I experience an unexpected medical expense.",
    "I start a small side business with consistent income."
  ];

  return (
    <div className="space-y-8 animate-fade-in">
        {integratedProfile && <FeatureAnalysisChart profile={integratedProfile} />}
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Your Financial Health Report</h2>
            <p className="text-slate-600 mb-6">Here's your Multi-Dimensional Trust Profile from our AI agents.</p>
            <div className="flex justify-center mb-8">
                <ScoreGauge score={scoreData.finalScore} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200/80 pt-6">
                <DimensionScore title="Consistency" score={scoreData.consistencyScore} description="Based on financial discipline and regular income." icon={<DocumentTextIcon className="w-5 h-5 text-slate-500"/>} />
                <DimensionScore title="Community Trust" score={scoreData.communityTrustScore} description="From social vouching and community standing." icon={<UserIcon className="w-5 h-5 text-slate-500"/>} />
                <DimensionScore title="Resilience" score={scoreData.resilienceScore} description="Ability to handle unexpected financial shocks." icon={<ShieldCheckIcon className="w-5 h-5 text-slate-500"/>} />
            </div>
            <div className="mt-8 text-center space-y-3">
                <button 
                    onClick={handleExplainClick} 
                    disabled={isExplainLoading}
                    className="text-teal-600 font-medium hover:underline disabled:text-slate-400"
                >
                    {isExplainLoading ? "Coach Mitra is thinking..." : "Ask for a RAG-Powered Explanation"}
                </button>
                {explanation && (
                    <div className="bg-slate-100/80 p-3 rounded-lg text-sm text-slate-600 text-left animate-fade-in">
                        <p><span className="font-bold text-teal-600">Coach Mitra says:</span> {explanation}</p>
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Explainability Module (XAI)</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <AgentCard title="Scoring Agent" rationale={scoreData.scoreRationale} icon={<SparklesIcon className="w-5 h-5 text-teal-600" />} onDeepDive={handleDeepDive} borderColor="border-teal-500" />
                <AgentCard title="Fraud Agent" rationale={scoreData.fraudRationale} risk={scoreData.fraudRisk} dynamicNote={scoreData.dynamicRiskAdjustment} icon={<ShieldCheckIcon className="w-5 h-5 text-red-600" />} borderColor="border-red-500" />
                {geoAnalysis && geoAnalysis.rationale !== "N/A for non-agricultural professions." && (
                     <AgentCard title="Geospatial Analyst" rationale={geoAnalysis.rationale} icon={<MapPinIcon className="w-5 h-5 text-teal-600" />} borderColor="border-teal-500" />
                )}
                {scoreData.psychometricAnalysis && (
                     <AgentCard title="Psychometric Analyst" rationale={scoreData.psychometricAnalysis} icon={<PuzzlePieceIcon className="w-5 h-5 text-teal-600" />} borderColor="border-teal-500" />
                )}
            </div>
            {(isDeepDiveLoading || deepDive) && (
                <div className="mt-4 bg-slate-100/80 p-4 rounded-lg animate-fade-in">
                    <h4 className="font-semibold text-sm text-slate-800">Score Deep Dive:</h4>
                    <p className="text-sm text-slate-600 mt-1">{isDeepDiveLoading ? "Loading details..." : deepDive}</p>
                </div>
            )}
            <div className="mt-4 bg-amber-100 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start">
                <div className="flex-shrink-0">
                    <ClipboardCheckIcon className="w-6 h-6 text-amber-700" />
                </div>
                <div className="ml-3 flex-grow">
                    <p className="text-sm text-amber-800 font-bold">Verification Agent Suggestion:</p>
                    <p className="text-sm text-amber-700">{scoreData.verificationStep}</p>
                </div>
                <button onClick={handleSmsPreview} className="ml-4 text-xs bg-white text-teal-600 font-semibold py-1 px-2 border border-teal-600/20 rounded-md hover:bg-teal-50 shadow-sm">
                    {isSmsLoading ? "..." : "Preview SMS"}
                </button>
            </div>
            {smsPreview && (
                <div className="mt-4 animate-fade-in flex justify-center">
                    <div className="w-full max-w-sm bg-slate-800 rounded-2xl border-8 border-slate-900 p-2 shadow-2xl">
                        <div className="bg-slate-100 rounded-lg p-3">
                            <p className="text-xs text-slate-500 text-center mb-2">New Message</p>
                            <p className="text-sm text-slate-800">{smsPreview}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-1 text-slate-800">"What If?" Score Simulator</h3>
            <p className="text-slate-600 text-sm mb-4">See how your financial actions could impact your score. Select a scenario below.</p>
            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full px-4 py-3 border bg-slate-50/50 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                    <option value="" disabled>Select a future action...</option>
                    {scenarios.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
                <button
                    onClick={handleSimulateClick}
                    disabled={isSimulating || !selectedScenario}
                    className="w-full sm:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isSimulating ? "Simulating..." : "Simulate Impact"}
                </button>
            </div>

            {(isSimulating || simulationResult) && (
                <div className="mt-4 p-4 bg-slate-100/80 rounded-lg animate-fade-in">
                    {isSimulating ? (
                        <p className="text-center text-slate-600">Our AI is predicting the future...</p>
                    ) : simulationResult && (
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">New Potential Score</p>
                                <p className="text-4xl font-bold text-teal-600">{simulationResult.newScore}</p>
                            </div>
                            <div className="border-l border-slate-300 pl-4">
                                <p className="text-sm font-semibold text-slate-500">Coach's Rationale</p>
                                <p className="text-sm text-slate-700">{simulationResult.rationale}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {actionableInsight && (
                <div className="mt-6 bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-amber-800 text-sm">Your #1 Personalized Insight:</h4>
                <p className="text-sm text-amber-700">{actionableInsight}</p>
                </div>
            )}
        </div>

        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Recommended Loan Options</h3>
            <div className="space-y-4">
                {loanOptions.map((loan, index) => (
                    <div key={index} className="border border-slate-200/80 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/50 hover:bg-white/80 hover:shadow-md transition-all">
                        <div>
                            <h4 className="font-bold text-lg text-teal-600">{loan.name}</h4>
                            <p className="text-slate-600 text-sm">{loan.description}</p>
                            <div className="mt-2 flex items-center space-x-4 text-sm">
                                <span className="font-medium">Amount: ₹{loan.amount.toLocaleString('en-IN')}</span>
                                <span className="text-slate-500">|</span>
                                <span className="font-medium">Repayment: {loan.repayment}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => onAcceptLoan(loan)}
                            className="mt-3 sm:mt-0 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto flex-shrink-0 transform hover:-translate-y-0.5"
                        >
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ScoreResult;