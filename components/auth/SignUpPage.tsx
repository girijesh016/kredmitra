import React, { useState } from 'react';

interface SignUpPageProps {
    onSignUp: (newUser: any) => boolean;
    switchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, switchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !dob || !mobile || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        
        const success = onSignUp({ firstName, lastName, dob, mobile, password });
        if (!success) {
            setError('A user with this mobile number already exists.');
        }
    };

    return (
        <div className="bg-white/60 p-8 rounded-2xl shadow-lg border border-slate-200/80 max-w-md mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Create Your Account</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                    <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').substring(0, 10))} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300">
                    Sign Up
                </button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
                Already have an account?{' '}
                <button onClick={switchToLogin} className="font-medium text-teal-600 hover:underline">
                    Login
                </button>
            </p>
        </div>
    );
};

export default SignUpPage;
