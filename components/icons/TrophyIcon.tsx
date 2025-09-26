
import React from 'react';

export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.375c0 .414-.336.75-.75.75h-13.5a.75.75 0 0 1-.75-.75V12a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v3.375Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 5.25v3.75m-9-3.75v3.75m4.5-11.25V5.25m-2.25 0h4.5v-.75a3.75 3.75 0 0 0-7.5 0v.75h3Z" />
    </svg>
);
