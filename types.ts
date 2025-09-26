

export enum AppStep {
  ONBOARDING,
  PROCESSING,
  SCORE_RESULT,
  COMMUNITY_VALIDATION,
  REPAYMENT_DASHBOARD,
}

// FIX: Moved JourneyStep enum here to be shared across components.
export enum JourneyStep {
  INFO,
  CONSENT,
  PROFESSION_QUESTIONS,
  DATA_INPUT,
  CLARIFICATION,
  PSYCHOMETRIC,
}

export type Language = 'en' | 'hi' | 'ta' | 'kn' | 'te' | 'bn' | 'mr' | 'gu' | 'ml' | 'pa' | 'or';

export interface StructuredData {
  incomeRegularity: string;
  repaymentHistory: string;
  financialShockIndicators: string;
  behavioralMetrics: string;
  lifeEventSignals: string;
}

export interface AdditionalDocument {
    name: string;
    mimeType: string;
    data: string;
    verificationResult: string;
    category: 'Identity' | 'Work' | 'Asset' | 'Other';
}

export interface AlternativeData {
  simAgeDays?: number;
  avgTopupAmount?: number;
  utilityBillsPaidLast6M?: number;
  dataUsageMb?: number;
  tenure?: number;
  contract?: 'Month-to-month' | 'One year' | 'Two year';
  paperlessBilling?: boolean;
  paymentMethod?: 'Electronic check' | 'Mailed check' | 'Bank transfer (automatic)' | 'Credit card (automatic)';
  monthlyCharges?: number;
  totalCharges?: number;
  usesMobilePayments?: boolean;
  hasSavingsHabit?: boolean;
  // Profession-specific data
  cropTypes?: string;
  landSizeAcres?: number;
  hasWarehouseAccess?: boolean;
  primaryPlatform?: string;
  avgDailyEarnings?: number;
  vehicleOwned?: 'None' | '2-Wheeler' | '3-Wheeler' | '4-Wheeler';
  avgDailyFootfall?: number;
  inventoryValue?: number;
  usesDigitalPayments?: boolean;
  groupName?: string;
  yearsInGroup?: number;
  groupActivity?: string;
  businessType?: string;
  yearsInBusiness?: number;
  avgMonthlyProfit?: number;
}

export interface UserData {
  name: string;
  phone: string;
  aadhaar: string;
  profession: string;
  location: string;
  pincode: string;
  incomeType: string;
  financialStatement: string;
  financialStatementImage?: {
    mimeType: string;
    data: string;
  };
  additionalDocuments?: AdditionalDocument[];
  digitizedLedgerText?: string;
  structuredData?: StructuredData;
  psychometricResponses?: { [key: string]: string };
  clarificationResponses?: { question: string; answer: string; }[];
  referenceContact?: { name: string; relationship: string; };
  alternativeData?: AlternativeData;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface GeospatialAnalysis {
    prospectiveYieldScore: number;
    rationale: string;
}

export interface ScoreData {
  finalScore: number;
  consistencyScore: number;
  communityTrustScore: number;
  resilienceScore: number;
  scoreRationale: string;
  fraudRisk: 'Low' | 'Medium' | 'High';
  fraudRationale: string;
  verificationStep: string;
  dynamicRiskAdjustment?: string;
  psychometricAnalysis?: string;
}

export interface LoanOption {
  name: string;
  amount: number;
  repayment: string;
  description: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface FinancialWellnessBadge {
    id: string;
    title: string;
    description: string;
    achieved: boolean;
}

export interface SelectedLoan extends LoanOption {
  repaid: number;
  badges: FinancialWellnessBadge[];
}

export interface BudgetCategory {
  category: string;
  amount: number;
}

export interface DiaryEntry {
    id: number;
    date: string;
    transcript: string;
    summary: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface SavingsPlan {
    goal: string;
    amount: number;
    steps: { title: string; description: string; }[];
}

export interface Reminder {
    id: number;
    message: string;
}

export interface PredictiveIntervention {
    needsHelp: boolean;
    suggestion: string;
}

export interface ScoreSimulation {
  newScore: number;
  rationale: string;
}

export interface FeedbackAnalysis {
    category: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    summary: string;
}

// New Types for Simulated Data Pipeline
export interface TelecomFeatures {
    simStabilityScore: number; // 0-1
    rechargeConsistency: number; // 0-1
    dataUsageProfile: 'Low' | 'Medium' | 'High';
}

export interface UtilityFeatures {
    paymentDisciplineScore: number; // 0-1
    activeServices: number;
}

export interface BankingFeatures {
    incomePredictability: number; // 0-1
    savingsCapacity: number; // 0-1
    transactionProfile: 'Stable' | 'Volatile';
}

export interface GeospatialFeatures {
    seasonalOutlook: string;
    demographicProfile: string;
    localEconomicDriver: string;
    avgIncomeBracket: string;
    environmentalRiskScore: number; // 0-1
    localEconomicStabilityScore: number; // 0-1
}

export interface IntegratedProfile {
    telecom: TelecomFeatures;
    utility: UtilityFeatures;
    banking: BankingFeatures;
    geospatial: GeospatialFeatures;
    reference: {
        groupName?: string;
        referenceContact?: { name: string; relationship: string };
    }
}
