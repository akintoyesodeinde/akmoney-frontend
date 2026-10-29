import React, { useState, useEffect } from 'react';
import { remittanceService } from '../services/remittanceService';
import { walletService } from '../services/walletService';
import { SendMoneyRecord } from '../types/remittance';
import { Transaction } from '../types/transaction';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  ReceiptText,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  X,
  Printer,
  FileCheck,
} from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'remittances' | 'ledger'>('remittances');
  const [remittances, setRemittances] = useState<SendMoneyRecord[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Detail drawer
  const [selectedRecord, setSelectedRecord] = useState<SendMoneyRecord | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [rList, lList] = await Promise.all([
          remittanceService.getHistory(),
          walletService.getTransactions(),
        ]);
        setRemittances(rList);
        setLedgerEntries(lList);
      } catch (e) {
        console.error('Failed to load transaction activity:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredRemittances = remittances.filter((r) => {
    const search = searchTerm.toLowerCase();
    return (
      r.mtcn_number?.toLowerCase().includes(search) ||
      r.trx?.toLowerCase().includes(search) ||
      r.recipient_name?.toLowerCase().includes(search) ||
      r.recipient_currency?.toLowerCase().includes(search)
    );
  });

  const filteredLedger = ledgerEntries.filter((l) => {
    const search = searchTerm.toLowerCase();
    return (
      l.trx?.toLowerCase().includes(search) ||
      l.details?.toLowerCase().includes(search) ||
      l.remark?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Activity & Transaction History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of remittances, wallet conversions, and deposits.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('remittances')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'remittances'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Remittance Transfers ({remittances.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallet Postings ({ledgerEntries.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="white" padding="sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by MTCN, reference code, recipient name, or currency..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#00D4B2]"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Table Content */}
      <Card variant="white" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading activity...</div>
        ) : activeTab === 'remittances' ? (
          filteredRemittances.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400">
              No remittance transfers match your criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRemittances.map((record) => (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {record.recipient_name || 'International Transfer'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {record.mtcn_number}
                        </span>
                      </div>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {new Date(record.created_at).toLocaleString()} • Ref: {record.trx}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-900 tabular-nums">
                      - {Number(record.sending_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.sending_currency}
                    </span>
                    <span className="block text-[11px] text-emerald-600 font-semibold tabular-nums">
                      + {Number(record.recipient_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {record.recipient_currency}
                    </span>
                    <div className="mt-1 flex justify-end">
                      <Badge status={record.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredLedger.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No wallet ledger postings found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLedger.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.trx_type === '+'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.trx_type === '+' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">
                      {tx.details || tx.remark}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-mono">
                      {tx.trx} • {new Date(tx.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`block text-xs font-bold tabular-nums ${
                      tx.trx_type === '+' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.trx_type} {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {tx.currency || ''}
                  </span>
                  <span className="block text-[11px] text-slate-400 tabular-nums">
                    Bal: {Number(tx.post_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Slide-over Detail Modal for Remittance Record */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Transfer Details & Receipt"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {/* MTCN card */}
            <div className="p-4 rounded-xl bg-[#0A2540] text-white text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00D4B2]">
                Tracking Code (MTCN)
              </span>
              <span className="block text-2xl font-mono font-extrabold tracking-widest mt-1">
                {selectedRecord.mtcn_number}
              </span>
              <span className="block text-[11px] text-slate-300 mt-1">
                Reference: {selectedRecord.trx}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge status={selectedRecord.status} />
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-semibold text-slate-900">
                  {new Date(selectedRecord.created_at).toLocaleString()}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Recipient</span>
                <span className="font-semibold text-slate-900">
                  {selectedRecord.recipient_name || 'N/A'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Send Amount</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {Number(selectedRecord.sending_amount).toFixed(2)} {selectedRecord.sending_currency}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Fee / Charge</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {Number(selectedRecord.sending_charge).toFixed(2)} {selectedRecord.sending_currency}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Exchange Rate</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  1 {selectedRecord.sending_currency} = {Number(selectedRecord.rate).toFixed(4)} {selectedRecord.recipient_currency}
                </span>
              </div>
              <div className="py-3 flex justify-between items-center bg-emerald-50/70 -mx-6 px-6">
                <span className="font-bold text-slate-900">Recipient Disbursed</span>
                <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                  {Number(selectedRecord.recipient_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedRecord.recipient_currency}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </Button>
              <Button
                variant="mint"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Official Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
