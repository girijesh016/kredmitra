interface TestUser {
    name: string;
    aadhaar: string;
    phone: string;
    accountNumber: string;
}

const testDB: TestUser[] = [
    {
        name: "Ramesh Kumar",
        aadhaar: "123412341234",
        phone: "9876543210",
        accountNumber: "112233445566"
    },
    {
        name: "Priya Singh",
        aadhaar: "432143214321",
        phone: "9876543211",
        accountNumber: "998877665544"
    }
];

export const verifyUserInTestDB = (name: string, aadhaar: string, phone: string, accountNumber: string): boolean => {
    if (!name || !aadhaar || !phone || !accountNumber) {
        return false;
    }

    return testDB.some(user => 
        user.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        user.aadhaar.trim() === aadhaar.trim() &&
        user.phone.trim() === phone.trim() &&
        user.accountNumber.trim() === accountNumber.trim()
    );
};
