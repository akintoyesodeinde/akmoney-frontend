import React from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-800">
          AkMoney Portal
        </h1>
        {user?.kv === 1 && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00D4B2]"></span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-semibold text-xs">
            {user?.firstname?.[0] || <User className="w-4 h-4" />}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.firstname} {user?.lastname}
          </span>
        </div>
      </div>
    </header>
  );
};
