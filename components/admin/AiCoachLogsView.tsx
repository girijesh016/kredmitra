import React, { useState, useMemo } from 'react';
import { UserIcon } from '../icons/UserIcon';

interface AiCoachLogsViewProps {
    users: any[];
}

const AiCoachLogsView: React.FC<AiCoachLogsViewProps> = ({ users }) => {
    const [selectedUserMobile, setSelectedUserMobile] = useState<string | null>(null);

    const usersWithChat = useMemo(() => {
        return users.filter(u => u.chatHistory && u.chatHistory.length > 0);
    }, [users]);

    const selectedUser = useMemo(() => {
        return usersWithChat.find(u => u.mobile === selectedUserMobile);
    }, [usersWithChat, selectedUserMobile]);
    
    // Select the first user by default if one exists
    useState(() => {
        if(usersWithChat.length > 0 && !selectedUserMobile) {
            setSelectedUserMobile(usersWithChat[0].mobile);
        }
    });

    return (
        <div className="bg-slate-800 rounded-2xl p-6 animate-fade-in h-[calc(100vh-6rem)] flex gap-6">
            <div className="w-1/3 border-r border-slate-700 pr-6 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4">Conversation Logs</h2>
                <div className="flex-grow overflow-y-auto">
                    <ul className="space-y-2">
                        {usersWithChat.map(user => (
                            <li key={user.mobile}>
                                <button
                                    onClick={() => setSelectedUserMobile(user.mobile)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedUserMobile === user.mobile ? 'bg-teal-600/20 text-teal-300' : 'hover:bg-slate-700/50'}`}
                                >
                                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-slate-400">{user.mobile}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <h3 className="text-lg font-bold text-white mb-4">
                            Chat History for {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <div className="flex-grow bg-slate-900/50 rounded-lg p-4 overflow-y-auto space-y-4">
                            {selectedUser.chatHistory.map((msg: any, index: number) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">🤖</div>}
                                    <div className={`max-w-md p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-teal-700 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 text-slate-300 flex items-center justify-center flex-shrink-0 shadow-md"><UserIcon className="w-5 h-5" /></div>}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">Select a user to view their chat history.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiCoachLogsView;