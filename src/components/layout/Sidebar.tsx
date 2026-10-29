import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  SendHorizontal,
  WalletCards,
  Users,
  ReceiptText,
  UserCheck,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/send-money', label: 'Send Money', icon: <SendHorizontal className="w-5 h-5" /> },
    { to: '/wallets', label: 'Wallets & FX', icon: <WalletCards className="w-5 h-5" /> },
    { to: '/recipients', label: 'Beneficiaries', icon: <Users className="w-5 h-5" /> },
    { to: '/transactions', label: 'Activity & History', icon: <ReceiptText className="w-5 h-5" /> },
    { to: '/profile', label: 'Profile & Security', icon: <UserCheck className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#0A2540] text-white flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00D4B2] to-[#635BFF] flex items-center justify-center font-bold text-[#0A2540] shadow-sm">
          Ak
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white">AkMoney</span>
          <span className="block text-[10px] uppercase font-semibold text-[#00D4B2] tracking-wider">
            Fintech Global
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#00D4B2] text-[#0A2540] font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* KYC / Tier Indicator */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00D4B2]" />
          <span className="text-xs font-semibold text-slate-200">
            {user?.kv === 1 ? 'KYC Tier 2 Verified' : 'KYC Verification Pending'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {user?.kv === 1
            ? 'Full global limits enabled'
            : 'Verify your ID to increase limits'}
        </p>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-xs text-white shrink-0">
            {user?.firstname?.[0] || 'A'}
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold text-white truncate">
              {user?.firstname} {user?.lastname}
            </span>
            <span className="block text-[10px] text-slate-400 truncate">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
