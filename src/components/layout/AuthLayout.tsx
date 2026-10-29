import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D4B2] to-[#635BFF] flex items-center justify-center font-bold text-[#0A2540] text-xl mx-auto shadow-md">
          Ak
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">AkMoney</h2>
        <p className="mt-1 text-sm text-[#00D4B2] font-semibold tracking-wide">
          Global Cross-Border Remittances & Multi-Currency Accounts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
