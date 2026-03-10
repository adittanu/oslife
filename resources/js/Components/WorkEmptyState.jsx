import React from 'react';

export default function WorkEmptyState({ icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-gray-300">{icon}</span>
            </div>
            <h3 className="font-handwriting text-2xl font-bold text-gray-600">{title}</h3>
            <p className="font-note text-gray-400 mt-2 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl transition-colors shadow-md"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}