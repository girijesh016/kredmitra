// Simple Caesar cipher for light obfuscation
const caesarCipher = (str: string, shift: number, encode = true) => {
  const s = encode ? shift : -shift;
  return str.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // Uppercase letters
      return String.fromCharCode(((code - 65 + s) % 26 + 26) % 26 + 65);
    }
    if (code >= 97 && code <= 122) { // Lowercase letters
      return String.fromCharCode(((code - 97 + s) % 26 + 26) % 26 + 97);
    }
    return char;
  }).join('');
};

// Simulate encryption by combining JSON stringification, cipher, and Base64 encoding
export const encrypt = (data: object): string => {
  try {
    const jsonString = JSON.stringify(data);
    const ciphered = caesarCipher(jsonString, 5);
    return btoa(ciphered);
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

// Simulate decryption by reversing the process
export const decrypt = (encryptedString: string): any => {
  try {
    const deciphered = atob(encryptedString);
    const originalString = caesarCipher(deciphered, 5, false);
    return JSON.parse(originalString);
  } catch (e) {
    console.error("Decryption failed for string:", encryptedString, e);
    return null;
  }
};

// --- MOCK DATABASES ---

const testUserId = '123412341234'; // Matches the prefill Aadhaar for easy testing
const testPincode = '413521';

export const encryptedTelecomData = [
    {
        userId: testUserId,
        encryptedPayload: encrypt({
            simAgeDays: 1250,
            rechargeHistory: [499, 499, 299, 499, 299, 499], // 6 months
            dataUsageMb: 15000,
        })
    }
];

export const encryptedUtilityData = [
    {
        userId: testUserId,
        encryptedPayload: encrypt({
            provider: 'Maharashtra State Electricity Distribution Co. Ltd.',
            paymentHistory: ['PAID_ON_TIME', 'PAID_ON_TIME', 'PAID_LATE', 'PAID_ON_TIME', 'PAID_ON_TIME', 'PAID_ON_TIME'],
            activeServices: 2, // Electricity, Water
        })
    }
];

export const encryptedBankingData = [
    {
        userId: testUserId,
        encryptedPayload: encrypt({
            accountType: 'Savings',
            transactions: [
                { type: 'CREDIT', amount: 8000, desc: 'FARM_SALE' },
                { type: 'DEBIT', amount: 2000, desc: 'SUPPLIES' },
                { type: 'CREDIT', amount: 7500, desc: 'FARM_SALE' },
                { type: 'DEBIT', amount: 3000, desc: 'HOUSEHOLD' },
                { type: 'DEBIT', amount: 1500, desc: 'UTILITY_BILL' },
                { type: 'CREDIT', amount: 500, desc: 'INTEREST' },
            ]
        })
    }
];

export const encryptedReferenceData = [
    {
        userId: testUserId,
        encryptedPayload: encrypt({
            groupName: 'Pragati SHG',
            referenceContact: { name: 'Suresh Patil', relationship: 'Fellow Farmer' }
        })
    }
];

export const encryptedGeospatialData = [
    {
        pincode: testPincode,
        encryptedPayload: encrypt({
            seasonalOutlook: 'Positive Monsoon Forecast',
            demographicProfile: 'Rural, Agriculture-Dominant',
            localEconomicDriver: 'Agriculture (Soybean, Sugarcane)',
            avgIncomeBracket: 'Low-to-Mid',
        })
    },
    {
        pincode: '560001', // Bengaluru
        encryptedPayload: encrypt({
            seasonalOutlook: 'Stable Urban Climate',
            demographicProfile: 'High-density, Mixed-Income Urban',
            localEconomicDriver: 'IT Services, Gig Economy',
            avgIncomeBracket: 'Mid-to-High',
        })
    }
];
