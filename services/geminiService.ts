
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { UserData, ScoreData, LoanOption, StructuredData, BudgetCategory, SavingsPlan, SelectedLoan, GeospatialAnalysis, PredictiveIntervention, DiaryEntry, ScoreSimulation, FeedbackAnalysis, IntegratedProfile } from '../types';
import { retrieveKnowledge } from './knowledgeBase';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// FIX: Correctly initialize GoogleGenAI with a named apiKey parameter.
export const ai = new GoogleGenAI({ apiKey: API_KEY });

const structuredDataResponseSchema = {
  type: Type.OBJECT,
  properties: {
    incomeRegularity: { type: Type.STRING, description: "Summary of income regularity (e.g., 'Daily but variable', 'Consistent monthly'). Infer from the text." },
    repaymentHistory: { type: Type.STRING, description: "Summary of mentioned repayment history (e.g., 'Paying back a local loan weekly'). Infer from the text." },
    financialShockIndicators: { type: Type.STRING, description: "Any indicators of financial shocks or lack of savings (e.g., 'Had a medical emergency last month'). Infer from the text." },
    behavioralMetrics: { type: Type.STRING, description: "Metrics like gig work ratings, completion rates, or community trust signals if mentioned. Infer from the text." },
    lifeEventSignals: { type: Type.STRING, description: "Life event signals like sowing season, festivals, or family events that might impact finances. Infer from the text." },
  },
  required: ["incomeRegularity", "repaymentHistory", "financialShockIndicators", "behavioralMetrics", "lifeEventSignals"],
};

