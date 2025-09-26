export interface KnowledgeDocument {
  id: string;
  title: string;
  keywords: string[];
  content: string;
}

export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: 'RBI-FLP-001',
    title: 'RBI Fair Lending Practices',
    keywords: ['fair', 'lending', 'rbi', 'guidelines', 'inclusive', 'score', 'scoring', 'rules'],
    content: "The Reserve Bank of India's Fair Lending Practices Code emphasizes that lending decisions should be based on a holistic assessment of a borrower's repayment capacity. This includes considering alternative data sources beyond traditional credit history, especially for new-to-credit customers. The goal is to ensure non-discriminatory and transparent lending practices that promote financial inclusion."
  },
  {
    id: 'DPDPA-2023-Summary',
    title: 'Data Privacy (DPDPA 2023)',
    keywords: ['data', 'privacy', 'secure', 'safe', 'permission', 'consent', 'dpdpa', 'share'],
    content: "The Digital Personal Data Protection Act, 2023, grants individuals control over their personal data. For financial services, this means your data can only be collected with explicit consent for a specific purpose (like calculating a loan score). It must be kept secure, and you have the right to know how it's used. Your data is not shared with third parties without your permission."
  },
  {
    id: 'AF-Coach-Role',
    title: 'AI Coach Mitra Principles',
    keywords: ['coach', 'help', 'tips', 'advice', 'support', 'mitra'],
    content: "Coach Mitra's role is to provide educational support and guidance. This includes offering personalized savings tips, explaining financial concepts in simple terms, and sending encouraging reminders. The coach does not give direct financial advice but empowers users to make informed decisions. All interactions are aimed at improving the user's long-term financial wellness."
  }
];

// Simple keyword-based retrieval function
export const retrieveKnowledge = (query: string): KnowledgeDocument => {
    const queryWords = query.toLowerCase().split(/\s+/);
    let bestMatch = knowledgeBase[0]; // Default fallback
    let maxScore = 0;

    for (const doc of knowledgeBase) {
        let currentScore = 0;
        for (const keyword of doc.keywords) {
            if (queryWords.some(qw => qw.includes(keyword) || keyword.includes(qw))) {
                currentScore++;
            }
        }
        if (currentScore > maxScore) {
            maxScore = currentScore;
            bestMatch = doc;
        }
    }

    // If no keywords matched, return a general document (e.g., privacy) as a safe default.
    if (maxScore === 0 && query.includes('data')) {
        return knowledgeBase.find(doc => doc.id === 'DPDPA-2023-Summary') || bestMatch;
    }
     if (maxScore === 0) {
        return knowledgeBase.find(doc => doc.id === 'RBI-FLP-001') || bestMatch;
    }


    return bestMatch;
};
