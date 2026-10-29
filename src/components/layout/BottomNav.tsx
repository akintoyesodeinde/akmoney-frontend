import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, SendHorizontal, WalletCards, Users, ReceiptText } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/wallets', label: 'Wallets', icon: <WalletCards className="w-5 h-5" /> },
    { to: '/send-money', label: 'Send', icon: <SendHorizontal className="w-6 h-6 text-[#0A2540]" />, isFab: true },
    { to: '/recipients', label: 'Recipients', icon: <Users className="w-5 h-5" /> },
    { to: '/transactions', label: 'Activity', icon: <ReceiptText className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-3 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) =>
        item.isFab ? (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center -mt-5 bg-[#00D4B2] hover:bg-[#00B89A] w-12 h-12 rounded-full shadow-md text-[#0A2540] transition-transform active:scale-95"
          >
            {item.icon}
          </NavLink>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#00D4B2] font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            <span className="mt-0.5">{item.label}</span>
          </NavLink>
        )
      )}
    </nav>
  );
};
