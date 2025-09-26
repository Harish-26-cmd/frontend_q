
import React from 'react';
import { 
    DashboardIcon, 
    QueueManagementIcon, 
    StaffManagementIcon, 
    ServiceManagementIcon, 
    AIModelIcon, 
    ReportsIcon, 
    NotificationsIcon, 
    BranchManagementIcon, 
    SettingsIcon 
} from './icons';

type AdminView = 'dashboard' | 'staffManagement' | 'queueManagement' | 'serviceManagement';

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, onClick, disabled = false }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors w-full text-left ${
            active 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

interface AdminSidebarProps {
    onNavigateAdminView: (view: AdminView) => void;
    currentAdminView: AdminView;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigateAdminView, currentAdminView }) => {
    return (
        <aside className="w-64 bg-slate-900 text-white flex-col hidden lg:flex">
            <div className="p-6 h-20 flex items-center">
                <h1 className="text-lg font-bold leading-tight">AI-Powered<br/>Queue Management System</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1.5">
                <NavLink 
                    icon={<DashboardIcon className="w-6 h-6"/>} 
                    label="Home" 
                    onClick={() => onNavigateAdminView('dashboard')}
                    active={currentAdminView === 'dashboard'}
                />
                <NavLink 
                    icon={<QueueManagementIcon className="w-6 h-6"/>} 
                    label="Queue Management" 
                    onClick={() => onNavigateAdminView('queueManagement')}
                    active={currentAdminView === 'queueManagement'}
                />
                <NavLink 
                    icon={<StaffManagementIcon className="w-6 h-6"/>} 
                    label="Staff Management" 
                    onClick={() => onNavigateAdminView('staffManagement')}
                    active={currentAdminView === 'staffManagement'}
                />
                <NavLink 
                    icon={<ServiceManagementIcon className="w-6 h-6"/>} 
                    label="Service Management" 
                    onClick={() => onNavigateAdminView('serviceManagement')}
                    active={currentAdminView === 'serviceManagement'}
                />
                <NavLink icon={<AIModelIcon className="w-6 h-6"/>} label="AI Model" disabled />
                <NavLink icon={<ReportsIcon className="w-6 h-6"/>} label="Reports" disabled />
                <NavLink icon={<NotificationsIcon className="w-6 h-6"/>} label="Notifications" disabled />
                <NavLink icon={<BranchManagementIcon className="w-6 h-6"/>} label="Branch Management" disabled />
            </nav>
            <div className="px-4 py-4">
                 <NavLink icon={<SettingsIcon className="w-6 h-6"/>} label="Settings" disabled />
            </div>
        </aside>
    );
}

export default AdminSidebar;