import React from 'react';

interface ToastNotificationProps {
    message: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message }) => {
    return (
        <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
            role="alert"
        >
            {message}
        </div>
    );
};

export default ToastNotification;