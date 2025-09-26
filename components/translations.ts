

import { AppStep, Language, ScoreData } from '../types';

// FIX: JourneyStep is now defined in types.ts. The import error is resolved by that change.
// The JourneyStep enum is used below to provide type-safe IDs for the stepper.
import { JourneyStep } from '../types';

export const supportedLanguages: { code: Language, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'ଓଡ଼ିଆ' },
];

const enTranslations = {
    professions: ["Small Farmer", "Gig Worker", "Kirana Shop Owner", "SHG Member", "Micro-Entrepreneur"],
    incomeTypes: ["Daily", "Weekly", "Monthly", "Seasonal/Irregular"],
    stepper: [
        { id: JourneyStep.INFO, name: "Identity" },
        { id: JourneyStep.CONSENT, name: "Consent" },
        { id: JourneyStep.PROFESSION_QUESTIONS, name: "Work Details" },
        { id: JourneyStep.DATA_INPUT, name: "Extra Info" },
        { id: JourneyStep.PSYCHOMETRIC, name: "Finish" }
    ],
    channel: {
        title: "Choose Your Onboarding Channel",
        subtitle: "We offer multiple ways to apply, ensuring accessibility for everyone. Select the method that works best for you.",
        webapp: { title: "Web App", description: "Full-featured, interactive experience. (You are here)" },
        ussd: { title: "USSD (Text-Based)", description: "Works on any mobile phone, no internet needed." },
        helpLink: "Which channel should I choose?",
        helpModal: {
            title: "Choosing the Right Channel",
            points: [
                { title: "Web App", description: "Best for smartphones with internet. Allows uploading documents and a rich visual experience." },
                { title: "USSD", description: "Use this if you have a basic phone ('feature phone') without internet. You will interact using your keypad." }
            ],
            closeButton: "Close"
        }
    },
    info: {
        title: "Welcome! Let's get started.",
        subtitle: "Your data is safe, encrypted, and shared only with your consent.",
        secure: "🔒 Secure",
        compliant: "✔ RBI-Compliant",
        multilingual: "🌐 Multilingual",
        fullNameLabel: "Full Name",
        fullNamePlaceholder: "As per Aadhaar/PAN",
        phoneLabel: "10-Digit Phone Number",
        sendOtpButton: "Send OTP",
        otpLabel: "Enter 6-Digit OTP",
        verifyButton: "Verify",
        resendOtpTimer: "Resend OTP in {otpTimer}s",
        resendOtpLink: "Resend OTP",
        phoneVerified: "Phone Number Verified",
        aadhaarLabel: "Full 12-Digit Aadhaar Number",
        aadhaarPlaceholder: "e.g., 123456789012",
        occupationLabel: "Main Occupation",
        selectOccupation: "Select your profession",
        locationLabel: "Location (City, State)",
        locationPlaceholder: "e.g., Pune, Maharashtra",
        pincodeLabel: "Pincode",
        pincodePlaceholder: "e.g., 400001",
        incomePatternLabel: "Income Pattern",
        incomePatternTooltip: "How often you get paid helps us understand your cash flow.",
        selectIncomePattern: "Select your income pattern",
        bankDetailsTitle: "Bank Account Details",
        bankNameLabel: "Bank Name",
        bankNamePlaceholder: "e.g., State Bank of India",
        accountNumberLabel: "Account Number",
        accountNumberPlaceholder: "Enter account number",
        ifscCodeLabel: "IFSC Code",
        ifscCodePlaceholder: "e.g., SBIN0001234",
        prefillLabel: "Pre-fill Example:",
        needHelpLink: "Need Help?",
        continueButton: "➡ Continue to Next Step",
        stepDescription: "This step helps us build your unique financial profile."
    },
    consent: {
        title: "Your Privacy is Important",
        subtitle: "We respect your data. You stay in control.",
        tag1: "Encrypted Data",
        tag2: "RBI Aligned",
        tag3: "No Third-Party Sharing",
        main: "To assess your financial health, our AI system needs to analyze the information you provide. This includes:",
        points: [
            { text: "What you do and where you live.", topic: "Occupation and Income", ariaLabel: "Why we need your occupation and location" },
            { text: "The money story you tell us (text, voice, or picture).", topic: "Financial Story", ariaLabel: "Why we need your financial story" },
            { text: "Your answers to small financial questions.", topic: "Situational Questions", ariaLabel: "Why we need your answers to situational questions" },
            { text: "Any documents you upload (like work IDs or asset photos).", topic: "Uploaded Documents", ariaLabel: "Why we need your uploaded documents" }
        ],
        explanationTitle: "Why we ask for this",
        explanationLoading: "Loading explanation...",
        explanationFallback: "We need this information to build a complete and fair picture of your financial health, which helps us provide the best options for you.",
        explanationGotIt: "Got it",
        checkboxLabel: "I agree and give my consent.",
        agreeButton: "Agree & Continue"
    },
    professionQuestions: {
        title: "About Your Work",
        subtitle: "A few questions about your profession will help us understand your situation better.",
        submitButton: "Continue to Next Step",
        "Small Farmer": {
            cropTypes: { label: "What are your primary crops?", placeholder: "e.g., Rice, Wheat", type: "text" },
            landSizeAcres: { label: "What is the size of your land (in acres)?", placeholder: "e.g., 5", type: "number" },
            hasWarehouseAccess: { label: "Do you have access to a warehouse for storage? Yes/No", type: "boolean" }
        },
        "Gig Worker": {
            primaryPlatform: { label: "Which platform do you primarily work with?", placeholder: "e.g., Ola, Uber, Swiggy", type: "text" },
            avgDailyEarnings: { label: "What are your average daily earnings (in ₹)?", placeholder: "e.g., 800", type: "number" },
            vehicleOwned: { label: "What type of vehicle do you own for work?", options: ['None', '2-Wheeler', '3-Wheeler', '4-Wheeler'], type: "select" }
        },
        "Kirana Shop Owner": {
            avgDailyFootfall: { label: "What is the average number of customers per day?", placeholder: "e.g., 50", type: "number" },
            inventoryValue: { label: "What is the approximate value of your current inventory (in ₹)?", placeholder: "e.g., 50000", type: "number" },
            usesDigitalPayments: { label: "Do you accept digital payments (like UPI, QR codes)? Yes/No", type: "boolean" }
        },
        "SHG Member": {
            groupName: { label: "What is the name of your Self-Help Group?", placeholder: "e.g., Pragati SHG", type: "text" },
            yearsInGroup: { label: "How many years have you been a member?", placeholder: "e.g., 3", type: "number" },
            groupActivity: { label: "What is the primary activity of your group?", placeholder: "e.g., Tailoring, Papad making", type: "text" }
        },
        "Micro-Entrepreneur": {
            businessType: { label: "What type of business do you run?", placeholder: "e.g., Food stall, Tailoring", type: "text" },
            yearsInBusiness: { label: "How many years have you been in this business?", placeholder: "e.g., 2", type: "number" },
            avgMonthlyProfit: { label: "What is your average monthly profit (in ₹)?", placeholder: "e.g., 10000", type: "number" }
        }
    },
    data: {
        title: "Share More Details (Optional)",
        subtitle: "We have the key details about your work. If there is anything else you'd like to share, you can do so here.",
        type: "Type",
        speak: "Speak",
        upload: "Upload",
        textareaPlaceholder: "Is there anything else you want to share? For example, details about other income, specific expenses, or future plans.",
        speakStart: "Click to start speaking.",
        speakStop: "Listening... Click to stop.",
        uploadTitle: "Upload Ledger/Document",
        uploadSubtitle: "Take a photo of your handwritten account book",
        optional: {
            title: "Strengthen Your Profile (Optional)",
            refNameLabel: "Community Reference Name",
            refNamePlaceholder: "e.g., Shopkeeper I buy from",
            refRelationLabel: "Relationship",
            refRelationPlaceholder: "e.g., Customer for 5 years",
            addDocsLabel: "Upload Additional Documents",
            clickToUpload: "Click to upload",
            dragAndDrop: "or drag and drop",
            fileTypes: "PNG, JPG, JPEG",
            docCategories: ["Identity", "Work", "Asset", "Other"],
            altDataLabel: "Connect Telecom/Utility Data",
            altDataTitle: "Provide Alternative Data (Optional)",
            simAge: "SIM Age (days)",
            avgRecharge: "Avg. Recharge (₹)",
            billsPaid: "Bills Paid (6 mo.)",
            tenure: "Tenure (months)"
        },
        analyzeButton: "Analyze & Continue"
    },
    clarification: {
        title: "Just a Few More Questions",
        subtitle: "Our AI needs a little more clarity on what you shared. Please answer the questions below.",
        submitButton: "Submit Answers"
    },
    psychometric: {
        title: "Almost Done!",
        subtitle: "These quick scenario questions help us understand your financial approach. There are no right or wrong answers.",
        completeButton: "Complete Application",
        skipButton: "Skip for now"
    },
    psychometricQuestions: {
        q1: { question: "An unexpected expense of ₹2000 comes up. What do you do?", options: ["Use emergency savings", "Borrow from a friend", "Reduce other spending this month"] },
        q2: { question: "You have a chance to invest a small amount in a friend's new business idea that could pay off well, but has some risk. What do you do?", options: ["Invest, the potential is worth the risk", "Decline, it's too risky right now", "Ask for more details before deciding"] },
        q3: { question: "A community member needs a small, urgent loan and asks you for help. You know they are reliable. What do you do?", options: ["Lend the money without hesitation", "Politely decline as you don't mix money and friends", "Lend a smaller amount than requested"] },
    },
    errors: {
        micPermission: "Microphone permission denied. Please allow access in your browser settings.",
        speechRecognition: "Speech recognition service error. Please try again.",
        noVoiceSupport: "Your browser does not support voice input.",
        ifsc: "Please enter a valid 11-character IFSC code.",
        emptyInput: "Input cannot be empty.",
        numbersOnly: "Please enter numbers only.",
        exactLength: "Please enter exactly {maxLength} digits.",
        invalidSelection: "Invalid selection.",
        voiceInput: "Voice input failed. Please try again.",
    },
    help: {
        title: "Onboarding Assistant",
        greeting: "Hello! How can I help you with the application form?",
        placeholder: "Type your question...",
        error: "Sorry, I couldn't get an answer right now. Please check our FAQ page."
    },
    docAnalysis: {
        title: "Document Analysis",
        alt: "Uploaded document preview",
        analyzing: "Analyzing document...",
        analysisError: "Analysis failed. Please try a clearer image.",
        ocrError: "Could not read text from the image.",
        imageUploaded: "Image uploaded",
        docCheck: "Authenticity Check",
        ledgerReading: "Ledger Reading (AI OCR)",
        loading: "Reading...",
        verifying: "Verifying...",
        verificationFailed: "Verification failed. Please try another document."
    },
    prefill: {
        farmer: { button: "Farmer", name: "Ramesh Kumar", profession: "Small Farmer", location: "Nalegaon, Maharashtra", pincode: "413521", incomeType: "Seasonal/Irregular", aadhaar: "123412341234", phone: "9876543210", bankAccountNumber: "112233445566", bankName: "State Bank of India", ifscCode: "SBIN0000300" },
        gig: { button: "Gig Worker", name: "Priya Singh", profession: "Gig Worker", location: "Bengaluru, Karnataka", pincode: "560001", incomeType: "Daily", aadhaar: "432143214321", phone: "9876543211", bankAccountNumber: "998877665544", bankName: "HDFC Bank", ifscCode: "HDFC0000001" },
    },
    otpMessage: "Your OTP is:",
    feedbackKeywords: {
        income: ["income", "earn", "salary", "profit"],
        expenses: ["rent", "food", "bills", "spend", "expense"],
        savings: ["save", "saving", "investment", "deposit"],
    },
    ussd: {
        welcome: "Welcome. Please enter your full name.",
        phone: "Enter your 10-digit phone number.",
        aadhaar: "Enter your 12-digit Aadhaar number.",
        profession: "Select your profession:",
        financialStatementOptional: "Would you like to share any extra financial details?\n1. Yes\n2. No",
        financialStatement: "Please describe your financial situation.",
        analyzing: "Analyzing your profile...",
        location: "Enter your location (City).",
        pincode: "Enter your 6-digit Pincode.",
        incomeType: "Select your income pattern:",
        bankName: "Enter your bank name.",
        accountNumber: "Enter your bank account number.",
        ifscCode: "Enter your bank's IFSC code.",
        simTenure: "How long have you used your SIM card?\n1. < 1 year\n2. 1-3 years\n3. > 3 years",
        utilityBills: "How many utility bills did you pay in the last 6 months?",
        mobilePayments: "Do you use mobile payments (like UPI)?\n1. Yes\n2. No",
        savingsHabit: "Do you have a regular savings habit?\n1. Yes\n2. No",
        hasReference: "Can you provide a community reference?\n1. Yes\n2. No",
        referenceName: "Enter reference's name.",
        referenceRelationship: "What is your relationship with them?",
        finalScoreMessage: "Thank you! Your final score is {score}.\n\nReply 1 to view your detailed report.",
        send: "Send",
        finish: "Finish",
        yes: "Yes",
        no: "No",
    }
};

const hiTranslations = {
    professions: ["छोटे किसान", "गिग वर्कर", "किराना दुकान के मालिक", "स्वयं सहायता समूह सदस्य", "सूक्ष्म उद्यमी"],
    incomeTypes: ["दैनिक", "साप्ताहिक", "मासिक", "मौसमी/अनियमित"],
    stepper: [
        { id: JourneyStep.INFO, name: "पहचान" },
        { id: JourneyStep.CONSENT, name: "सहमति" },
        { id: JourneyStep.PROFESSION_QUESTIONS, name: "कार्य विवरण" },
        { id: JourneyStep.DATA_INPUT, name: "अतिरिक्त जानकारी" },
        { id: JourneyStep.PSYCHOMETRIC, name: "समाप्त" }
    ],
    channel: {
        title: "अपना ऑनबोर्डिंग चैनल चुनें",
        subtitle: "हम आवेदन करने के कई तरीके प्रदान करते हैं, ताकि सभी के लिए पहुंच सुनिश्चित हो सके। वह तरीका चुनें जो आपके लिए सबसे अच्छा काम करे।",
        webapp: { title: "वेब ऐप", description: "पूरी तरह से विशेष, इंटरैक्टिव अनुभव। (आप यहाँ हैं)" },
        ussd: { title: "यूएसएसडी (टेक्स्ट-आधारित)", description: "किसी भी मोबाइल फोन पर काम करता है, इंटरनेट की आवश्यकता नहीं है।" },
        helpLink: "मुझे कौन सा चैनल चुनना चाहिए?",
        helpModal: {
            title: "सही चैनल चुनना",
            points: [
                { title: "वेब ऐप", description: "इंटरनेट वाले स्मार्टफोन के लिए सबसे अच्छा। दस्तावेज़ अपलोड करने और एक समृद्ध दृश्य अनुभव की अनुमति देता है।" },
                { title: "यूएसएसडी", description: "इसका उपयोग करें यदि आपके पास बिना इंटरनेट के एक बेसिक फोन ('फीचर फोन') है। आप अपने कीपैड का उपयोग करके बातचीत करेंगे।" }
            ],
            closeButton: "बंद करें"
        }
    },
    info: {
        title: "आपका स्वागत है! चलिए शुरू करते हैं।",
        subtitle: "आपका डेटा सुरक्षित है, एन्क्रिप्टेड है, और केवल आपकी सहमति से साझा किया जाता है।",
        secure: "🔒 सुरक्षित",
        compliant: "✔ आरबीआई-अनुपालक",
        multilingual: "🌐 बहुभाषी",
        fullNameLabel: "पूरा नाम",
        fullNamePlaceholder: "आधार/पैन के अनुसार",
        phoneLabel: "10-अंकीय फ़ोन नंबर",
        sendOtpButton: "ओटीपी भेजें",
        otpLabel: "6-अंकीय ओटीपी दर्ज करें",
        verifyButton: "सत्यापित करें",
        resendOtpTimer: "{otpTimer} सेकंड में ओटीपी फिर से भेजें",
        resendOtpLink: "ओटीपी फिर से भेजें",
        phoneVerified: "फ़ोन नंबर सत्यापित",
        aadhaarLabel: "पूरा 12-अंकीय आधार नंबर",
        aadhaarPlaceholder: "उदा., 123456789012",
        occupationLabel: "मुख्य व्यवसाय",
        selectOccupation: "अपना पेशा चुनें",
        locationLabel: "स्थान (शहर, राज्य)",
        locationPlaceholder: "उदा., पुणे, महाराष्ट्र",
        pincodeLabel: "पिनकोड",
        pincodePlaceholder: "उदा., 400001",
        incomePatternLabel: "आय पैटर्न",
        incomePatternTooltip: "आपको कितनी बार भुगतान मिलता है, यह हमें आपके नकदी प्रवाह को समझने में मदद करता है।",
        selectIncomePattern: "अपनी आय का पैटर्न चुनें",
        bankDetailsTitle: "बैंक खाते का विवरण",
        bankNameLabel: "बैंक का नाम",
        bankNamePlaceholder: "उदा., भारतीय स्टेट बैंक",
        accountNumberLabel: "खाता संख्या",
        accountNumberPlaceholder: "खाता संख्या दर्ज करें",
        ifscCodeLabel: "आईएफएससी कोड",
        ifscCodePlaceholder: "उदा., SBIN0001234",
        prefillLabel: "उदाहरण भरें:",
        needHelpLink: "मदद चाहिए?",
        continueButton: "➡ अगले चरण पर जारी रखें",
        stepDescription: "यह कदम हमें आपकी अनूठी वित्तीय प्रोफाइल बनाने में मदद करता है।"
    },
    consent: {
        title: "आपकी गोपनीयता महत्वपूर्ण है",
        subtitle: "हम आपके डेटा का सम्मान करते हैं। आप नियंत्रण में रहते हैं।",
        tag1: "एन्क्रिप्टेड डेटा",
        tag2: "आरबीआई के अनुरूप",
        tag3: "तीसरे पक्ष के साथ कोई साझाकरण नहीं",
        main: "आपके वित्तीय स्वास्थ्य का आकलन करने के लिए, हमारे एआई सिस्टम को आपके द्वारा प्रदान की गई जानकारी का विश्लेषण करने की आवश्यकता है। इसमें शामिल हैं:",
        points: [
            { text: "आप क्या करते हैं और कहाँ रहते हैं।", topic: "व्यवसाय और आय", ariaLabel: "हमें आपके व्यवसाय और स्थान की आवश्यकता क्यों है" },
            { text: "आप हमें जो पैसे की कहानी बताते हैं (पाठ, आवाज, या चित्र)।", topic: "वित्तीय कहानी", ariaLabel: "हमें आपकी वित्तीय कहानी की आवश्यकता क्यों है" },
            { text: "छोटे वित्तीय प्रश्नों के आपके उत्तर।", topic: "स्थिति संबंधी प्रश्न", ariaLabel: "हमें स्थितिजन्य प्रश्नों के आपके उत्तर की आवश्यकता क्यों है" },
            { text: "आपके द्वारा अपलोड किए गए कोई भी दस्तावेज़ (जैसे वर्क आईडी या संपत्ति की तस्वीरें)।", topic: "अपलोड किए गए दस्तावेज़", ariaLabel: "हमें आपके अपलोड किए गए दस्तावेज़ों की आवश्यकता क्यों है" }
        ],
        explanationTitle: "हम यह क्यों पूछते हैं",
        explanationLoading: "स्पष्टीकरण लोड हो रहा है...",
        explanationFallback: "हमें आपके वित्तीय स्वास्थ्य की एक पूरी और निष्पक्ष तस्वीर बनाने के लिए इस जानकारी की आवश्यकता है, जो हमें आपके लिए सर्वोत्तम विकल्प प्रदान करने में मदद करती है।",
        explanationGotIt: "समझ गया",
        checkboxLabel: "मैं सहमत हूं और अपनी सहमति देता हूं।",
        agreeButton: "सहमत हूँ और जारी रखें"
    },
    professionQuestions: {
        title: "आपके काम के बारे में",
        subtitle: "आपके पेशे के बारे में कुछ सवाल हमें आपकी स्थिति को बेहतर ढंग से समझने में मदद करेंगे।",
        submitButton: "अगले चरण पर जारी रखें",
        "Small Farmer": {
            cropTypes: { label: "आपकी मुख्य फसलें कौन सी हैं?", placeholder: "उदा., चावल, गेहूँ", type: "text" },
            landSizeAcres: { label: "आपकी भूमि का आकार (एकड़ में) क्या है?", placeholder: "उदा., 5", type: "number" },
            hasWarehouseAccess: { label: "क्या आपके पास भंडारण के लिए गोदाम की सुविधा है? हाँ/नहीं", type: "boolean" }
        },
        "Gig Worker": {
            primaryPlatform: { label: "आप मुख्य रूप से किस प्लेटफॉर्म के साथ काम करते हैं?", placeholder: "उदा., ओला, उबर, स्विगी", type: "text" },
            avgDailyEarnings: { label: "आपकी औसत दैनिक कमाई (₹ में) क्या है?", placeholder: "उदा., 800", type: "number" },
            vehicleOwned: { label: "काम के लिए आपके पास किस प्रकार का वाहन है?", options: ['कोई नहीं', '2-पहिया', '3-पहिया', '4-पहिया'], type: "select" }
        },
        "Kirana Shop Owner": {
            avgDailyFootfall: { label: "प्रति दिन ग्राहकों की औसत संख्या क्या है?", placeholder: "उदा., 50", type: "number" },
            inventoryValue: { label: "आपके वर्तमान स्टॉक का अनुमानित मूल्य (₹ में) क्या है?", placeholder: "उदा., 50000", type: "number" },
            usesDigitalPayments: { label: "क्या आप डिजिटल भुगतान (जैसे यूपीआई, क्यूआर कोड) स्वीकार करते हैं? हाँ/नहीं", type: "boolean" }
        },
        "SHG Member": {
            groupName: { label: "आपके स्वयं सहायता समूह का नाम क्या है?", placeholder: "उदा., प्रगति एसएचजी", type: "text" },
            yearsInGroup: { label: "आप कितने वर्षों से सदस्य हैं?", placeholder: "उदा., 3", type: "number" },
            groupActivity: { label: "आपके समूह की मुख्य गतिविधि क्या है?", placeholder: "उदा., सिलाई, पापड़ बनाना", type: "text" }
        },
        "Micro-Entrepreneur": {
            businessType: { label: "आप किस प्रकार का व्यवसाय चलाते हैं?", placeholder: "उदा., खाने का स्टॉल, सिलाई", type: "text" },
            yearsInBusiness: { label: "आप इस व्यवसाय में कितने वर्षों से हैं?", placeholder: "उदा., 2", type: "number" },
            avgMonthlyProfit: { label: "आपका औसत मासिक लाभ (₹ में) क्या है?", placeholder: "उदा., 10000", type: "number" }
        }
    },
    data: {
        title: "अधिक विवरण साझा करें (वैकल्पिक)",
        subtitle: "हमारे पास आपके काम के बारे में मुख्य विवरण हैं। यदि आप कुछ और साझा करना चाहते हैं, तो आप यहां कर सकते हैं।",
        type: "टाइप करें",
        speak: "बोलें",
        upload: "अपलोड करें",
        textareaPlaceholder: "क्या आप कुछ और साझा करना चाहते हैं? उदाहरण के लिए, अन्य आय, विशिष्ट खर्च, या भविष्य की योजनाओं के बारे में विवरण।",
        speakStart: "बोलना शुरू करने के लिए क्लिक करें।",
        speakStop: "सुन रहा है... रोकने के लिए क्लिक करें।",
        uploadTitle: "बही/दस्तावेज़ अपलोड करें",
        uploadSubtitle: "अपने हस्तलिखित खाते की बही की एक तस्वीर लें",
        optional: {
            title: "अपनी प्रोफ़ाइल को मजबूत करें (वैकल्पिक)",
            refNameLabel: "सामुदायिक संदर्भ नाम",
            refNamePlaceholder: "उदा., दुकानदार जिससे मैं खरीदता हूँ",
            refRelationLabel: "रिश्ता",
            refRelationPlaceholder: "उदा., 5 साल से ग्राहक",
            addDocsLabel: "अतिरिक्त दस्तावेज़ अपलोड करें",
            clickToUpload: "अपलोड करने के लिए क्लिक करें",
            dragAndDrop: "या खींचें और छोड़ें",
            fileTypes: "पीएनजी, जेपीजी, जेपीईजी",
            docCategories: ["पहचान", "कार्य", "संपत्ति", "अन्य"],
            altDataLabel: "टेलीकॉम/यूटिलिटी डेटा कनेक्ट करें",
            altDataTitle: "वैकल्पिक डेटा प्रदान करें (वैकल्पिक)",
            simAge: "सिम आयु (दिन)",
            avgRecharge: "औसत रिचार्ज (₹)",
            billsPaid: "बिल भुगतान (6 महीने)",
            tenure: "कार्यकाल (महीने)"
        },
        analyzeButton: "विश्लेषण करें और जारी रखें"
    },
    clarification: {
        title: "बस कुछ और सवाल",
        subtitle: "हमारे एआई को आपके द्वारा साझा की गई बातों पर थोड़ी और स्पष्टता चाहिए। कृपया नीचे दिए गए प्रश्नों के उत्तर दें।",
        submitButton: "उत्तर जमा करें"
    },
    psychometric: {
        title: "लगभग पूरा हो गया!",
        subtitle: "ये त्वरित परिदृश्य प्रश्न हमें आपके वित्तीय दृष्टिकोण को समझने में मदद करते हैं। कोई सही या गलत उत्तर नहीं हैं।",
        completeButton: "आवेदन पूरा करें",
        skipButton: "अभी के लिए छोड़ें"
    },
    psychometricQuestions: {
        q1: { question: "₹2000 का एक अप्रत्याक्षित खर्च आता है। आप क्या करते हैं?", options: ["आपातकालीन बचत का उपयोग करें", "एक दोस्त से उधार लें", "इस महीने अन्य खर्च कम करें"] },
        q2: { question: "आपके पास एक दोस्त के नए व्यावसायिक विचार में थोड़ी राशि निवेश करने का मौका है जो अच्छा लाभ दे सकता है, लेकिन इसमें कुछ जोखिम है। आप क्या करते हैं?", options: ["निवेश करें, क्षमता जोखिम के लायक है", "मना कर दें, यह अभी बहुत जोखिम भरा है", "निर्णय लेने से पहले और विवरण मांगें"] },
        q3: { question: "समुदाय के एक सदस्य को एक छोटे, तत्काल ऋण की आवश्यकता है और वह आपसे मदद मांगता है। आप जानते हैं कि वे विश्वसनीय हैं। आप क्या करते हैं?", options: ["बिना किसी हिचकिचाहट के पैसे उधार दें", "विनम्रता से मना कर दें क्योंकि आप पैसे और दोस्तों को नहीं मिलाते", "अनुरोध से कम राशि उधार दें"] },
    },
    errors: {
        micPermission: "माइक्रोफ़ोन की अनुमति नहीं दी गई। कृपया अपनी ब्राउज़र सेटिंग्स में पहुँच की अनुमति दें।",
        speechRecognition: "वाक् पहचान सेवा में त्रुटि। कृपया पुनः प्रयास करें।",
        noVoiceSupport: "आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है।",
        ifsc: "कृपया एक मान्य 11-वर्णों का आईएफएससी कोड दर्ज करें।",
        emptyInput: "इनपुट खाली नहीं हो सकता।",
        numbersOnly: "कृपया केवल नंबर दर्ज करें।",
        exactLength: "कृपया ठीक {maxLength} अंक दर्ज करें।",
        invalidSelection: "अमान्य चयन।",
        voiceInput: "वॉयस इनपुट विफल। कृपया पुनः प्रयास करें।",
    },
    help: {
        title: "ऑनबोर्डिंग सहायक",
        greeting: "नमस्ते! मैं आवेदन पत्र के साथ आपकी कैसे मदद कर सकता हूँ?",
        placeholder: "अपना प्रश्न टाइप करें...",
        error: "क्षमा करें, मैं अभी उत्तर नहीं दे सका। कृपया हमारे अक्सर पूछे जाने वाले प्रश्न पृष्ठ की जाँच करें।"
    },
    docAnalysis: {
        title: "दस्तावेज़ विश्लेषण",
        alt: "अपलोड किए गए दस्तावेज़ का पूर्वावलोकन",
        analyzing: "दस्तावेज़ का विश्लेषण किया जा रहा है...",
        analysisError: "विश्लेषण विफल। कृपया एक स्पष्ट छवि का प्रयास करें।",
        ocrError: "छवि से पाठ नहीं पढ़ा जा सका।",
        imageUploaded: "छवि अपलोड की गई",
        docCheck: "प्रामाणिकता जांच",
        ledgerReading: "बही पढ़ना (एआई ओसीआर)",
        loading: "पढ़ रहा है...",
        verifying: "सत्यापित हो रहा है...",
        verificationFailed: "सत्यापन विफल। कृपया दूसरा दस्तावेज़ आज़माएँ।"
    },
    prefill: {
        farmer: { button: "किसान", name: "रमेश कुमार", profession: "छोटे किसान", location: "नालेगांव, महाराष्ट्र", pincode: "413521", incomeType: "मौसमी/अनियमित", aadhaar: "123412341234", phone: "9876543210", bankAccountNumber: "112233445566", bankName: "भारतीय स्टेट बैंक", ifscCode: "SBIN0000300" },
        gig: { button: "गिग वर्कर", name: "प्रिया सिंह", profession: "गिग वर्कर", location: "बेंगलुरु, कर्नाटक", pincode: "560001", incomeType: "दैनिक", aadhaar: "432143214321", phone: "9876543211", bankAccountNumber: "998877665544", bankName: "एचडीएफसी बैंक", ifscCode: "HDFC0000001" },
    },
    otpMessage: "आपका ओटीपी है:",
    feedbackKeywords: {
        income: ["आय", "कमाई", "वेतन", "लाभ"],
        expenses: ["किराया", "भोजन", "बिल", "खर्च"],
        savings: ["बचत", "निवेश", "जमा"],
    },
    ussd: {
        welcome: "आपका स्वागत है। कृपया अपना पूरा नाम दर्ज करें।",
        phone: "अपना 10-अंकीय फ़ोन नंबर दर्ज करें।",
        aadhaar: "अपना 12 अंकों का आधार नंबर दर्ज करें।",
        profession: "अपना पेशा चुनें:",
        financialStatementOptional: "क्या आप कोई अतिरिक्त वित्तीय विवरण साझा करना चाहेंगे?\n1. हाँ\n2. नहीं",
        financialStatement: "कृपया अपनी वित्तीय स्थिति का वर्णन करें।",
        analyzing: "आपकी प्रोफ़ाइल का विश्लेषण हो रहा है...",
        location: "अपना स्थान (शहर) दर्ज करें।",
        pincode: "अपना 6 अंकों का पिनकोड दर्ज करें।",
        incomeType: "अपनी आय का पैटर्न चुनें:",
        bankName: "अपने बैंक का नाम दर्ज करें।",
        accountNumber: "अपना बैंक खाता नंबर दर्ज करें।",
        ifscCode: "अपने बैंक का आईएफएससी कोड दर्ज करें।",
        simTenure: "आप अपने सिम कार्ड का उपयोग कितने समय से कर रहे हैं?\n1. < 1 वर्ष\n2. 1-3 वर्ष\n3. > 3 वर्ष",
        utilityBills: "आपने पिछले 6 महीनों में कितने उपयोगिता बिलों का भुगतान किया है?",
        mobilePayments: "क्या आप मोबाइल भुगतान (जैसे यूपीआई) का उपयोग करते हैं?\n1. हाँ\n2. नहीं",
        savingsHabit: "क्या आपकी नियमित बचत की आदत है?\n1. हाँ\n2. नहीं",
        hasReference: "क्या आप एक सामुदायिक संदर्भ प्रदान कर सकते हैं?\n1. हाँ\n2. नहीं",
        referenceName: "संदर्भ का नाम दर्ज करें।",
        referenceRelationship: "उनके साथ आपका क्या रिश्ता है?",
        finalScoreMessage: "धन्यवाद! आपका अंतिम स्कोर {score} है।\n\nअपनी विस्तृत रिपोर्ट देखने के लिए 1 उत्तर दें।",
        send: "भेजें",
        finish: "समाप्त",
        yes: "हाँ",
        no: "नहीं",
    }
};

const taTranslations = {
    professions: ["சிறு விவசாயி", "கிக் பணியாளர்", "கிரானா கடை உரிமையாளர்", "சுய உதவிக் குழு உறுப்பினர்", "சிறு தொழில்முனைவோர்"],
    incomeTypes: ["தினசரி", "வாராந்திர", "மாதாந்திர", "பருவகால/ஒழுங்கற்ற"],
    stepper: [
        { id: JourneyStep.INFO, name: "அடையாளம்" },
        { id: JourneyStep.CONSENT, name: "ஒப்புதல்" },
        { id: JourneyStep.PROFESSION_QUESTIONS, name: "பணி விவரங்கள்" },
        { id: JourneyStep.DATA_INPUT, name: "கூடுதல் தகவல்" },
        { id: JourneyStep.PSYCHOMETRIC, name: "முடிக்க" }
    ],
    channel: {
        title: "உங்கள் உள்நுழைவு வழியைத் தேர்ந்தெடுக்கவும்",
        subtitle: "அனைவருக்கும் அணுகலை உறுதிசெய்ய, நாங்கள் விண்ணப்பிக்க பல வழிகளை வழங்குகிறோம். உங்களுக்கு மிகவும் பொருத்தமான முறையைத் தேர்ந்தெடுக்கவும்.",
        webapp: { title: "இணைய செயலி", description: "முழுமையான அம்சங்கள், ஊடாடும் அனுபவம். (நீங்கள் இங்கே இருக்கிறீர்கள்)" },
        ussd: { title: "USSD (உரை அடிப்படையிலானது)", description: "எந்த மொபைல் போனிலும் வேலை செய்யும், இணையம் தேவையில்லை." },
        helpLink: "நான் எந்த வழியைத் தேர்ந்தெடுக்க வேண்டும்?",
        helpModal: {
            title: "சரியான வழியைத் தேர்ந்தெடுப்பது",
            points: [
                { title: "இணைய செயலி", description: "இணையத்துடன் கூடிய ஸ்மார்ட்போன்களுக்கு சிறந்தது. ஆவணங்களைப் பதிவேற்ற மற்றும் ஒரு சிறந்த காட்சி அனுபவத்தை அனுமதிக்கிறது." },
                { title: "USSD", description: "இணையம் இல்லாத அடிப்படை தொலைபேசி ('ஃபீச்சர் போன்') உங்களிடம் இருந்தால் இதைப் பயன்படுத்தவும். உங்கள் விசைப்பலகையைப் பயன்படுத்தி நீங்கள் தொடர்புகொள்வீர்கள்." }
            ],
            closeButton: "மூடுக"
        }
    },
    info: {
        title: "வாருங்கள்! ஆரம்பிக்கலாம்.",
        subtitle: "உங்கள் தரவு பாதுகாப்பானது, குறியாக்கம் செய்யப்பட்டது, உங்கள் அனுமதியுடன் மட்டுமே பகிரப்படும்.",
        secure: "🔒 பாதுகாப்பானது",
        compliant: "✔ RBI-இணக்கமானது",
        multilingual: "🌐 பன்மொழி",
        fullNameLabel: "முழுப் பெயர்",
        fullNamePlaceholder: "ஆதார்/பான் படி",
        phoneLabel: "10-இலக்க தொலைபேசி எண்",
        sendOtpButton: "OTP அனுப்பு",
        otpLabel: "6-இலக்க OTP ஐ உள்ளிடவும்",
        verifyButton: "சரிபார்க்கவும்",
        resendOtpTimer: "{otpTimer} வினாடிகளில் OTP ஐ மீண்டும் அனுப்பவும்",
        resendOtpLink: "OTP ஐ மீண்டும் அனுப்பவும்",
        phoneVerified: "தொலைபேசி எண் சரிபார்க்கப்பட்டது",
        aadhaarLabel: "முழு 12-இலக்க ஆதார் எண்",
        aadhaarPlaceholder: "எ.கா., 123456789012",
        occupationLabel: "முக்கிய தொழில்",
        selectOccupation: "உங்கள் தொழிலைத் தேர்ந்தெடுக்கவும்",
        locationLabel: "இடம் (நகரம், மாநிலம்)",
        locationPlaceholder: "எ.கா., புனே, மகாராஷ்டிரா",
        pincodeLabel: "பின்கோடு",
        pincodePlaceholder: "எ.கா., 400001",
        incomePatternLabel: "வருமான முறை",
        incomePatternTooltip: "நீங்கள் எவ்வளவு அடிக்கடி பணம் பெறுகிறீர்கள் என்பது உங்கள் பணப்புழக்கத்தைப் புரிந்துகொள்ள உதவுகிறது.",
        selectIncomePattern: "உங்கள் வருமான முறையைத் தேர்ந்தெடுக்கவும்",
        bankDetailsTitle: "வங்கி கணக்கு விவரங்கள்",
        bankNameLabel: "வங்கியின் பெயர்",
        bankNamePlaceholder: "எ.கா., பாரத ஸ்டேட் வங்கி",
        accountNumberLabel: "கணக்கு எண்",
        accountNumberPlaceholder: "கணக்கு எண்ணை உள்ளிடவும்",
        ifscCodeLabel: "IFSC குறியீடு",
        ifscCodePlaceholder: "எ.கா., SBIN0001234",
        prefillLabel: "உதாரணத்தை நிரப்ப:",
        needHelpLink: "உதவி வேண்டுமா?",
        continueButton: "➡ அடுத்த கட்டத்திற்கு தொடரவும்",
        stepDescription: "இந்த படி உங்கள் தனிப்பட்ட நிதி சுயவிவரத்தை உருவாக்க உதவுகிறது."
    },
    consent: {
        title: "உங்கள் தனியுரிமை முக்கியமானது",
        subtitle: "நாங்கள் உங்கள் தரவை மதிக்கிறோம். நீங்கள் கட்டுப்பாட்டில் இருக்கிறீர்கள்.",
        tag1: "குறியாக்கப்பட்ட தரவு",
        tag2: "RBI உடன் இணக்கமானது",
        tag3: "மூன்றாம் தரப்பினருடன் பகிரப்படாது",
        main: "உங்கள் நிதி ஆரோக்கியத்தை மதிப்பிடுவதற்கு, எங்கள் AI அமைப்பு நீங்கள் வழங்கும் தகவல்களை பகுப்பாய்வு செய்ய வேண்டும். இதில் அடங்குபவை:",
        points: [
            { text: "நீங்கள் என்ன செய்கிறீர்கள், எங்கே வாழ்கிறீர்கள்.", topic: "தொழில் மற்றும் வருமானம்", ariaLabel: "உங்கள் தொழில் மற்றும் இருப்பிடம் எங்களுக்கு ஏன் தேவை?" },
            { text: "நீங்கள் எங்களிடம் கூறும் பணக் கதை (உரை, குரல், அல்லது படம்).", topic: "நிதிக் கதை", ariaLabel: "உங்கள் நிதிக் கதை எங்களுக்கு ஏன் தேவை?" },
            { text: "சிறிய நிதி கேள்விகளுக்கு உங்கள் பதில்கள்.", topic: "சூழ்நிலை கேள்விகள்", ariaLabel: "சூழ்நிலை கேள்விகளுக்கான உங்கள் பதில்கள் எங்களுக்கு ஏன் தேவை?" },
            { text: "நீங்கள் பதிவேற்றும் எந்த ஆவணங்களும் (வேலை அடையாள அட்டைகள் அல்லது சொத்து புகைப்படங்கள் போன்றவை).", topic: "பதிவேற்றப்பட்ட ஆவணங்கள்", ariaLabel: "நீங்கள் பதிவேற்றும் ஆவணங்கள் எங்களுக்கு ஏன் தேவை?" }
        ],
        explanationTitle: "நாங்கள் இதைக் கேட்பதற்கான காரணம்",
        explanationLoading: "விளக்கம் ஏற்றப்படுகிறது...",
        explanationFallback: "உங்கள் நிதி ஆரோக்கியத்தைப் பற்றிய முழுமையான மற்றும் நியாயமான சித்திரத்தை உருவாக்க எங்களுக்கு இந்தத் தகவல் தேவை, இது உங்களுக்கு சிறந்த விருப்பங்களை வழங்க எங்களுக்கு உதவுகிறது.",
        explanationGotIt: "புரிந்தது",
        checkboxLabel: "நான் ஒப்புக்கொள்கிறேன் மற்றும் என் சம்மதத்தை அளிக்கிறேன்.",
        agreeButton: "ஒப்புக்கொண்டு தொடரவும்"
    },
    professionQuestions: {
        title: "உங்கள் வேலையைப் பற்றி",
        subtitle: "உங்கள் தொழிலைப் பற்றிய சில கேள்விகள் உங்கள் நிலையை நன்கு புரிந்துகொள்ள உதவும்.",
        submitButton: "அடுத்த கட்டத்திற்கு தொடரவும்",
        "Small Farmer": {
            cropTypes: { label: "உங்கள் முதன்மை பயிர்கள் யாவை?", placeholder: "எ.கா., அரிசி, கோதுமை", type: "text" },
            landSizeAcres: { label: "உங்கள் நிலத்தின் அளவு (ஏக்கரில்) என்ன?", placeholder: "எ.கா., 5", type: "number" },
            hasWarehouseAccess: { label: "சேமிப்பிற்காக கிடங்கு வசதி உங்களுக்கு உள்ளதா? ஆம்/இல்லை", type: "boolean" }
        },
        "Gig Worker": {
            primaryPlatform: { label: "நீங்கள் முதன்மையாக எந்த தளத்துடன் வேலை செய்கிறீர்கள்?", placeholder: "எ.கா., ஓலா, உபேர், ஸ்விக்கி", type: "text" },
            avgDailyEarnings: { label: "உங்கள் சராசரி தினசரி வருவாய் (₹-ல்) என்ன?", placeholder: "எ.கா., 800", type: "number" },
            vehicleOwned: { label: "வேலைக்கு நீங்கள் எந்த வகை வாகனத்தை வைத்திருக்கிறீர்கள்?", options: ['ஏதுமில்லை', '2-சக்கர வாகனம்', '3-சக்கர வாகனம்', '4-சக்கர வாகனம்'], type: "select" }
        },
        "Kirana Shop Owner": {
            avgDailyFootfall: { label: "ஒரு நாளைக்கு சராசரியாக எத்தனை வாடிக்கையாளர்கள் வருகிறார்கள்?", placeholder: "எ.கா., 50", type: "number" },
            inventoryValue: { label: "உங்கள் தற்போதைய சரக்குகளின் தோராயமான மதிப்பு (₹-ல்) என்ன?", placeholder: "எ.கா., 50000", type: "number" },
            usesDigitalPayments: { label: "நீங்கள் டிஜிட்டல் முறைகளில் (UPI, QR குறியீடுகள் போன்றவை) பணம் ஏற்கிறீர்களா? ஆம்/இல்லை", type: "boolean" }
        },
        "SHG Member": {
            groupName: { label: "உங்கள் சுய உதவிக் குழுவின் பெயர் என்ன?", placeholder: "எ.கா., பிரகதி மகளிர் சுய உதவிக் குழு", type: "text" },
            yearsInGroup: { label: "நீங்கள் எத்தனை ஆண்டுகளாக உறுப்பினராக உள்ளீர்கள்?", placeholder: "எ.கா., 3", type: "number" },
            groupActivity: { label: "உங்கள் குழுவின் முதன்மை செயல்பாடு என்ன?", placeholder: "எ.கா., தையல், அப்பளம் தயாரித்தல்", type: "text" }
        },
        "Micro-Entrepreneur": {
            businessType: { label: "நீங்கள் என்ன வகையான தொழில் நடத்துகிறீர்கள்?", placeholder: "எ.கா., உணவுக் கடை, தையல்", type: "text" },
            yearsInBusiness: { label: "இந்தத் தொழிலில் நீங்கள் எத்தனை ஆண்டுகளாக உள்ளீர்கள்?", placeholder: "எ.கா., 2", type: "number" },
            avgMonthlyProfit: { label: "உங்கள் சராசரி மாத லாபம் (₹-ல்) என்ன?", placeholder: "எ.கா., 10000", type: "number" }
        }
    },
    data: {
        title: "மேலும் விவரங்களைப் பகிரவும் (விருப்பத்தேர்வு)",
        subtitle: "உங்கள் வேலையைப் பற்றிய முக்கிய விவரங்கள் எங்களிடம் உள்ளன. வேறு எதையாவது பகிர்ந்து கொள்ள விரும்பினால், இங்கே செய்யலாம்.",
        type: "தட்டச்சு",
        speak: "பேசுக",
        upload: "பதிவேற்று",
        textareaPlaceholder: "வேறு ஏதாவது பகிர விரும்புகிறீர்களா? உதாரணமாக, மற்ற வருமானம், குறிப்பிட்ட செலவுகள், அல்லது எதிர்கால திட்டங்கள் பற்றிய விவரங்கள்.",
        speakStart: "பேசத் தொடங்க கிளிக் செய்யவும்.",
        speakStop: "கேட்கிறது... நிறுத்த கிளிக் செய்யவும்.",
        uploadTitle: "கணக்கு புத்தகம்/ஆவணத்தை பதிவேற்றவும்",
        uploadSubtitle: "உங்கள் கையால் எழுதப்பட்ட கணக்கு புத்தகத்தின் புகைப்படத்தை எடுக்கவும்",
        optional: {
            title: "உங்கள் சுயவிவரத்தை வலுப்படுத்தவும் (விருப்பத்தேர்வு)",
            refNameLabel: "சமூகப் பரிந்துரையாளர் பெயர்",
            refNamePlaceholder: "எ.கா., நான் வாங்கும் கடைக்காரர்",
            refRelationLabel: "உறவுமுறை",
            refRelationPlaceholder: "எ.கா., 5 ஆண்டுகளாக வாடிக்கையாளர்",
            addDocsLabel: "கூடுதல் ஆவணங்களைப் பதிவேற்றவும்",
            clickToUpload: "பதிவேற்ற கிளிக் செய்யவும்",
            dragAndDrop: "அல்லது இழுத்து விடவும்",
            fileTypes: "PNG, JPG, JPEG",
            docCategories: ["அடையாளம்", "வேலை", "சொத்து", "மற்றவை"],
            altDataLabel: "தொலைத்தொடர்பு/பயன்பாட்டுத் தரவை இணைக்கவும்",
            altDataTitle: "மாற்றுத் தரவை வழங்கவும் (விருப்பத்தேர்வு)",
            simAge: "சிம் வயது (நாட்கள்)",
            avgRecharge: "சராசரி ரீசார்ஜ் (₹)",
            billsPaid: "கட்டணங்கள் செலுத்தியது (6 மாதம்)",
            tenure: "பதவிக்காலம் (மாதங்கள்)"
        },
        analyzeButton: "பகுப்பாய்வு செய்து தொடரவும்"
    },
    clarification: {
        title: "இன்னும் சில கேள்விகள்",
        subtitle: "நீங்கள் பகிர்ந்தவற்றில் எங்கள் AI-க்கு இன்னும் கொஞ்சம் தெளிவு தேவை. கீழே உள்ள கேள்விகளுக்கு பதிலளிக்கவும்.",
        submitButton: "பதில்களைச் சமர்ப்பிக்கவும்"
    },
    psychometric: {
        title: "கிட்டத்தட்ட முடிந்தது!",
        subtitle: "இந்த விரைவான சூழ்நிலைக் கேள்விகள் உங்கள் நிதி அணுகுமுறையைப் புரிந்துகொள்ள எங்களுக்கு உதவுகின்றன. சரியான அல்லது தவறான பதில்கள் எதுவும் இல்லை.",
        completeButton: "விண்ணப்பத்தை முடிக்கவும்",
        skipButton: "இப்போதைக்கு தவிர்"
    },
    psychometricQuestions: {
        q1: { question: "₹2000-க்கு எதிர்பாராத செலவு ஏற்படுகிறது. நீங்கள் என்ன செய்வீர்கள்?", options: ["அவசரகால சேமிப்பைப் பயன்படுத்துவேன்", "நண்பரிடம் கடன் வாங்குவேன்", "இந்த மாதம் மற்ற செலவுகளைக் குறைப்பேன்"] },
        q2: { question: "ஒரு நண்பரின் புதிய வணிக யோசனையில் ஒரு சிறிய தொகையை முதலீடு செய்ய உங்களுக்கு வாய்ப்பு கிடைக்கிறது, அது நல்ல லாபம் தரக்கூடும், ஆனால் சில அபாயங்கள் உள்ளன. நீங்கள் என்ன செய்வீர்கள்?", options: ["முதலீடு செய்வேன், சாத்தியக்கூறு அபாயத்திற்கு மதிப்புள்ளது", "நிராகரிப்பேன், இப்போது அது மிகவும் அபாயகரமானது", "முடிவெடுப்பதற்கு முன் மேலும் விவரங்களைக் கேட்பேன்"] },
        q3: { question: "சமூகத்தைச் சேர்ந்த ஒருவருக்கு ஒரு சிறிய, அவசரக் கடன் தேவைப்படுகிறது மற்றும் உங்களிடம் உதவி கேட்கிறார். அவர் நம்பகமானவர் என்று உங்களுக்குத் தெரியும். நீங்கள் என்ன செய்வீர்கள்?", options: ["தயக்கமின்றி பணத்தைக் கடன் கொடுப்பேன்", "பணம் மற்றும் நண்பர்களைக் கலக்காததால் höflich மறுப்பேன்", "கேட்டதை விட சிறிய தொகையைக் கடன் கொடுப்பேன்"] },
    },
    errors: {
        micPermission: "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உங்கள் உலாவி அமைப்புகளில் அணுகலை அனுமதிக்கவும்.",
        speechRecognition: "பேச்சு அங்கீகார சேவையில் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        noVoiceSupport: "உங்கள் உலாவி குரல் உள்ளீட்டை ஆதரிக்கவில்லை.",
        ifsc: "தயவுசெய்து சரியான 11-எழுத்து IFSC குறியீட்டை உள்ளிடவும்.",
        emptyInput: "உள்ளீடு காலியாக இருக்க முடியாது.",
        numbersOnly: "தயவுசெய்து எண்களை மட்டுமே உள்ளிடவும்.",
        exactLength: "தயவுசெய்து சரியாக {maxLength} இலக்கங்களை உள்ளிடவும்.",
        invalidSelection: "தவறான தேர்வு.",
        voiceInput: "குரல் உள்ளீடு தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    },
    help: {
        title: "உள்நுழைவு உதவியாளர்",
        greeting: "வணக்கம்! விண்ணப்பப் படிவத்தில் நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        placeholder: "உங்கள் கேள்வியைத் தட்டச்சு செய்க...",
        error: "மன்னிக்கவும், என்னால் இப்போது ஒரு பதிலைப் பெற முடியவில்லை. தயவுசெய்து எங்கள் FAQ பக்கத்தைப் பார்க்கவும்."
    },
    docAnalysis: {
        title: "ஆவணப் பகுப்பாய்வு",
        alt: "பதிவேற்றப்பட்ட ஆவணத்தின் முன்னோட்டம்",
        analyzing: "ஆவணத்தைப் பகுப்பாய்வு செய்கிறது...",
        analysisError: "பகுப்பாய்வு தோல்வியடைந்தது. தெளிவான படத்தை முயற்சிக்கவும்.",
        ocrError: "படத்திலிருந்து உரையைப் படிக்க முடியவில்லை.",
        imageUploaded: "படம் பதிவேற்றப்பட்டது",
        docCheck: " நம்பகத்தன்மை சோதனை",
        ledgerReading: "கணக்குப் புத்தக வாசிப்பு (AI OCR)",
        loading: "படிக்கிறது...",
        verifying: "சரிபார்க்கிறது...",
        verificationFailed: "சரிபார்ப்பு தோல்வியடைந்தது. மற்றொரு ஆவணத்தை முயற்சிக்கவும்."
    },
    prefill: {
        farmer: { button: "விவசாயி", name: "ரமேஷ் குமார்", profession: "சிறு விவசாயி", location: "நலேகான், மகாராஷ்டிரா", pincode: "413521", incomeType: "பருவகால/ஒழுங்கற்ற", aadhaar: "123412341234", phone: "9876543210", bankAccountNumber: "112233445566", bankName: "பாரத ஸ்டேட் வங்கி", ifscCode: "SBIN0000300" },
        gig: { button: "கிக் பணியாளர்", name: "பிரியா சிங்", profession: "கிக் பணியாளர்", location: "பெங்களூரு, கர்நாடகா", pincode: "560001", incomeType: "தினசரி", aadhaar: "432143214321", phone: "9876543211", bankAccountNumber: "998877665544", bankName: "HDFC வங்கி", ifscCode: "HDFC0000001" },
    },
    otpMessage: "உங்கள் OTP:",
    feedbackKeywords: {
        income: ["வருமானம்", "சம்பாதிக்க", "சம்பளம்", "லாபம்"],
        expenses: ["வாடகை", "உணவு", "கட்டணங்கள்", "செலவு"],
        savings: ["சேமிக்க", "சேமிப்பு", "முதலீடு", "வைப்பு"],
    },
    ussd: {
        welcome: "வாருங்கள். உங்கள் முழுப் பெயரை உள்ளிடவும்.",
        phone: "உங்கள் 10-இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.",
        aadhaar: "உங்கள் 12-இலக்க ஆதார் எண்ணை உள்ளிடவும்.",
        profession: "உங்கள் தொழிலைத் தேர்ந்தெடுக்கவும்:",
        financialStatementOptional: "கூடுதல் நிதி விவரங்களைப் பகிர விரும்புகிறீர்களா?\n1. ஆம்\n2. இல்லை",
        financialStatement: "உங்கள் நிதி நிலையை விவரிக்கவும்.",
        analyzing: "உங்கள் சுயவிவரத்தை பகுப்பாய்வு செய்கிறது...",
        location: "உங்கள் இருப்பிடத்தை (நகரம்) உள்ளிடவும்.",
        pincode: "உங்கள் 6-இலக்க பின்கோடை உள்ளிடவும்.",
        incomeType: "உங்கள் வருமான முறையைத் தேர்ந்தெடுக்கவும்:",
        bankName: "உங்கள் வங்கியின் பெயரை உள்ளிடவும்.",
        accountNumber: "உங்கள் வங்கிக் கணக்கு எண்ணை உள்ளிடவும்.",
        ifscCode: "உங்கள் வங்கியின் IFSC குறியீட்டை உள்ளிடவும்.",
        simTenure: "உங்கள் சிம் கார்டை எவ்வளவு காலமாகப் பயன்படுத்துகிறீர்கள்?\n1. < 1 ஆண்டு\n2. 1-3 ஆண்டுகள்\n3. > 3 ஆண்டுகள்",
        utilityBills: "கடந்த 6 மாதங்களில் எத்தனை பயன்பாட்டுக் கட்டணங்களைச் செலுத்தியுள்ளீர்கள்?",
        mobilePayments: "மொபைல் பேமெண்ட்களை (UPI போன்றவை) பயன்படுத்துகிறீர்களா?\n1. ஆம்\n2. இல்லை",
        savingsHabit: "உங்களுக்கு வழக்கமான சேமிப்புப் பழக்கம் உள்ளதா?\n1. ஆம்\n2. இல்லை",
        hasReference: "சமூகப் பரிந்துரையாளரை வழங்க முடியுமா?\n1. ஆம்\n2. இல்லை",
        referenceName: "பரிந்துரையாளரின் பெயரை உள்ளிடவும்.",
        referenceRelationship: "அவருடன் உங்கள் உறவு என்ன?",
        finalScoreMessage: "நன்றி! உங்கள் இறுதி மதிப்பெண் {score}.\n\nஉங்கள் விரிவான அறிக்கையைப் பார்க்க 1 ஐப் பதிலளிக்கவும்.",
        send: "அனுப்பு",
        finish: "முடிக்க",
        yes: "ஆம்",
        no: "இல்லை",
    }
};

const knTranslations = {
    professions: ["ಸಣ್ಣ ರೈತ", "ಗುತ್ತಿಗೆ ಕೆಲಸಗಾರ", "ಕಿರಾಣಿ ಅಂಗಡಿ ಮಾಲೀಕ", "ಸ್ವಸಹಾಯ ಸಂಘದ ಸದಸ್ಯ", "ಕಿರು ಉದ್ಯಮಿ"],
    incomeTypes: ["ದೈನಂದಿನ", "ವಾರಕ್ಕೊಮ್ಮೆ", "ಮಾಸಿಕ", "ಋತುಮಾನ/ಅನಿಯಮಿತ"],
    stepper: [
        { id: JourneyStep.INFO, name: "ಗುರುತು" },
        { id: JourneyStep.CONSENT, name: "ಒಪ್ಪಿಗೆ" },
        { id: JourneyStep.PROFESSION_QUESTIONS, name: "ಕೆಲಸದ ವಿವರಗಳು" },
        { id: JourneyStep.DATA_INPUT, name: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ" },
        { id: JourneyStep.PSYCHOMETRIC, name: "ಮುಕ್ತಾಯ" }
    ],
    channel: {
        title: "ನಿಮ್ಮ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಚಾನೆಲ್ ಆಯ್ಕೆಮಾಡಿ",
        subtitle: "ನಾವು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಹಲವು ಮಾರ್ಗಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ, ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಪ್ರವೇಶವನ್ನು ಖಚಿತಪಡಿಸುತ್ತೇವೆ. ನಿಮಗೆ ಉತ್ತಮವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
        webapp: { title: "ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್", description: "ಪೂರ್ಣ-ವೈಶಿಷ್ಟ್ಯಪೂರ್ಣ, ಸಂವಾದಾತ್ಮಕ ಅನುಭವ. (ನೀವು ಇಲ್ಲಿದ್ದೀರಿ)" },
        ussd: { title: "USSD (ಪಠ್ಯ-ಆಧಾರಿತ)", description: "ಯಾವುದೇ ಮೊಬೈಲ್ ಫೋನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ, ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿಲ್ಲ." },
        helpLink: "ನಾನು ಯಾವ ಚಾನೆల్ ಆಯ್ಕೆ ಮಾಡಬೇಕು?",
        helpModal: {
            title: "ಸರಿಯಾದ ಚಾನೆಲ್ ಆಯ್ಕೆ ಮಾಡುವುದು",
            points: [
                { title: "ವೆಬ್ ಅಪ್ಲಿಕೇಶన్", description: "ಇಂಟರ್ನೆಟ್ ಇರುವ ಸ್ಮಾರ್ಟ್‌ಫೋನ್‌ಗಳಿಗೆ ಉತ್ತಮ. ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಮತ್ತು ಸಮೃದ್ಧ ದೃಶ್ಯ ಅನುಭವವನ್ನು ಅನುಮತಿಸುತ್ತದೆ." },
                { title: "USSD", description: "ನೀವು ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದ ಮೂಲಭೂತ ಫೋನ್ ('ಫೀಚರ್ ಫೋನ್') ಹೊಂದಿದ್ದರೆ ಇದನ್ನು ಬಳಸಿ. ನಿಮ್ಮ ಕೀಪ್ಯಾಡ್ ಬಳಸಿ ನೀವು ಸಂವಹನ ನಡೆಸುತ್ತೀರಿ." }
            ],
            closeButton: "ಮುಚ್ಚಿ"
        }
    },
    info: {
        title: "ಸ್ವಾಗತ! ಪ್ರಾರಂಭಿಸೋಣ.",
        subtitle: "ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿದೆ, ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ನಿಮ್ಮ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.",
        secure: "🔒 ಸುರಕ್ಷಿತ",
        compliant: "✔ RBI-ಕಂಪ್ಲೈಂಟ್",
        multilingual: "🌐 ಬಹುಭಾಷಾ",
        fullNameLabel: "ಪೂರ್ಣ ಹೆಸರು",
        fullNamePlaceholder: "ಆಧಾರ್/ಪ್ಯಾನ್ ಪ್ರಕಾರ",
        phoneLabel: "10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆ",
        sendOtpButton: "OTP ಕಳುಹಿಸಿ",
        otpLabel: "6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
        verifyButton: "ಪರಿಶೀಲಿಸಿ",
        resendOtpTimer: "{otpTimer} ಸೆಕೆಂಡುಗಳಲ್ಲಿ OTP ಮರುಕಳುಹಿಸಿ",
        resendOtpLink: "OTP ಮರುಕಳುಹಿಸಿ",
        phoneVerified: "ಫೋನ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        aadhaarLabel: "ಪೂರ್ಣ 12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ",
        aadhaarPlaceholder: "ಉದಾ., 123456789012",
        occupationLabel: "ಮುಖ್ಯ ಉದ್ಯೋಗ",
        selectOccupation: "ನಿಮ್ಮ ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        locationLabel: "ಸ್ಥಳ (ನಗರ, ರಾಜ್ಯ)",
        locationPlaceholder: "ಉದಾ., ಪುಣೆ, ಮಹಾರಾಷ್ಟ್ರ",
        pincodeLabel: "ಪಿನ್‌ಕೋಡ್",
        pincodePlaceholder: "ಉದಾ., 400001",
        incomePatternLabel: "ಆದಾಯದ ಮಾದರಿ",
        incomePatternTooltip: "ನೀವು ಎಷ್ಟು ಬಾರಿ ಹಣ ಪಡೆಯುತ್ತೀರಿ ಎಂಬುದು ನಿಮ್ಮ ನಗದು ಹರಿವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        selectIncomePattern: "ನಿಮ್ಮ ಆದಾಯದ ಮಾದರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        bankDetailsTitle: "ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು",
        bankNameLabel: "ಬ್ಯಾಂಕ್ ಹೆಸರು",
        bankNamePlaceholder: "ಉದಾ., ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ",
        accountNumberLabel: "ಖಾತೆ ಸಂಖ್ಯೆ",
        accountNumberPlaceholder: "ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
        ifscCodeLabel: "IFSC ಕೋಡ್",
        ifscCodePlaceholder: "ಉದಾ., SBIN0001234",
        prefillLabel: "ಉದಾಹರಣೆ ತುಂಬಿ:",
        needHelpLink: "ಸಹಾಯ ಬೇಕೇ?",
        continueButton: "➡ ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಸಿ",
        stepDescription: "ಈ ಹಂತವು ನಿಮ್ಮ ಅನನ್ಯ ಹಣಕಾಸು ಪ್ರೊಫೈల్ ಅನ್ನು ನಿರ್ಮಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ."
    },
    consent: {
        title: "ನಿಮ್ಮ ಗೌಪ్యತೆ ಮುಖ್ಯ",
        subtitle: "ನಾವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಗೌರವಿಸುತ್ತೇವೆ. ನೀವು ನಿಯಂತ್ರಣದಲ್ಲಿರುತ್ತೀರಿ.",
        tag1: "ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಡೇಟಾ",
        tag2: "RBI ಗೆ ಅನುಗುಣವಾಗಿದೆ",
        tag3: "ಮೂರನೇ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ",
        main: "ನಿಮ್ಮ ಹಣಕಾಸಿನ ಆರೋಗ್ಯವನ್ನು ನಿರ್ಣಯಿಸಲು, ನಮ್ಮ AI ವ್ಯವಸ್ಥೆಯು ನೀವು ಒದಗಿಸುವ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಬೇಕಾಗುತ್ತದೆ. ಇದು ಒಳಗೊಂಡಿದೆ:",
        points: [
            { text: "ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ ಮತ್ತು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ.", topic: "ಉದ್ಯೋಗ ಮತ್ತು ಆದಾಯ", ariaLabel: "ನಿಮ್ಮ ಉದ್ಯೋಗ ಮತ್ತು ಸ್ಥಳ ನಮಗೆ ಏಕೆ ಬೇಕು" },
            { text: "ನೀವು ನಮಗೆ ಹೇಳುವ ಹಣದ ಕಥೆ (ಪಠ್ಯ, ಧ್ವನಿ, ಅಥವಾ ಚಿತ್ರ).", topic: "ಹಣಕಾಸಿನ ಕಥೆ", ariaLabel: "ನಿಮ್ಮ ಹಣಕಾಸಿನ ಕಥೆ ನಮಗೆ ಏಕೆ ಬೇಕು" },
            { text: "ಸಣ್ಣ ಹಣಕಾಸಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಿಮ್ಮ ಉತ್ತರಗಳು.", topic: "ಸನ್ನಿವೇಶದ ಪ್ರಶ್ನೆಗಳು", ariaLabel: "ಸನ್ನಿವೇಶದ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಿಮ್ಮ ಉತ್ತರಗಳು ನಮಗೆ ಏಕೆ ಬೇಕು" },
            { text: "ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಯಾವುದೇ ದಾಖಲೆಗಳು (ಕೆಲಸದ IDಗಳು ಅಥವಾ ಆಸ್ತಿ ಫೋಟೋಗಳಂತಹ).", topic: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು", ariaLabel: "ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ನಮಗೆ ಏಕೆ ಬೇಕು" }
        ],
        explanationTitle: "ನಾವು ಇದನ್ನು ಏಕೆ ಕೇಳುತ್ತೇವೆ",
        explanationLoading: "ವಿವರಣೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        explanationFallback: "ನಿಮ್ಮ ಹಣಕಾಸಿನ ಆರೋಗ್ಯದ ಸಂಪೂರ್ಣ ಮತ್ತು ನ್ಯಾಯಯುತ ಚಿತ್ರಣವನ್ನು ನಿರ್ಮಿಸಲು ನಮಗೆ ಈ ಮಾಹಿತಿ ಬೇಕು, ಇದು ನಿಮಗೆ ಉತ್ತಮ ಆಯ್ಕೆಗಳನ್ನು ಒದಗಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        explanationGotIt: "ಅರ್ಥವಾಯಿತು",
        checkboxLabel: "ನಾನು ಒಪ್ಪುತ್ತೇನೆ ಮತ್ತು ನನ್ನ ಸಮ್ಮತಿಯನ್ನು ನೀಡುತ್ತೇನೆ.",
        agreeButton: "ಒಪ್ಪಿ ಮತ್ತು ಮುಂದುವರಿಸಿ"
    },
    professionQuestions: {
        title: "ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ",
        subtitle: "ನಿಮ್ಮ ವೃತ್ತಿಯ ಬಗ್ಗೆ ಕೆಲವು ಪ್ರಶ್ನೆಗಳು ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ಚೆನ್ನಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        submitButton: "ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಸಿ",
        "Small Farmer": {
            cropTypes: { label: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಬೆಳೆಗಳು ಯಾವುವು?", placeholder: "ಉದಾ., ಅಕ್ಕಿ, ಗೋಧಿ", type: "text" },
            landSizeAcres: { label: "ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ (ಎಕರೆಗಳಲ್ಲಿ) ಎಷ್ಟು?", placeholder: "ಉದಾ., 5", type: "number" },
            hasWarehouseAccess: { label: "ಸಂಗ್ರಹಣೆಗಾಗಿ ನಿಮಗೆ ಗೋದಾಮಿನ ಪ್ರವೇಶವಿದೆಯೇ? ಹೌದು/ಇಲ್ಲ", type: "boolean" }
        },
        "Gig Worker": {
            primaryPlatform: { label: "ನೀವು ಪ್ರಾಥಮಿಕವಾಗಿ ಯಾವ ವೇದಿಕೆಯೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುತ್ತೀರಿ?", placeholder: "ಉದಾ., ಓಲಾ, ಉಬರ್, ಸ್ವಿಗ್ಗಿ", type: "text" },
            avgDailyEarnings: { label: "ನಿಮ್ಮ ಸರಾಸರಿ ದೈನಂದಿನ ಗಳಿಕೆ (₹ ನಲ್ಲಿ) ಎಷ್ಟು?", placeholder: "ಉದಾ., 800", type: "number" },
            vehicleOwned: { label: "ಕೆಲಸಕ್ಕಾಗಿ ನೀವು ಯಾವ ರೀತಿಯ ವಾಹನವನ್ನು ಹೊಂದಿದ್ದೀರಿ?", options: ['ಯಾವುದೂ ಇಲ್ಲ', '2-ಚಕ್ರ', '3-ಚಕ್ರ', '4-ಚಕ್ರ'], type: "select" }
        },
        "Kirana Shop Owner": {
            avgDailyFootfall: { label: "ದಿನಕ್ಕೆ ಸರಾಸರಿ ಗ್ರಾಹಕರ ಸಂಖ್ಯೆ ಎಷ್ಟು?", placeholder: "ಉದಾ., 50", type: "number" },
            inventoryValue: { label: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ದಾಸ್ತಾನುಗಳ ಅಂದಾಜು ಮೌಲ್ಯ (₹ ನಲ್ಲಿ) ಎಷ್ಟು?", placeholder: "ಉದಾ., 50000", type: "number" },
            usesDigitalPayments: { label: "ನೀವು ಡಿಜಿಟಲ್ ಪಾವತಿಗಳನ್ನು (UPI, QR ಕೋಡ್‌ಗಳಂತಹ) ಸ್ವೀಕರಿಸುತ್ತೀರಾ? ಹೌದು/ಇಲ್ಲ", type: "boolean" }
        },
        "SHG Member": {
            groupName: { label: "ನಿಮ್ಮ ಸ್ವಸಹಾಯ ಸಂಘದ ಹೆಸರೇನು?", placeholder: "ಉದಾ., ಪ್ರಗತಿ SHG", type: "text" },
            yearsInGroup: { label: "ನೀವು ಎಷ್ಟು ವರ್ಷಗಳಿಂದ ಸದಸ್ಯರಾಗಿದ್ದೀರಿ?", placeholder: "ಉದಾ., 3", type: "number" },
            groupActivity: { label: "ನಿಮ್ಮ ಗುಂಪಿನ ಪ್ರಾಥಮಿಕ ಚಟುವಟಿಕೆ ಏನು?", placeholder: "ಉದಾ., ಟೈಲರಿಂಗ್, ಹಪ್ಪಳ ತಯಾರಿಕೆ", type: "text" }
        },
        "Micro-Entrepreneur": {
            businessType: { label: "ನೀವು ಯಾವ ರೀತಿಯ ವ್ಯಾಪಾರವನ್ನು ನಡೆಸುತ್ತೀರಿ?", placeholder: "ಉದಾ., ಆಹಾರದ ಅಂಗಡಿ, ಟೈಲರಿಂಗ್", type: "text" },
            yearsInBusiness: { label: "ನೀವು ಈ ವ್ಯವಹಾರದಲ್ಲಿ ಎಷ್ಟು ವರ್ಷಗಳಿಂದ ಇದ್ದೀರಿ?", placeholder: "ಉದಾ., 2", type: "number" },
            avgMonthlyProfit: { label: "ನಿಮ್ಮ ಸರಾಸರಿ ಮಾಸಿಕ ಲಾಭ (₹ ನಲ್ಲಿ) ಎಷ್ಟು?", placeholder: "ಉದಾ., 10000", type: "number" }
        }
    },
    data: {
        title: "ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ (ಐಚ್ಛಿಕ)",
        subtitle: "ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ ಪ್ರಮುಖ ವಿವರಗಳು ನಮ್ಮ ಬಳಿ ಇವೆ. ನೀವು ಬೇರೆ ಏನನ್ನಾದರೂ ಹಂಚಿಕೊಳ್ಳಲು ಬಯಸಿದರೆ, ನೀವು ಇಲ್ಲಿ ಮಾಡಬಹುದು.",
        type: "ಟೈಪ್ ಮಾಡಿ",
        speak: "ಮಾತನಾಡಿ",
        upload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        textareaPlaceholder: "ನೀವು ಬೇರೆ ಏನನ್ನಾದರೂ ಹಂಚಿಕೊಳ್ಳಲು ಬಯಸುವಿರಾ? ಉದಾಹರಣೆಗೆ, ಇತರ ಆದಾಯ, ನಿರ್ದಿಷ್ಟ ವೆಚ್ಚಗಳು, ಅಥವಾ ಭವಿಷ್ಯದ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ವಿವರಗಳು.",
        speakStart: "ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ.",
        speakStop: "ಕೇಳುತ್ತಿದೆ... ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ.",
        uploadTitle: "ಲೆಡ್ಜರ್/ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        uploadSubtitle: "ನಿಮ್ಮ ಕೈಬರಹದ ಖಾತೆ ಪುಸ್ತಕದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
        optional: {
            title: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಬಲಪಡಿಸಿ (ಐಚ್ಛಿಕ)",
            refNameLabel: "ಸಮುದಾಯದ ಉಲ್ಲೇಖದ ಹೆಸರು",
            refNamePlaceholder: "ಉದಾ., ನಾನು ಖರೀದಿಸುವ ಅಂಗಡಿಯವನು",
            refRelationLabel: "ಸಂಬಂಧ",
            refRelationPlaceholder: "ಉದಾ., 5 ವರ್ಷಗಳಿಂದ ಗ್ರಾಹಕ",
            addDocsLabel: "ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
            clickToUpload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
            dragAndDrop: "ಅಥವಾ ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಮಾಡಿ",
            fileTypes: "PNG, JPG, JPEG",
            docCategories: ["ಗುರುತು", "ಕೆಲಸ", "ಆಸ್ತಿ", "ಇತರೆ"],
            altDataLabel: "ಟೆಲಿಕಾಂ/ಯುಟಿಲಿಟಿ ಡೇಟಾವನ್ನು ಸಂಪರ್ಕಿಸಿ",
            altDataTitle: "ಪರ್ಯಾಯ ಡೇಟಾವನ್ನು ಒದಗಿಸಿ (ಐಚ್ಛಿಕ)",
            simAge: "ಸಿಮ್ ವಯಸ್ಸು (ದಿನಗಳು)",
            avgRecharge: "ಸರಾಸರಿ ರೀಚಾರ್ಜ್ (₹)",
            billsPaid: "ಬಿಲ್ ಪಾವತಿಸಲಾಗಿದೆ (6 ತಿಂಗಳು)",
            tenure: "ಅಧಿಕಾರಾವಧಿ (ತಿಂಗಳುಗಳು)"
        },
        analyzeButton: "ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ"
    },
    clarification: {
        title: "ಇನ್ನೂ ಕೆಲವು ಪ್ರಶ್ನೆಗಳು",
        subtitle: "ನಮ್ಮ AI ಗೆ ನೀವು ಹಂಚಿಕೊಂಡ ವಿಷಯದ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಸ್ಪಷ್ಟತೆ ಬೇಕು. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.",
        submitButton: "ಉತ್ತರಗಳನ್ನು ಸಲ್ಲಿಸಿ"
    },
    psychometric: {
        title: "ಬಹುತೇಕ ಮುಗಿದಿದೆ!",
        subtitle: "ಈ ತ್ವರಿತ ಸನ್ನಿವೇಶದ ಪ್ರಶ್ನೆಗಳು ನಿಮ್ಮ ಹಣಕಾಸಿನ ವಿಧಾನವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಸರಿಯಾದ ಅಥವಾ ತಪ್ಪು ಉತ್ತರಗಳಿಲ್ಲ.",
        completeButton: "ಅರ್ಜಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
        skipButton: "ಈಗ ಸದ್ಯಕ್ಕೆ ಬಿಟ್ಟುಬಿಡಿ"
    },
    psychometricQuestions: {
        q1: { question: "₹2000 ದ ಅನಿರೀಕ್ಷಿತ ವೆಚ್ಚ ಎದುರಾಗುತ್ತದೆ. ನೀವೇನು ಮಾಡುವಿರಿ?", options: ["ತುರ್ತು ಉಳಿತಾಯವನ್ನು ಬಳಸಿ", "ಸ್ನೇಹಿತನಿಂದ ಸಾಲ ಮಾಡಿ", "ಈ ತಿಂಗಳ ಇತರ ಖರ್ಚುಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ"] },
        q2: { question: "ಸ್ನೇಹಿತನೊಬ್ಬನ ಹೊಸ ವ್ಯಾಪಾರದ ಆಲೋಚನೆಯಲ್ಲಿ ಸಣ್ಣ ಮೊತ್ತವನ್ನು ಹೂಡಿಕೆ ಮಾಡುವ ಅವಕಾಶ ನಿಮಗೆ ಸಿಗುತ್ತದೆ, ಅದು ಉತ್ತಮ ಲಾಭವನ್ನು ನೀಡಬಹುದು, ಆದರೆ ಅದರಲ್ಲಿ ಕೆಲವು ಅಪಾಯಗಳಿವೆ. ನೀವೇನು ಮಾಡುವಿರಿ?", options: ["ಹೂಡಿಕೆ ಮಾಡಿ, ಸಂಭಾವ್ಯತೆಯು ಅಪಾಯಕ್ಕೆ ಯೋಗ್ಯವಾಗಿದೆ", "ನಿರಾಕರಿಸಿ, ಅದು ಈಗ ತುಂಬಾ ಅಪಾಯಕಾರಿಯಾಗಿದೆ", "ನಿರ್ಧರಿಸುವ ಮೊದಲು ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ಕೇಳಿ"] },
        q3: { question: "ಸಮುದಾಯದ ಸದಸ್ಯನೊಬ್ಬನಿಗೆ ಸಣ್ಣ, ತುರ್ತು ಸಾಲದ ಅಗತ್ಯವಿದೆ ಮತ್ತು ನಿಮ್ಮ ಸಹಾಯವನ್ನು ಕೇಳುತ್ತಾನೆ. ಅವರು ವಿಶ್ವಾಸಾರ್ಹರೆಂದು ನಿಮಗೆ ತಿಳಿದಿದೆ. ನೀವೇನು ಮಾಡುವಿರಿ?", options: ["ಹಣವನ್ನು ಹಿಂಜರಿಕೆಯಿಲ್ಲದೆ ಸಾಲ ನೀಡಿ", "ಹಣ ಮತ್ತು ಸ್ನೇಹಿತರನ್ನು ಬೆರೆಸುವುದಿಲ್ಲವಾದ್ದರಿಂದ ವಿನಯದಿಂದ ನಿರಾಕರಿಸಿ", "ವಿನಂತಿಸಿದ್ದಕ್ಕಿಂತ ಸಣ್ಣ ಮೊತ್ತವನ್ನು ಸಾಲ ನೀಡಿ"] }
    },
    errors: {
        micPermission: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.",
        speechRecognition: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಸೇವೆ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        noVoiceSupport: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
        ifsc: "ದಯವಿಟ್ಟು ಮಾನ್ಯ 11-ಅಕ್ಷರಗಳ IFSC ಕೋಡ್ ನಮೂದಿಸಿ.",
        emptyInput: "ಇನ್‌ಪುಟ್ ಖಾಲಿಯಾಗಿರಲು ಸಾಧ್ಯವಿಲ್ಲ.",
        numbersOnly: "ದಯವಿಟ್ಟು ಸಂಖ್ಯೆಗಳನ್ನು ಮಾತ್ರ ನಮೂದಿಸಿ.",
        exactLength: "ದಯವಿಟ್ಟು ನಿಖರವಾಗಿ {maxLength} ಅಂಕೆಗಳನ್ನು ನಮೂದಿಸಿ.",
        invalidSelection: "ಅಮಾನ್ಯ ಆಯ್ಕೆ.",
        voiceInput: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    },
    help: {
        title: "ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಸಹಾಯಕ",
        greeting: "ನಮಸ್ಕಾರ! ಅರ್ಜಿ ನಮೂನೆಯೊಂದಿಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...",
        error: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಇದೀಗ ಉತ್ತರ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಮ್ಮ FAQ ಪುಟವನ್ನು ಪರಿಶೀಲಿಸಿ."
    },
    docAnalysis: {
        title: "ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ",
        alt: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಯ ಪೂರ್ವವೀಕ್ಷಣೆ",
        analyzing: "ದಾಖಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        analysisError: "ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾದ ಚಿತ್ರವನ್ನು ಪ್ರಯತ್ನಿಸಿ.",
        ocrError: "ಚಿತ್ರದಿಂದ ಪಠ್ಯವನ್ನು ಓದಲಾಗಲಿಲ್ಲ.",
        imageUploaded: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
        docCheck: "ದೃಢೀಕರಣ ಪರಿಶೀಲನೆ",
        ledgerReading: "ಲೆಡ್ಜರ್ ಓದುವಿಕೆ (AI OCR)",
        loading: "ಓದಲಾಗುತ್ತಿದೆ...",
        verifying: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
        verificationFailed: "ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಂದು ದಾಖಲೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ."
    },
    prefill: {
        farmer: { button: "ರೈತ", name: "ರಮೇಶ್ ಕುಮಾರ್", profession: "ಸಣ್ಣ ರೈತ", location: "ನಾಲೆಗಾಂವ್, ಮಹಾರಾಷ್ಟ್ರ", pincode: "413521", incomeType: "ಋತುಮಾನ/ಅನಿಯಮಿತ", aadhaar: "123412341234", phone: "9876543210", bankAccountNumber: "112233445566", bankName: "ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ", ifscCode: "SBIN0000300" },
        gig: { button: "ಗುತ್ತಿಗೆ ಕೆಲಸಗಾರ", name: "ಪ್ರಿಯಾ ಸಿಂಗ್", profession: "ಗುತ್ತಿಗೆ ಕೆಲಸಗಾರ", location: "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ", pincode: "560001", incomeType: "ದೈನಂದಿನ", aadhaar: "432143214321", phone: "9876543211", bankAccountNumber: "998877665544", bankName: "HDFC ಬ್ಯಾಂಕ್", ifscCode: "HDFC0000001" }
    },
    otpMessage: "ನಿಮ್ಮ OTP:",
    feedbackKeywords: {
        income: ["ಆದಾಯ", "ಗಳಿಸು", "ಸಂಬಳ", "ಲಾಭ"],
        expenses: ["ಬಾಡಿಗೆ", "ಆಹಾರ", "ಬಿಲ್‌ಗಳು", "ಖರ್ಚು"],
        savings: ["ಉಳಿತಾಯ", "ಹೂಡಿಕೆ", "ಠೇವಣಿ"]
    },
    ussd: {
        welcome: "ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
        phone: "ನಿಮ್ಮ 10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        aadhaar: "ನಿಮ್ಮ 12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        profession: "ನಿಮ್ಮ ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
        financialStatementOptional: "ನೀವು ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಹಣಕಾಸಿನ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಬಯಸುವಿರಾ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
        financialStatement: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹಣಕಾಸಿನ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ.",
        analyzing: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        location: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು (ನಗರ) ನಮೂದಿಸಿ.",
        pincode: "ನಿಮ್ಮ 6-ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ.",
        incomeType: "ನಿಮ್ಮ ಆದಾಯದ ಮಾದರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
        bankName: "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
        accountNumber: "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        ifscCode: "ನಿಮ್ಮ ಬ್ಯಾಂಕಿನ IFSC ಕೋಡ್ ನಮೂದಿಸಿ.",
        simTenure: "ನಿಮ್ಮ ಸಿಮ್ ಕಾರ್ಡ್ ಅನ್ನು ಎಷ್ಟು ಸಮಯದಿಂದ ಬಳಸುತ್ತಿದ್ದೀರಿ?\n1. < 1 ವರ್ಷ\n2. 1-3 ವರ್ಷಗಳು\n3. > 3 ವರ್ಷಗಳು",
        utilityBills: "ಕಳೆದ 6 ತಿಂಗಳುಗಳಲ್ಲಿ ನೀವು ಎಷ್ಟು ಯುಟಿಲಿಟಿ ಬಿಲ್‌ಗಳನ್ನು ಪಾವತಿಸಿದ್ದೀರಿ?",
        mobilePayments: "ನೀವು ಮೊಬೈಲ್ ಪಾವತಿಗಳನ್ನು (UPI ನಂತಹ) ಬಳಸುತ್ತೀರಾ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
        savingsHabit: "ನಿಮಗೆ ನಿಯಮಿತ ಉಳಿತಾಯದ ಅಭ್ಯಾಸವಿದೆಯೇ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
        hasReference: "ನೀವು ಸಮುದಾಯದ ಉಲ್ಲೇಖವನ್ನು ಒದಗಿಸಬಹುದೇ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
        referenceName: "ಉಲ್ಲೇಖದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
        referenceRelationship: "ಅವರೊಂದಿಗೆ ನಿಮ್ಮ ಸಂಬಂಧವೇನು?",
        finalScoreMessage: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಅಂತಿಮ ಸ್ಕೋರ್ {score} ಆಗಿದೆ.\n\nನಿಮ್ಮ ವಿವರವಾದ ವರದಿಯನ್ನು ವೀಕ್ಷಿಸಲು 1 ಎಂದು ಪ್ರತ್ಯುತ್ತರಿಸಿ.",
        send: "ಕಳುಹಿಸಿ",
        finish: "ಮುಕ್ತಾಯ",
        yes: "ಹೌದು",
        no: "ಇಲ್ಲ"
    }
};

const teTranslations = JSON.parse(JSON.stringify(knTranslations));
const bnTranslations = JSON.parse(JSON.stringify(hiTranslations));
const mrTranslations = JSON.parse(JSON.stringify(hiTranslations));
const guTranslations = JSON.parse(JSON.stringify(hiTranslations));
const mlTranslations = JSON.parse(JSON.stringify(taTranslations));
const paTranslations = JSON.parse(JSON.stringify(hiTranslations));
const orTranslations = JSON.parse(JSON.stringify(hiTranslations));

// Telugu Translations
teTranslations.professions = ["చిన్న రైతు", "గిగ్ వర్కర్", "కిరాణా దుకాణం యజమాని", "స్వయం సహాయక బృందం సభ్యుడు", "సూక్ష్మ పారిశ్రామికవేత్త"];
teTranslations.incomeTypes = ["రోజువారీ", "వారంవారీ", "నెలవారీ", "సీజనల్/అనియమిత"];
teTranslations.stepper = [
    { id: JourneyStep.INFO, name: "గుర్తింపు" },
    { id: JourneyStep.CONSENT, name: "సమ్మతి" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "పని వివరాలు" },
    { id: JourneyStep.DATA_INPUT, name: "అదనపు సమాచారం" },
    { id: JourneyStep.PSYCHOMETRIC, name: "ముగించు" }
];
teTranslations.channel.title = "మీ ఆన్‌బోర్డింగ్ ఛానెల్‌ని ఎంచుకోండి";
teTranslations.info.title = "స్వాగతం! ప్రారంభిద్దాం.";
teTranslations.ussd.phone = "మీ 10-అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి.";
teTranslations.ussd.finalScoreMessage = "ధన్యవాదాలు! మీ తుది స్కోరు {score}.\n\nమీ వివరణాత్మక నివేదికను చూడటానికి 1 అని ప్రత్యుత్తరం ఇవ్వండి.";

// Bengali Translations
bnTranslations.professions = ["ছোট কৃষক", "গিগ কর্মী", "কিরানা দোকানের মালিক", "স্বনির্ভর গোষ্ঠীর সদস্য", "ক্ষুদ্র উদ্যোক্তা"];
bnTranslations.incomeTypes = ["দৈনিক", "সাপ্তাহিক", "মাসিক", "মৌসুমী/অনিয়মিত"];
bnTranslations.stepper = [
    { id: JourneyStep.INFO, name: "পরিচয়" },
    { id: JourneyStep.CONSENT, name: "সম্মতি" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "কাজের বিবরণ" },
    { id: JourneyStep.DATA_INPUT, name: "অতিরিক্ত তথ্য" },
    { id: JourneyStep.PSYCHOMETRIC, name: "শেষ" }
];
bnTranslations.channel.title = "আপনার অনবোর্ডিং চ্যানেল নির্বাচন করুন";
bnTranslations.info.title = "স্বাগতম! চলুন শুরু করা যাক।";
bnTranslations.ussd.phone = "আপনার 10-সংখ্যার ফোন নম্বর লিখুন।";
bnTranslations.ussd.finalScoreMessage = "ধন্যবাদ! আপনার চূড়ান্ত স্কোর হল {score}।\n\nআপনার বিস্তারিত প্রতিবেদন দেখতে 1 উত্তর দিন।";

// Marathi Translations
mrTranslations.professions = ["शेतकरी", "गिग वर्कर", "किराणा दुकानदार", "बचत गट सदस्य", "लघुउद्योजक"];
mrTranslations.incomeTypes = ["दैनिक", "साप्ताहिक", "मासिक", "हंगामी/अनियमित"];
mrTranslations.stepper = [
    { id: JourneyStep.INFO, name: "ओळख" },
    { id: JourneyStep.CONSENT, name: "संमती" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "कामाचा तपशील" },
    { id: JourneyStep.DATA_INPUT, name: "अधिक माहिती" },
    { id: JourneyStep.PSYCHOMETRIC, name: "पूर्ण" }
];
mrTranslations.channel.title = "तुमचे ऑनबोर्डिंग चॅनल निवडा";
mrTranslations.info.title = "स्वागत आहे! चला सुरुवात करूया.";
mrTranslations.ussd.phone = "तुमचा 10-अंकी फोन नंबर टाका.";
mrTranslations.ussd.finalScoreMessage = "धन्यवाद! तुमचा अंतिम गुण {score} आहे.\n\nतुमचा तपशीलवार अहवाल पाहण्यासाठी 1 उत्तर द्या.";

// Gujarati Translations
guTranslations.professions = ["નાના ખેડૂત", "ગિગ વર્કર", "કરિયાણાની દુકાનના માલિક", "સ્વ-સહાય જૂથના સભ્ય", "માઇક્રો-ઉદ્યોગસાહસિક"];
guTranslations.incomeTypes = ["દૈનિક", "સાપ્તાહિક", "માસિક", "મોસમી/અનિયમિત"];
guTranslations.stepper = [
    { id: JourneyStep.INFO, name: "ઓળખ" },
    { id: JourneyStep.CONSENT, name: "સંમતિ" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "કામની વિગતો" },
    { id: JourneyStep.DATA_INPUT, name: "વધારાની માહિતી" },
    { id: JourneyStep.PSYCHOMETRIC, name: "પૂર્ણ કરો" }
];
guTranslations.channel.title = "તમારી ઓનબોર્ડિંગ ચેનલ પસંદ કરો";
guTranslations.info.title = "સ્વાગત છે! ચાલો શરૂ કરીએ.";
guTranslations.ussd.phone = "તમારો 10-અંકનો ફોન નંબર દાખલ કરો.";
guTranslations.ussd.finalScoreMessage = "આભાર! તમારો અંતિમ સ્કોર {score} છે.\n\nતમારો વિગતવાર અહેવાલ જોવા માટે 1 જવાબ આપો.";

// Malayalam Translations
mlTranslations.professions = ["ചെറുകിട കർഷകൻ", "ഗിഗ് വർക്കർ", " പലചരക്ക് കടയുടമ", "സ്വയം സഹായ സംഘം അംഗം", "മൈക്രോ സംരംഭകൻ"];
mlTranslations.incomeTypes = ["ദിവസേന", "പ്രതിവാര", "പ്രതിമാസ", "സീസണൽ/ക്രമരഹിതം"];
mlTranslations.stepper = [
    { id: JourneyStep.INFO, name: "തിരിച്ചറിയൽ" },
    { id: JourneyStep.CONSENT, name: "സമ്മതം" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "ജോലി വിശദാംശങ്ങൾ" },
    { id: JourneyStep.DATA_INPUT, name: "കൂടുതൽ വിവരങ്ങൾ" },
    { id: JourneyStep.PSYCHOMETRIC, name: "പൂർത്തിയാക്കുക" }
];
mlTranslations.channel.title = "നിങ്ങളുടെ ഓൺബോർഡിംഗ് ചാനൽ തിരഞ്ഞെടുക്കുക";
mlTranslations.info.title = "സ്വാഗതം! നമുക്ക് തുടങ്ങാം.";
mlTranslations.ussd.phone = "നിങ്ങളുടെ 10 അക്ക ഫോൺ നമ്പർ നൽകുക.";
mlTranslations.ussd.finalScoreMessage = "നന്ദി! നിങ്ങളുടെ അന്തിമ സ്കോർ {score} ആണ്.\n\nനിങ്ങളുടെ വിശദമായ റിപ്പോർട്ട് കാണാൻ 1 എന്ന് മറുപടി നൽകുക.";

// Punjabi Translations
paTranslations.professions = ["ਛੋਟਾ ਕਿਸਾਨ", "ਗਿਗ ਵਰਕਰ", "ਕਰਿਆਨੇ ਦੀ ਦੁਕਾਨ ਦਾ ਮਾਲਕ", "ਸਵੈ-ਸਹਾਇਤਾ ਸਮੂਹ ਦਾ ਮੈਂਬਰ", "ਮਾਈਕ੍ਰੋ-ਉੱਦਮੀ"];
paTranslations.incomeTypes = ["ਰੋਜ਼ਾਨਾ", "ਹਫ਼ਤਾਵਾਰੀ", "ਮਹੀਨਾਵਾਰ", "ਮੌਸਮੀ/ਅਨਿਯਮਿਤ"];
paTranslations.stepper = [
    { id: JourneyStep.INFO, name: "ਪਛਾਣ" },
    { id: JourneyStep.CONSENT, name: "ਸਹਿਮਤੀ" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "ਕੰਮ ਦੇ ਵੇਰਵੇ" },
    { id: JourneyStep.DATA_INPUT, name: "ਵਧੀਕ ਜਾਣਕਾਰੀ" },
    { id: JourneyStep.PSYCHOMETRIC, name: "ਖਤਮ ਕਰੋ" }
];
paTranslations.channel.title = "ਆਪਣਾ ਔਨਬੋਰਡਿੰਗ ਚੈਨਲ ਚੁਣੋ";
paTranslations.info.title = "ਜੀ ਆਇਆਂ ਨੂੰ! ਆਓ ਸ਼ੁਰੂ ਕਰੀਏ।";
paTranslations.ussd.phone = "ਆਪਣਾ 10-ਅੰਕਾਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ।";
paTranslations.ussd.finalScoreMessage = "ਧੰਨਵਾਦ! ਤੁਹਾਡਾ ਅੰਤਿਮ ਸਕੋਰ {score} ਹੈ।\n\nਆਪਣੀ ਵਿਸਤ੍ਰਿਤ ਰਿਪੋਰਟ ਦੇਖਣ ਲਈ 1 ਜਵਾਬ ਦਿਓ।";

// Odia Translations
orTranslations.professions = ["କ୍ଷୁଦ୍ର ଚାଷୀ", "ଗିଗ୍ କର୍ମଚାରୀ", "କିରାନା ଦୋକାନ ମାଲିକ", "ସ୍ୱୟଂ ସହାୟକ ଗୋଷ୍ଠୀ ସଦସ୍ୟ", "କ୍ଷୁଦ୍ର ଉଦ୍ୟୋଗୀ"];
orTranslations.incomeTypes = ["ଦୈନିକ", "ସାପ୍ତାହିକ", "ମାସିକ", "ଋତୁକାଳୀନ/ଅନିୟମିତ"];
orTranslations.stepper = [
    { id: JourneyStep.INFO, name: "ପରିଚୟ" },
    { id: JourneyStep.CONSENT, name: "ସମ୍ମତି" },
    { id: JourneyStep.PROFESSION_QUESTIONS, name: "କାର୍ଯ୍ୟ ବିବରଣୀ" },
    { id: JourneyStep.DATA_INPUT, name: "ଅତିରିକ୍ତ ସୂଚନା" },
    { id: JourneyStep.PSYCHOMETRIC, name: "ସମାପ୍ତ" }
];
orTranslations.channel.title = "ଆପଣଙ୍କର ଅନବୋର୍ଡିଂ ଚ୍ୟାନେଲ୍ ବାଛନ୍ତୁ";
orTranslations.info.title = "ସ୍ୱାଗତ! ଚାଲନ୍ତୁ ଆରମ୍ଭ କରିବା।";
orTranslations.ussd.phone = "ଆପଣଙ୍କର 10-ଅଙ୍କ ବିଶିଷ୍ଟ ଫୋନ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ |";
orTranslations.ussd.finalScoreMessage = "ଧନ୍ୟବାଦ! ଆପଣଙ୍କର ଅନ୍ତିମ ସ୍କୋର ହେଉଛି {score}।\n\nଆପଣଙ୍କର ବିସ୍ତୃତ ରିପୋର୍ଟ ଦେଖିବାକୁ 1 ଉତ୍ତର ଦିଅନ୍ତୁ।";


export const translations = {
    en: enTranslations,
    hi: hiTranslations,
    ta: taTranslations,
    kn: knTranslations,
    te: teTranslations,
    bn: bnTranslations,
    mr: mrTranslations,
    gu: guTranslations,
    ml: mlTranslations,
    pa: paTranslations,
    or: orTranslations,
};