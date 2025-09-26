import { TelecomFeatures, UtilityFeatures, BankingFeatures, GeospatialFeatures } from "../types";

export const extractTelecomFeatures = (decryptedData: any): TelecomFeatures => {
    const { simAgeDays, rechargeHistory, dataUsageMb } = decryptedData;

    // SimStability: Score between 0 and 1, maxing out at 3 years (1095 days)
    const simStabilityScore = Math.min(simAgeDays / 1095, 1);

    // RechargeConsistency: Score based on the variance of recharge amounts
    const avgRecharge = rechargeHistory.reduce((a: number, b: number) => a + b, 0) / rechargeHistory.length;
    const variance = rechargeHistory.reduce((a: number, b: number) => a + Math.pow(b - avgRecharge, 2), 0) / rechargeHistory.length;
    const stdDev = Math.sqrt(variance);
    const rechargeConsistency = Math.max(1 - (stdDev / avgRecharge), 0);

    // DataUsageProfile
    let dataUsageProfile: 'Low' | 'Medium' | 'High' = 'Low';
    if (dataUsageMb > 20000) dataUsageProfile = 'High';
    else if (dataUsageMb > 10000) dataUsageProfile = 'Medium';

    return { simStabilityScore, rechargeConsistency, dataUsageProfile };
};

export const extractUtilityFeatures = (decryptedData: any): UtilityFeatures => {
    const { paymentHistory, activeServices } = decryptedData;

    // PaymentDiscipline: Score based on on-time payments
    const onTimePayments = paymentHistory.filter((p: string) => p === 'PAID_ON_TIME').length;
    const paymentDisciplineScore = onTimePayments / paymentHistory.length;

    return { paymentDisciplineScore, activeServices };
};

export const extractBankingFeatures = (decryptedData: any): BankingFeatures => {
    const { transactions } = decryptedData;
    const credits = transactions.filter((t: any) => t.type === 'CREDIT');
    const debits = transactions.filter((t: any) => t.type === 'DEBIT');

    // IncomePredictability: Based on regularity of credits
    const incomePredictability = credits.length >= 2 ? 0.8 : 0.4; // Simple simulation

    // SavingsCapacity: Based on net flow
    const totalCredit = credits.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalDebit = debits.reduce((sum: number, t: any) => sum + t.amount, 0);
    const savingsCapacity = totalCredit > 0 ? Math.max((totalCredit - totalDebit) / totalCredit, 0) : 0;
    
    const transactionProfile: 'Stable' | 'Volatile' = savingsCapacity > 0.2 ? 'Stable' : 'Volatile';

    return { incomePredictability, savingsCapacity, transactionProfile };
};


export const extractGeospatialFeatures = (decryptedData: any): GeospatialFeatures => {
    const { seasonalOutlook, localEconomicDriver } = decryptedData;

    // EnvironmentalRisk: Lower is better. Positive forecast reduces risk.
    const environmentalRiskScore = seasonalOutlook.toLowerCase().includes('positive') ? 0.25 : 0.75;
    
    // EconomicStability: Higher is better. Diverse economy is more stable.
    const localEconomicStabilityScore = localEconomicDriver.toLowerCase().includes(',') ? 0.8 : 0.5;

    return { ...decryptedData, environmentalRiskScore, localEconomicStabilityScore };
};
