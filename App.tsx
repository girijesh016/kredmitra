import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Processing from './components/Processing';
import ScoreResult from './components/ScoreResult';
import CommunityValidation from './components/CommunityValidation';
import RepaymentDashboard from './components/RepaymentDashboard';
import VerificationErrorModal from './components/VerificationErrorModal';
import { AppStep, UserData, ScoreData, LoanOption, SelectedLoan, StructuredData, GeospatialAnalysis, FinancialWellnessBadge, Language, IntegratedProfile } from './types';
import { analyzeFinancialProfile, generateLoanOptions, extractStructuredData, getGeospatialAnalysis, analyzePsychometricResponses } from './services/geminiService';
import { decrypt, encryptedBankingData, encryptedGeospatialData, encryptedReferenceData, encryptedTelecomData, encryptedUtilityData } from './services/encryptedMockData';
import { extractBankingFeatures, extractGeospatialFeatures, extractTelecomFeatures, extractUtilityFeatures } from './services/featureExtractors';
import { verifyUserInTestDB } from './services/testingDatabase';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import AdminDashboard from './components/admin/AdminDashboard';


const initialBadges: FinancialWellnessBadge[] = [
    { id: 'onboarding', title: 'Onboarding Complete', description: 'You successfully shared your financial story.', achieved: true },
    { id: 'approval', title: 'First Loan Approved', description: 'You received your first set of loan options.', achieved: false },
    { id: 'first_payment', title: 'First Payment Made', description: 'You have made your first repayment on time.', achieved: false },
    { id: 'halfway', title: 'Halfway There!', description: 'You have repaid 50% of your loan.', achieved: false },
    { id: 'full_repayment', title: 'Loan Repaid!', description: 'Congratulations! You have fully repaid your loan.', achieved: false },
];

const initialProcessingSteps = [
    { text: "Initializing Multi-Agent System...", delay: 1000 },
    { text: "Perceive: Ingesting your financial story...", delay: 1500 },
    { text: "Reason: Feature Engineering Agent extracting key metrics...", delay: 2500 },
    { text: "Reason: Fraud Agent scanning for anomalies...", delay: 2000 },
    { text: "Reason: Scoring Agent analyzing income patterns...", delay: 2500 },
    { text: "Reason: Agents collaborating on your profile...", delay: 1500 },
    { text: "Act: Generating responsible loan options...", delay: 2000 },
    { text: "Learn: Finalizing your explainable report (XAI)...", delay: 1500 },
];

const simulatedProcessingSteps = [
    { text: "✅ Verified Identity via Aadhaar...", delay: 1500 },
    { text: "📡 Accessing Telecom Records...", delay: 2000 },
    { text: "💡 Analyzing Utility Payment History...", delay: 2000 },
    { text: "🏦 Reviewing Banking Transaction Patterns...", delay: 2500 },
    { text: "🤝 Checking Community References...", delay: 1500 },
    { text: "📍 Analyzing Local Economic & Environmental Factors...", delay: 2500 },
    { text: "🧠 Integrating All Data Points...", delay: 1500 },
    { text: "✨ Generating Multi-Dimensional Trust Profile...", delay: 2000 },
];

