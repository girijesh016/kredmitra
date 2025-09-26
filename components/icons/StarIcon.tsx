
import React from 'react';

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.321h5.365c.527 0 .748.684.362 1.005l-4.218 3.233a.563.563 0 0 0-.19.518l1.58 5.345a.562.562 0 0 1-.815.61l-4.522-2.914a.563.563 0 0 0-.585 0l-4.522 2.914a.562.562 0 0 1-.815-.61l1.58-5.345a.563.563 0 0 0-.19-.518l-4.218-3.233a.563.563 0 0 1 .362-1.005h5.365a.563.563 0 0 0 .475-.321L11.48 3.5Z" />
    </svg>
);
