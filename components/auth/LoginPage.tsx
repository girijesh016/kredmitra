import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (mobileOrEmail: string, pass: string, isAdminLogin: boolean) => boolean;
    switchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, switchToSignUp }) => {
    const [mobileOrEmail, setMobileOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!mobileOrEmail || !password) {
            setError('All fields are required.');
            return;
        }

        const success = onLogin(mobileOrEmail, password, isAdminLogin);
        if (!success) {
            setError(`Invalid ${isAdminLogin ? 'email' : 'mobile number'} or password.`);
        }
    };
    
    const handleToggleAdminLogin = () => {
        setIsAdminLogin(!isAdminLogin);
        setError('');
        setMobileOrEmail('');
        setPassword('');
    }

    return (
        <div className="bg-white/60 p-8 rounded-2xl shadow-lg border border-slate-200/80 max-w-md mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
                {isAdminLogin ? 'Admin Login' : 'Welcome Back!'}
            </h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {isAdminLogin ? 'Email Address' : 'Mobile Number'}
                    </label>
                    <input 
                        type={isAdminLogin ? 'email' : 'tel'}
                        value={mobileOrEmail} 
                        onChange={e => setMobileOrEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                        required 
                        placeholder={isAdminLogin ? 'Enter admin email' : 'Enter your 10-digit mobile number'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                        required 
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300">
                    Login
                </button>
            </form>
            <div className="mt-6 text-center">
                 <p className="text-sm text-slate-600">
                    {isAdminLogin ? 'Not an admin?' : "Don't have an account?"}{' '}
                    <button onClick={isAdminLogin ? handleToggleAdminLogin : switchToSignUp} className="font-medium text-teal-600 hover:underline">
                        {isAdminLogin ? 'User Login' : 'Sign Up'}
                    </button>
                </p>
                {!isAdminLogin && (
                    <p className="text-sm text-slate-600 mt-2">
                        Are you an administrator?{' '}
                        <button onClick={handleToggleAdminLogin} className="font-medium text-teal-600 hover:underline">
                            Admin Login
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;