const seedMockUsers = () => {
    if (localStorage.getItem('kredmitra_users_seeded_v6')) return;

    const mockUsers = [
        {
            mobile: '9876543210', password: 'password123', firstName: 'SAHIL', lastName: 'VARSHNEY', dob: '1990-05-15', creditScore: 750, riskLevel: 'Low', status: 'Active', lastActivity: '2023-11-15', simAgeDays: 1245, rechargesLast6M: 32, avgTopUp: 15.50, rechargeVariance: 2.3, mobilityIndex: 7.8, simSwaps: 0, riskFlags: [], appStep: AppStep.REPAYMENT_DASHBOARD, channel: 'webapp', loanStatus: 'Active', loanAmount: 5000, loanRepaid: 2500, pincode: '400001', dueDate: '2023-12-15', daysOverdue: 0, inCrisis: false, crisisInfo: {}, wellnessBadges: [{id: 'onboarding', achieved: true}, {id: 'approval', achieved: true}, {id: 'first_payment', achieved: true}, {id: 'halfway', achieved: true}, {id: 'full_repayment', achieved: false}], feedback: [{text: 'The app is very easy to use!', sentiment: 'Positive', category: 'UI/UX'}], chatHistory: [{sender: 'bot', text: 'Hello SAHIL! How can I help?'}, {sender: 'user', text: 'What is my current balance?'}]
        },
        {
            mobile: '9876543211', password: 'password123', firstName: 'GIRIJESH', lastName: 'KUMAR', dob: '1985-08-20', creditScore: 620, riskLevel: 'Medium', status: 'Active', lastActivity: '2023-11-10', simAgeDays: 350, rechargesLast6M: 12, avgTopUp: 8.75, rechargeVariance: 5.1, mobilityIndex: 4.2, simSwaps: 1, riskFlags: ['SIM Swap'], appStep: AppStep.REPAYMENT_DASHBOARD, channel: 'ussd', loanStatus: 'Active', loanAmount: 8000, loanRepaid: 1000, pincode: '110001', dueDate: '2023-11-05', daysOverdue: 15, inCrisis: true, crisisInfo: {description: 'Lost my job due to company downsizing. Struggling to find new work.', aiSuggestion: 'Offer a 2-month payment pause and connect with local job support services.'}, wellnessBadges: [{id: 'onboarding', achieved: true}, {id: 'approval', achieved: true}, {id: 'first_payment', achieved: false}, {id: 'halfway', achieved: false}, {id: 'full_repayment', achieved: false}], feedback: [{text: 'The interest rate seems a bit high.', sentiment: 'Negative', category: 'Loan Terms'}], chatHistory: []
        },
        {
            mobile: '9876543212', password: 'password123', firstName: 'LIVIA', lastName: 'ROSE', dob: '1992-01-30', creditScore: 810, riskLevel: 'Low', status: 'Active', lastActivity: '2023-11-14', simAgeDays: 2100, rechargesLast6M: 36, avgTopUp: 25.00, rechargeVariance: 1.5, mobilityIndex: 8.9, simSwaps: 0, riskFlags: [], appStep: AppStep.REPAYMENT_DASHBOARD, channel: 'webapp', loanStatus: 'Completed', loanAmount: 10000, loanRepaid: 10000, pincode: '560001', dueDate: null, daysOverdue: 0, inCrisis: false, crisisInfo: {}, wellnessBadges: [{id: 'onboarding', achieved: true}, {id: 'approval', achieved: true}, {id: 'first_payment', achieved: true}, {id: 'halfway', achieved: true}, {id: 'full_repayment', achieved: true}], feedback: [{text: 'The financial coach is very helpful.', sentiment: 'Positive', category: 'AI Coach'}], chatHistory: [{sender: 'bot', text: 'Welcome LIVIA!'}, {sender: 'user', text: 'How can I improve my savings?'}, {sender: 'bot', text: 'A great way is to set a small, achievable goal first!'}]
        },
        {
            mobile: '9876543213', password: 'password123', firstName: 'NISANTH', lastName: 'KUMAR', dob: '1988-11-05', creditScore: 700, riskLevel: 'Medium', status: 'Active', lastActivity: '2023-11-13', simAgeDays: 800, rechargesLast6M: 25, avgTopUp: 12.00, rechargeVariance: 3.0, mobilityIndex: 6.5, simSwaps: 0, riskFlags: ['Multiple Aadhaar Linked'], appStep: AppStep.COMMUNITY_VALIDATION, channel: 'webapp', loanStatus: 'Pending', loanAmount: 7500, loanRepaid: 0, pincode: '600001', dueDate: null, daysOverdue: 0, inCrisis: false, crisisInfo: {}, wellnessBadges: [{id: 'onboarding', achieved: true}, {id: 'approval', achieved: false}, {id: 'first_payment', achieved: false}, {id: 'halfway', achieved: false}, {id: 'full_repayment', achieved: false}], feedback: [], chatHistory: []
        },
        {
            mobile: '9876543214', password: 'password123', firstName: 'ISHRIT', lastName: 'RAJ', dob: '1995-03-25', creditScore: 580, riskLevel: 'High', status: 'Inactive', lastActivity: '2023-11-09', simAgeDays: 150, rechargesLast6M: 5, avgTopUp: 5.50, rechargeVariance: 8.2, mobilityIndex: 2.1, simSwaps: 0, riskFlags: ['High Churn Risk'], appStep: AppStep.ONBOARDING, channel: 'ussd', loanStatus: 'Rejected', loanAmount: 0, loanRepaid: 0, pincode: '700001', dueDate: null, daysOverdue: 0, inCrisis: false, crisisInfo: {}, wellnessBadges: [{id: 'onboarding', achieved: false}, {id: 'approval', achieved: false}, {id: 'first_payment', achieved: false}, {id: 'halfway', achieved: false}, {id: 'full_repayment', achieved: false}], feedback: [{text: 'The application process was confusing.', sentiment: 'Negative', category: 'Onboarding'}], chatHistory: []
        },
    ];

    // Clear old users to ensure only 5 exist
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('kredmitra_user_')) {
            localStorage.removeItem(key);
        }
    }

    mockUsers.forEach(user => {
        localStorage.setItem(`kredmitra_user_${user.mobile}`, JSON.stringify(user));
    });

    localStorage.setItem('kredmitra_users_seeded_v6', 'true');
};


const App: React.FC = () => {
  // App state
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.ONBOARDING);
  const [processingSteps, setProcessingSteps] = useState(initialProcessingSteps);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<SelectedLoan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationErrorModal, setShowVerificationErrorModal] = useState<boolean>(false);
  const [geospatialAnalysis, setGeospatialAnalysis] = useState<GeospatialAnalysis | null>(null);
  const [integratedProfile, setIntegratedProfile] = useState<IntegratedProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Seed mock data on initial load
  useEffect(() => {
    seedMockUsers();
  }, []);

  // Check for session on initial load
  useEffect(() => {
    try {
      const session = localStorage.getItem('kredmitra_session');
      if (session) {
          const user = JSON.parse(session);
          setCurrentUser(user);
          setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to parse session from localStorage", e);
      localStorage.removeItem('kredmitra_session');
    }
  }, []);

  const processWebAppDate = useCallback(async (finalUserData: UserData) => {
    setError(null);
    // Verification is now handled inside the Onboarding component for immediate feedback.
    
    setCurrentStep(AppStep.PROCESSING);
    setProcessingSteps(initialProcessingSteps);
    setUserData(finalUserData);
    setIntegratedProfile(null);

    try {
      // Step 1: Feature Engineering
      const structuredData: StructuredData = await extractStructuredData(finalUserData);
      const enrichedUserData = { ...finalUserData, structuredData };
      
      // Step 2: Geospatial Analysis (if applicable)
      const geoAnalysis: GeospatialAnalysis | null = await getGeospatialAnalysis(finalUserData.location, finalUserData.profession, finalUserData.pincode);
      setGeospatialAnalysis(geoAnalysis);

      // Step 3: Psychometric Analysis (if applicable)
      let psychometricAnalysis: string | null = null;
      if(finalUserData.psychometricResponses && Object.keys(finalUserData.psychometricResponses).length > 0) {
          psychometricAnalysis = await analyzePsychometricResponses(finalUserData.psychometricResponses);
      }

      // Step 4: Core Analysis with all data
      const analysisResult = await analyzeFinancialProfile(enrichedUserData, null, psychometricAnalysis);
      setScoreData(analysisResult);
      
      // Step 5: Loan Generation
      const loans = await generateLoanOptions(enrichedUserData, analysisResult);
      setLoanOptions(loans);

      setCurrentStep(AppStep.SCORE_RESULT);
    } catch (err) {
      console.error("Error during AI processing:", err);
      setError("An error occurred while analyzing your profile. Our agents are looking into it. Please try again later.");
      setCurrentStep(AppStep.ONBOARDING); // Go back to start on error
    }
  }, []);

  const processUssdApplication = async (initialData: UserData): Promise<ScoreData | null> => {
    setError(null);
    const isVerified = verifyUserInTestDB(
        initialData.name,
        initialData.aadhaar,
        initialData.phone,
        initialData.accountNumber || ''
    );

    if (!isVerified) {
        setShowVerificationErrorModal(true);
        return null;
    }
    
    setProcessingSteps(simulatedProcessingSteps); // Set this for the main processing screen if needed, though USSD is self-contained.
    setUserData(initialData);

    try {
      // Use the verified Aadhaar for data lookups
      const userIdForLookup = initialData.aadhaar;
      const userPincode = initialData.pincode;

      const validPincodes = encryptedGeospatialData.map(d => d.pincode);
      // Use the user's pincode if it exists in our mock data, otherwise default to the first one.
      const pincodeForLookup = validPincodes.includes(userPincode) ? userPincode : validPincodes[0];

      // 1. Find and decrypt data from mock sources
      const telecomRecord = encryptedTelecomData.find(d => d.userId === userIdForLookup);
      const utilityRecord = encryptedUtilityData.find(d => d.userId === userIdForLookup);
      const bankingRecord = encryptedBankingData.find(d => d.userId === userIdForLookup);
      const referenceRecord = encryptedReferenceData.find(d => d.userId === userIdForLookup);
      const geospatialRecord = encryptedGeospatialData.find(d => d.pincode === pincodeForLookup);

      if (!telecomRecord || !utilityRecord || !bankingRecord || !geospatialRecord || !referenceRecord) {
          throw new Error(`Could not find complete mock records for the test user (${userIdForLookup}). Please check mock data sources.`);
      }
      
      const decryptedTelecom = decrypt(telecomRecord.encryptedPayload);
      const decryptedUtility = decrypt(utilityRecord.encryptedPayload);
      const decryptedBanking = decrypt(bankingRecord.encryptedPayload);
      const decryptedReference = decrypt(referenceRecord.encryptedPayload);
      const decryptedGeospatial = decrypt(geospatialRecord.encryptedPayload);
      
      // 2. Extract features using "algorithms"
      const telecomFeatures = extractTelecomFeatures(decryptedTelecom);
      const utilityFeatures = extractUtilityFeatures(decryptedUtility);
      const bankingFeatures = extractBankingFeatures(decryptedBanking);
      const geospatialFeatures = extractGeospatialFeatures(decryptedGeospatial);
      
      // 3. Integrate all features into a single profile
      const fullProfile: IntegratedProfile = {
          telecom: telecomFeatures,
          utility: utilityFeatures,
          banking: bankingFeatures,
          geospatial: geospatialFeatures,
          reference: decryptedReference,
      };
      setIntegratedProfile(fullProfile);

      // 4. Psychometric Analysis (if applicable)
      let psychometricAnalysis: string | null = null;
      if(initialData.psychometricResponses && Object.keys(initialData.psychometricResponses).length > 0) {
          psychometricAnalysis = await analyzePsychometricResponses(initialData.psychometricResponses);
      }

      // 5. Core Analysis with integrated profile
      const analysisResult = await analyzeFinancialProfile(initialData, fullProfile, psychometricAnalysis);
      setScoreData(analysisResult);
      
      // 6. Loan Generation
      const loans = await generateLoanOptions(initialData, analysisResult);
      setLoanOptions(loans);
      
      return analysisResult; // Return the result to the caller

    } catch (err: any) {
        console.error("Error during simulated data processing:", err);
        setError(err.message || "An error occurred during the simulation. Please try again.");
        return null;
    }
  };
  
  const handleOnboardingComplete = (data: UserData, source: 'webapp' | 'ussd') => {
    // Overwrite the onboarding data with the full name from the auth step
    const finalData = { ...data, name: `${currentUser.firstName} ${currentUser.lastName}`};

    if (source === 'ussd') {
      // For USSD, this is called AFTER the score is already calculated and displayed.
      // We just need to show the results page now.
      setCurrentStep(AppStep.SCORE_RESULT);
    } else {
      processWebAppDate(finalData);
    }
  };

  const handleAcceptLoan = (loan: LoanOption) => {
    const badges = initialBadges.map(b => b.id === 'approval' ? { ...b, achieved: true } : b);
    const finalLoan = { ...loan, repaid: 0, badges };
    setSelectedLoan(finalLoan);
    setCurrentStep(AppStep.COMMUNITY_VALIDATION);
  };
  
  const handleValidationComplete = () => {
      setCurrentStep(AppStep.REPAYMENT_DASHBOARD);
  }

  const handleReset = () => {
    setCurrentStep(AppStep.ONBOARDING);
    setUserData(null);
    setScoreData(null);
    setLoanOptions([]);
    setSelectedLoan(null);
    setError(null);
    setShowVerificationErrorModal(false);
    setGeospatialAnalysis(null);
    setIntegratedProfile(null);
    setProcessingSteps(initialProcessingSteps);
  }

  // --- Auth Handlers ---
  const handleLogin = (mobileOrEmail: string, pass: string, isAdminLogin: boolean): boolean => {
    if (isAdminLogin) {
        if (mobileOrEmail === 'gk.destroyer016@gmail.com' && pass === '123456') {
            const adminUser = {
                firstName: 'SNEHA',
                lastName: '',
                email: 'gk.destroyer016@gmail.com',
                isAdmin: true,
            };
            localStorage.setItem('kredmitra_session', JSON.stringify(adminUser));
            setCurrentUser(adminUser);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }

    const storedUser = localStorage.getItem(`kredmitra_user_${mobileOrEmail}`);
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.password === pass) {
                const sessionUser = { ...user, isAdmin: false };
                localStorage.setItem('kredmitra_session', JSON.stringify(sessionUser));
                setCurrentUser(sessionUser);
                setIsAuthenticated(true);
                return true;
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            return false;
        }
    }
    return false;
  };

  const handleSignUp = (newUser: any): boolean => {
      const { mobile } = newUser;
      if (localStorage.getItem(`kredmitra_user_${mobile}`)) {
          return false; // User already exists
      }
      // Create a full user object compatible with the admin dashboard
      const userToStore = {
          ...newUser,
          isAdmin: false,
          creditScore: 680,
          riskLevel: 'Medium',
          status: 'Active',
          lastActivity: new Date().toISOString().split('T')[0],
          simAgeDays: 100,
          rechargesLast6M: 10,
          avgTopUp: 10.0,
          rechargeVariance: 3.0,
          mobilityIndex: 5.0,
          simSwaps: 0,
          riskFlags: [],
          appStep: AppStep.ONBOARDING,
          channel: 'webapp',
          loanStatus: 'None',
          loanAmount: 0,
          loanRepaid: 0,
          pincode: '000000',
          dueDate: null,
          daysOverdue: 0,
          inCrisis: false,
          crisisInfo: {},
          wellnessBadges: initialBadges.map(b => ({ ...b, achieved: b.id === 'onboarding' })),
          feedback: [],
          chatHistory: [],
      };

      localStorage.setItem(`kredmitra_user_${mobile}`, JSON.stringify(userToStore));
      localStorage.setItem('kredmitra_session', JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      setIsAuthenticated(true);
      return true;
  };

  const handleLogout = () => {
      localStorage.removeItem('kredmitra_session');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthView('login');
      handleReset(); // Reset the main app state
  };
  
  const renderContent = () => {
    if (!isAuthenticated) {
        if (authView === 'login') {
            return <LoginPage onLogin={handleLogin} switchToSignUp={() => setAuthView('signup')} />;
        }
        return <SignUpPage onSignUp={handleSignUp} switchToLogin={() => setAuthView('login')} />;
    }

    if (currentUser?.isAdmin) {
        return <AdminDashboard currentUser={currentUser} />;
    }

    switch (currentStep) {
      case AppStep.ONBOARDING:
        return (
            <div>
                {error && <div className="bg-[#E74C3C]/10 border-l-4 border-[#E74C3C] text-[#E74C3C] font-medium p-4 mb-4 rounded-r-lg" role="alert"><p>{error}</p></div>}
                <Onboarding 
                    onComplete={handleOnboardingComplete} 
                    language={language} 
                    setLanguage={setLanguage} 
                    processUssdApplication={processUssdApplication}
                    onVerificationFailed={() => setShowVerificationErrorModal(true)}
                />
            </div>
        );
      case AppStep.PROCESSING:
        return <Processing steps={processingSteps}/>;
      case AppStep.SCORE_RESULT:
        if (scoreData && loanOptions.length > 0 && userData) {
          return <ScoreResult userData={userData} scoreData={scoreData} loanOptions={loanOptions} onAcceptLoan={handleAcceptLoan} geoAnalysis={geospatialAnalysis} integratedProfile={integratedProfile} />;
        }
        // Fallback case for loading or error
        return <Processing steps={processingSteps} />;
      case AppStep.COMMUNITY_VALIDATION:
        if (scoreData) {
            return <CommunityValidation verificationStep={scoreData.verificationStep} onComplete={handleValidationComplete} />;
        }
        handleReset();
        return null;
      case AppStep.REPAYMENT_DASHBOARD:
        if (selectedLoan && userData) {
          return <RepaymentDashboard loan={selectedLoan} userData={userData} />;
        }
         // Fallback to start if loan is not set
        handleReset();
        return null;
      default:
        return <Onboarding onComplete={handleOnboardingComplete} language={language} setLanguage={setLanguage} onVerificationFailed={() => setShowVerificationErrorModal(true)} />;
    }
  };

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout} onSignUpClick={() => setAuthView('signup')} isAdmin={currentUser?.isAdmin}>
      {renderContent()}
      <VerificationErrorModal 
        isOpen={showVerificationErrorModal} 
        onClose={() => setShowVerificationErrorModal(false)} 
      />
    </Layout>
  );
};

export default App;
