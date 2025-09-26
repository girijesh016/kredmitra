import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import UserOverviewTable from './UserOverviewTable';
import DetailedUserView from './DetailedUserView';
import MainDashboardView from './MainDashboardView';
import ReportsView from './ReportsView';
import AiCoachLogsView from './AiCoachLogsView';
import ToastNotification from './ToastNotification';

interface AdminDashboardProps {
    currentUser: any;
}

export type AdminView = 'dashboard' | 'users' | 'detailedUser' | 'reports' | 'aiLogs';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userTrigger, setUserTrigger] = useState(0); // Used to force re-fetch users
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null);


    const fetchUsers = () => {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('kredmitra_user_')) {
                try {
                    const user = JSON.parse(localStorage.getItem(key) || '{}');
                    user.id = key.replace('kredmitra_user_', '');
                    users.push(user);
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        }
        setAllUsers(users);
    };

    useEffect(() => {
        fetchUsers();

        // Listen for storage changes from other tabs/windows
        const handleStorageChange = (event: StorageEvent) => {
           if (event.key && event.key.startsWith('kredmitra_user_')) {
               setUserTrigger(prev => prev + 1);
           }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [userTrigger, currentUser]);

    const showToast = (message: string) => {
        setToast({ message, id: Date.now() });
        setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
    };
    
    const updateUserRecord = (mobile: string, updates: Partial<any>) => {
        const userKey = `kredmitra_user_${mobile}`;
        try {
            const storedUser = localStorage.getItem(userKey);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const updatedUser = { ...user, ...updates };
                localStorage.setItem(userKey, JSON.stringify(updatedUser));
                setUserTrigger(prev => prev + 1); // Trigger a re-fetch and re-render
            }
        } catch (e) {
            console.error("Failed to update user record in localStorage", e);
        }
    };


    const handleViewUser = (userId: string) => {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setActiveView('detailedUser');
        }
    };
    
    const handleBackToDashboard = () => {
        setSelectedUser(null);
        setActiveView('users'); // Go back to the user list, not main dash
    }

    const renderMainContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <MainDashboardView users={allUsers} updateUserRecord={updateUserRecord} showToast={showToast} />;
            case 'users':
                return <UserOverviewTable users={allUsers} onViewUser={handleViewUser} />;
            case 'detailedUser':
                return selectedUser ? <DetailedUserView user={selectedUser} onBack={handleBackToDashboard} showToast={showToast} /> : <UserOverviewTable users={allUsers} onViewUser={handleViewUser} />;
            case 'reports':
                return <ReportsView users={allUsers} />;
            case 'aiLogs':
                return <AiCoachLogsView users={allUsers} />;
            default:
                return <MainDashboardView users={allUsers} updateUserRecord={updateUserRecord} showToast={showToast} />;
        }
    }

    return (
        <div className="flex items-start gap-8 -mt-8 -mx-4 relative">
            {toast && <ToastNotification message={toast.message} />}
            <AdminSidebar 
                currentUser={currentUser} 
                activeView={activeView}
                setActiveView={(view) => {
                    setActiveView(view);
                    setSelectedUser(null); // Clear selected user when changing main views
                }}
            />
            <div className="flex-1 min-w-0">
                {renderMainContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;