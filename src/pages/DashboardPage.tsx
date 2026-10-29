import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { remittanceService } from '../services/remittanceService';
import { SendMoneyRecord } from '../types/remittance';
import {
  SendHorizontal,
  ArrowLeftRight,
  PlusCircle,
  Users,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { wallets, defaultWallet } = useWallet();
  const [recentTransfers, setRecentTransfers] = useState<SendMoneyRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await remittanceService.getHistory();
        setRecentTransfers(history.slice(0, 5));
      } catch (e) {
        console.error('Failed to load recent history:', e);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / KYC Prompt */}
      {user && user.kv !== 1 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900">
              Identity Verification Required
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              To comply with FINTRAC and international AML standards and unlock higher transfer limits, please submit your government ID.
            </p>
          </div>
          <Link to="/profile">
            <Button size="sm" variant="secondary" className="border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0">
              Complete KYC
            </Button>
          </Link>
        </div>
      )}

      {/* Main Welcome & Balance Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="navy" padding="lg" className="lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Estimated Total Balance
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                {defaultWallet ? Number(defaultWallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
              <span className="text-lg font-semibold text-[#00D4B2]">
                {defaultWallet?.currency || 'CAD'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#00D4B2]" />
              Active multi-currency accounts across {wallets.length} currencies
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-wrap gap-2.5 relative z-10">
            <Link to="/send-money">
              <Button variant="mint" size="md" icon={<SendHorizontal className="w-4 h-4" />}>
                Send Money
              </Button>
            </Link>
            <Link to="/wallets">
              <Button variant="secondary" size="md" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700" icon={<ArrowLeftRight className="w-4 h-4" />}>
                Exchange FX
              </Button>
            </Link>
            <Link to="/wallets">
              <Button variant="secondary" size="md" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700" icon={<PlusCircle className="w-4 h-4" />}>
                Add Money
              </Button>
            </Link>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00D4B2]/10 rounded-full blur-3xl pointer-events-none" />
        </Card>

        {/* Quick Transfer Actions */}
        <Card variant="white" padding="md" className="flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/send-money"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#00D4B2] hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <SendHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 group-hover:text-[#0A2540]">
                      International Remittance
                    </span>
                    <span className="block text-[11px] text-slate-500">To Africa, Europe & Asia</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/recipients"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#00D4B2] hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 group-hover:text-[#0A2540]">
                      Manage Beneficiaries
                    </span>
                    <span className="block text-[11px] text-slate-500">Saved banks & mobile money</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/transactions"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#00D4B2] hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 group-hover:text-[#0A2540]">
                      Download Receipts
                    </span>
                    <span className="block text-[11px] text-slate-500">PDF statements & proof</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Multi-Currency Balances Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 text-sm">Your Wallets</h3>
          <Link to="/wallets" className="text-xs text-[#635BFF] hover:underline font-medium">
            View All Wallets ({wallets.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              Loading active wallets...
            </div>
          ) : (
            wallets.slice(0, 4).map((wallet) => (
              <Card key={wallet.id} variant="white" padding="sm" className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    {wallet.currency}
                  </span>
                  {wallet.is_default === 1 && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {Number(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Available balance
                </span>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Recent Remittances List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Remittances</h3>
          <Link to="/transactions" className="text-xs text-[#635BFF] hover:underline font-medium">
            Full Activity Log →
          </Link>
        </div>

        <Card variant="white" padding="none" className="overflow-hidden">
          {isLoadingHistory ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading transfers...</div>
          ) : recentTransfers.length === 0 ? (
            <div className="py-12 text-center">
              <SendHorizontal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No recent remittances found.</p>
              <Link to="/send-money" className="mt-3 inline-block">
                <Button size="sm" variant="mint">Send Your First Transfer</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransfers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-900">
                        {item.recipient_name || 'International Transfer'}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        MTCN: <span className="font-mono">{item.mtcn_number}</span> • {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-900 tabular-nums">
                      - {Number(item.sending_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {item.sending_currency}
                    </span>
                    <div className="mt-1 flex justify-end">
                      <Badge status={item.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
