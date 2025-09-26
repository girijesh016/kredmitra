import React from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ReportsIcon } from '../icons/ReportsIcon';
import { UserIcon } from '../icons/UserIcon';
import { AdminView } from './AdminDashboard';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';


interface AdminSidebarProps {
    currentUser: any;
    activeView: string;
    setActiveView: (view: AdminView) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-left ${active ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
        {icon}
        <span className="ml-3 font-medium">{label}</span>
    </button>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentUser, activeView, setActiveView }) => {
    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800 rounded-r-2xl shadow-lg p-6 flex flex-col min-h-[calc(100vh-4rem)]">
            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li><NavItem icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} /></li>
                    <li><NavItem icon={<UsersIcon className="w-5 h-5" />} label="Users" active={activeView === 'users' || activeView === 'detailedUser'} onClick={() => setActiveView('users')} /></li>
                    <li><NavItem icon={<ReportsIcon className="w-5 h-5" />} label="Reports" active={activeView === 'reports'} onClick={() => setActiveView('reports')} /></li>
                    <li><NavItem icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="AI Coach Logs" active={activeView === 'aiLogs'} onClick={() => setActiveView('aiLogs')} /></li>
                </ul>
            </nav>
            <div className="border-t border-slate-700/50 pt-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="ml-3">
                        <p className="font-semibold text-sm text-white">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-slate-400">Lender Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;