export const extractStructuredData = async (userData: UserData): Promise<StructuredData> => {
    if (!userData.financialStatement && !userData.digitizedLedgerText) {
        return {
            incomeRegularity: 'Not mentioned',
            repaymentHistory: 'Not mentioned',
            financialShockIndicators: 'Not mentioned',
            behavioralMetrics: 'Not mentioned',
            lifeEventSignals: 'Not mentioned',
        };
    }

    const prompt = `
        **System:** You are the Feature Engineering Agent in a Multi-Agent Financial System.
        **Task:** Read the user's financial statement (text, OCR from an image, etc.) and extract key predictive features into a structured JSON object. Focus ONLY on information provided by the user. If a category is not mentioned, state 'Not mentioned'.

        **User Profile:**
        - Profession: ${userData.profession}
        - Income Type: ${userData.incomeType}
        - User's Written/Spoken Financial Statement: "${userData.financialStatement}"
        - Digitized Ledger Text (from OCR): "${userData.digitizedLedgerText || 'Not provided'}"

        **Extract the following features:**
        1.  **incomeRegularity:** How often does the user receive income? (e.g., Daily, Weekly, Monthly, Seasonal).
        2.  **repaymentHistory:** Does the user mention any past or current loans and their repayment behavior?
        3.  **financialShockIndicators:** Are there mentions of unexpected events impacting their finances (e.g., medical emergencies, crop failure)?
        4.  **behavioralMetrics:** Are there any indicators of reliability or community standing (e.g., good customer ratings, long-term relationships with clients)?
        5.  **lifeEventSignals:** Are there upcoming events that could affect finances (e.g., marriage, festival, sowing season)?
        
        Analyze the provided text and populate the JSON schema. Do not invent information.
    `;

    try {
        const response = await ai.models.generateContent({
            // FIX: Use the recommended model 'gemini-2.5-flash'.
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: structuredDataResponseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as StructuredData;
    } catch (error) {
        console.error("Error extracting structured data:", error);
        return {
            incomeRegularity: 'Analysis Error',
            repaymentHistory: 'Analysis Error',
            financialShockIndicators: 'Analysis Error',
            behavioralMetrics: 'Analysis Error',
            lifeEventSignals: 'Analysis Error',
        };
    }
};

// FIX: Implement all missing functions that were causing import errors.

export const getOnboardingHelp = async (question: string): Promise<string> => {
    const knowledge = retrieveKnowledge(question);
    const prompt = `You are a helpful and friendly onboarding assistant for a financial app called KredMitra. Answer the user's question simply and clearly based on the provided context.

    **Context from our knowledge base:**
    Title: ${knowledge.title}
    Content: ${knowledge.content}

    **User's Question:**
    "${question}"

    **Your Answer (in simple, encouraging language):**`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const verifyDocumentAuthenticity = async (image: { mimeType: string, data: string }): Promise<string> => {
    const prompt = "Analyze this image. Is it a real, unaltered document or a screenshot/tampered image? Look for signs of digital editing, screen reflections, or inconsistencies. Provide a brief, one-sentence conclusion like 'Document appears authentic' or 'Potential signs of tampering detected.'";
    
    const imagePart = { inlineData: { mimeType: image.mimeType, data: image.data } };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const simulateVernacularOcr = async (image: { mimeType: string, data: string }): Promise<string> => {
    const prompt = "Extract all text from this image, including handwritten and printed text. Prioritize accuracy for numbers and dates. The text might be in English or a regional Indian language.";
    
    const imagePart = { inlineData: { mimeType: image.mimeType, data: image.data } };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text || "No text could be extracted.";
};

export const getConsentExplanation = async (topic: string): Promise<string> => {
    const prompt = `Explain in simple, reassuring terms (max 2-3 short sentences) why a financial app would need to know about a user's "${topic}". Frame it from the user's perspective, focusing on benefits like fairness and getting a better loan. For example, if the topic is "Occupation and Income", explain it helps understand their ability to repay.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const generateClarifyingQuestions = async (financialStatement: string): Promise<string[]> => {
    if (!financialStatement || financialStatement.trim().length < 20) return [];
    
    const responseSchema = { type: Type.OBJECT, properties: { questions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
    const prompt = `Analyze the user's financial statement. If there are ambiguous points (e.g., "I earn a decent amount"), generate 1-3 simple, specific follow-up questions. If the statement is clear, return an empty array of questions.

    **User's statement:** "${financialStatement}"
    
    Return the questions in the specified JSON format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    
    try {
        return (JSON.parse(response.text)).questions || [];
    } catch (e) {
        return [];
    }
};

export const analyzeFinancialProfile = async (userData: UserData, integratedProfile: IntegratedProfile | null, psychometricAnalysis: string | null): Promise<ScoreData> => {
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            finalScore: { type: Type.INTEGER }, consistencyScore: { type: Type.INTEGER },
            communityTrustScore: { type: Type.INTEGER }, resilienceScore: { type: Type.INTEGER },
            scoreRationale: { type: Type.STRING }, fraudRisk: { type: Type.STRING },
            fraudRationale: { type: Type.STRING }, verificationStep: { type: Type.STRING },
            dynamicRiskAdjustment: { type: Type.STRING },
        }
    };
    const prompt = `
        **System:** You are the primary Scoring Agent in a Multi-Agent Financial System.
        **Task:** Analyze the comprehensive user profile to generate a multi-dimensional trust score.
        **User Data:** ${JSON.stringify(userData)}
        **Integrated Data Profile:** ${integratedProfile ? JSON.stringify(integratedProfile) : "Not available."}
        **Psychometric Analysis:** ${psychometricAnalysis || "Not available."}
        
        **Instructions:**
        1.  **Scores (300-850):** Calculate a final score and sub-scores for Consistency, Community Trust, and Resilience based on all data.
        2.  **Rationales:** Provide brief explanations.
        3.  **Fraud Risk:** Assess risk ('Low', 'Medium', 'High').
        4.  **Verification Step:** Suggest a practical next step for a human reviewer.
        5.  **Dynamic Adjustment:** Note time-sensitive factors.

        Generate the response in the required JSON format.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });

    const result = JSON.parse(response.text);
    return { ...result, psychometricAnalysis: psychometricAnalysis || undefined };
};

export const generateLoanOptions = async (userData: UserData, scoreData: ScoreData): Promise<LoanOption[]> => {
    const responseSchema = { type: Type.OBJECT, properties: { loans: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, amount: { type: Type.INTEGER }, repayment: { type: Type.STRING }, description: { type: Type.STRING } } } } } };
    const prompt = `Generate 2-3 responsible loan options for a user with a score of ${scoreData.finalScore} who is a ${userData.profession}. Higher scores get slightly better terms. Keep amounts modest. Format as JSON.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return (JSON.parse(response.text)).loans || [];
};

export const getGeospatialAnalysis = async (location: string, profession: string, pincode: string): Promise<GeospatialAnalysis | null> => {
    if (!profession.toLowerCase().includes('farmer')) return { prospectiveYieldScore: 0, rationale: "N/A for non-agricultural professions." };
    
    const responseSchema = { type: Type.OBJECT, properties: { prospectiveYieldScore: { type: Type.INTEGER }, rationale: { type: Type.STRING } } };
    const prompt = `As a Geospatial Analyst, analyze agricultural prospects for a farmer in ${location} (${pincode}). Provide a prospective yield score (1-100) and a brief rationale. Use general knowledge of Indian climate. Format as JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const analyzePsychometricResponses = async (responses: { [key: string]: string }): Promise<string> => {
    const prompt = `As a Psychometric Analyst, analyze these responses: ${JSON.stringify(responses)}. Provide a one-sentence summary of the user's financial personality (e.g., cautious planner, risk-tolerant).`;
    
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const getRagExplanation = async (scoreData: ScoreData): Promise<string> => {
    const knowledge = retrieveKnowledge(`explain my score of ${scoreData.finalScore}`);
    const prompt = `You are Coach Mitra, a helpful AI. Explain the user's score based on this context: "${knowledge.content}". User's score rationale: "${scoreData.scoreRationale}". Keep it simple and encouraging.`;
    
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const simulateScoreChange = async (scoreData: ScoreData, scenario: string): Promise<ScoreSimulation> => {
    const responseSchema = { type: Type.OBJECT, properties: { newScore: { type: Type.INTEGER }, rationale: { type: Type.STRING } } };
    const prompt = `A user with a score of ${scoreData.finalScore} considers this action: "${scenario}". Predict the new score (300-850) and provide a brief rationale. Format as JSON.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const getScoreDeepDive = async (scoreData: ScoreData): Promise<string> => {
    const prompt = `Provide a more detailed, but still simple, explanation for this score: ${JSON.stringify(scoreData)}. Explain how the sub-scores contributed to the final score.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const generateVouchingSms = async (userData: UserData): Promise<string> => {
    const prompt = `Create a brief, professional SMS message for ${userData.name} to send to their community reference for verification. It should be polite and clear.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const getPersonalizedActionableInsight = async (userData: UserData, scoreData: ScoreData): Promise<string> => {
    const prompt = `Based on this user profile (${JSON.stringify(userData)}) and score (${JSON.stringify(scoreData)}), provide a single, highly specific, and actionable tip for them to improve their financial health.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const getConversationStarters = async (loan: SelectedLoan): Promise<string[]> => {
    const responseSchema = { type: Type.OBJECT, properties: { starters: { type: Type.ARRAY, items: { type: Type.STRING } } } };
    const prompt = `Generate 3 diverse and relevant conversation starters for a chatbot user who has a "${loan.name}" loan. Format as a JSON object with a "starters" array.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return (JSON.parse(response.text)).starters || [];
};

export const analyzeUserFeedback = async (feedback: string): Promise<FeedbackAnalysis> => {
    const responseSchema = { type: Type.OBJECT, properties: { category: { type: Type.STRING }, sentiment: { type: Type.STRING }, summary: { type: Type.STRING } } };
    const prompt = `Analyze this user feedback: "${feedback}". Determine the sentiment (Positive, Negative, Neutral), categorize it (e.g., UI/UX, Loan Terms, AI Coach), and provide a one-sentence summary. Format as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const analyzeBudget = async (budgetText: string): Promise<BudgetCategory[]> => {
    const responseSchema = { type: Type.OBJECT, properties: { budget: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, amount: { type: Type.INTEGER } } } } } };
    const prompt = `Analyze this text describing expenses: "${budgetText}". Extract each category and its amount. Return a JSON object with a "budget" array.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return (JSON.parse(response.text)).budget || [];
};

export const getFinancialLiteracyTip = async (userData: UserData): Promise<string> => {
    const prompt = `Provide a short, relevant financial literacy tip for a ${userData.profession} in India.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const createSavingsPlan = async (goal: string, amount: number, userData: UserData): Promise<SavingsPlan> => {
    const responseSchema = { type: Type.OBJECT, properties: { goal: { type: Type.STRING }, amount: { type: Type.INTEGER }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } } } };
    const prompt = `Create a simple, 3-step savings plan for a ${userData.profession} who wants to save ${amount} for "${goal}". Format as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const analyzeFinancialDiaryEntry = async (transcript: string): Promise<{ summary: string; sentiment: 'Positive' | 'Negative' | 'Neutral' }> => {
    const responseSchema = { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, sentiment: { type: Type.STRING } } };
    const prompt = `Analyze this financial diary entry: "${transcript}". Provide a one-sentence summary and the overall sentiment (Positive, Negative, Neutral). Format as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const getReschedulingOptions = async (crisisDescription: string, loan: SelectedLoan): Promise<{ intro: string; options: string[] }> => {
    const responseSchema = { type: Type.OBJECT, properties: { intro: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } } } };
    const prompt = `A user with a loan of ${loan.amount} is facing a crisis: "${crisisDescription}". Suggest 2-3 helpful, realistic loan rescheduling options (e.g., payment pause, reduced EMI). Provide a brief introductory sentence and an array of options. Format as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};

export const generateReminderMessage = async (userData: UserData, loan: SelectedLoan): Promise<string> => {
    const prompt = `Create a friendly, encouraging reminder message for ${userData.name} about their loan payment for "${loan.name}".`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
};

export const predictiveInterventionCheck = async (diaryEntries: DiaryEntry[]): Promise<PredictiveIntervention> => {
    if (diaryEntries.filter(e => e.sentiment === 'Negative').length < 2) {
        return { needsHelp: false, suggestion: '' };
    }
    const responseSchema = { type: Type.OBJECT, properties: { needsHelp: { type: Type.BOOLEAN }, suggestion: { type: Type.STRING } } };
    const prompt = `Analyze these recent diary entries: ${JSON.stringify(diaryEntries)}. If there is a persistent negative trend, set needsHelp to true and provide a proactive, gentle suggestion for the user. Otherwise, set needsHelp to false. Format as JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema }
    });
    return JSON.parse(response.text);
};
