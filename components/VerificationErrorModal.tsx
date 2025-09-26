import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface VerificationErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationErrorModal: React.FC<VerificationErrorModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                           <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Verification Alert</h3>
                            <p className="text-sm text-gray-500">From: Fraud Detector Agent</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="text-gray-600 space-y-3">
                    <p>Our system was unable to match the details provided against our secure test records. The following fields must correspond to a single verified user profile:</p>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg text-sm">
                        <li>Full Name</li>
                        <li>Aadhaar Number</li>
                        <li>Phone Number</li>
                        <li>Bank Account Number</li>
                    </ul>
                    <p className="font-semibold">Please review your entries for accuracy. For seamless testing, we recommend using one of the "Pre-fill Example" buttons on the form.</p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    >
                        Acknowledge & Retry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationErrorModal;
