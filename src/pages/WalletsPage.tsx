import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PinModal } from '../components/common/PinModal';
import { walletService } from '../services/walletService';
import { Wallet } from '../types/wallet';
import {
  WalletCards,
  ArrowLeftRight,
  PlusCircle,
  Send,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const WalletsPage: React.FC = () => {
  const { wallets, refreshWallets } = useWallet();

  // Exchange modal state
  const [isExchangeOpen, setIsExchangeOpen] = useState<boolean>(false);
  const [fromWalletId, setFromWalletId] = useState<number>(0);
  const [toWalletId, setToWalletId] = useState<number>(0);
  const [exchangeAmount, setExchangeAmount] = useState<number>(100);

  // Transfer modal state
  const [isTransferOpen, setIsTransferOpen] = useState<boolean>(false);
  const [transferWalletId, setTransferWalletId] = useState<number>(0);
  const [receiverIdentifier, setReceiverIdentifier] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(50);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);

  // PIN modal
  const [isPinOpen, setIsPinOpen] = useState<boolean>(false);
  const [pinAction, setPinAction] = useState<'exchange' | 'transfer' | null>(null);

  // Status/feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenExchange = (fromId?: number) => {
    if (fromId) setFromWalletId(fromId);
    else if (wallets[0]) setFromWalletId(wallets[0].id);
    if (wallets[1]) setToWalletId(wallets[1].id);
    setIsExchangeOpen(true);
    setFeedback(null);
  };

  const handleOpenTransfer = (walletId?: number) => {
    if (walletId) setTransferWalletId(walletId);
    else if (wallets[0]) setTransferWalletId(wallets[0].id);
    setReceiverIdentifier('');
    setReceiverName('');
    setIsTransferOpen(true);
    setFeedback(null);
  };

  const handleLookupReceiver = async () => {
    if (!receiverIdentifier.trim()) return;
    setIsLookingUp(true);
    try {
      const res = await walletService.lookupReceiver(receiverIdentifier);
      setReceiverName(res.fullname);
    } catch {
      setReceiverName('');
      setFeedback({ type: 'error', message: 'Recipient account not found. Please verify identifier.' });
    } finally {
      setIsLookingUp(false);
    }
  };

  const executeActionWithPin = async (pin: string) => {
    setIsSubmitting(true);
    try {
      if (pinAction === 'exchange') {
        await walletService.exchange({
          from_wallet_id: fromWalletId,
          to_wallet_id: toWalletId,
          amount: exchangeAmount,
          pin,
        });
        setFeedback({ type: 'success', message: 'Currency exchange completed successfully!' });
        setIsExchangeOpen(false);
      } else if (pinAction === 'transfer') {
        await walletService.transfer({
          sender_wallet_id: transferWalletId,
          receiver_identifier: receiverIdentifier,
          amount: transferAmount,
          pin,
        });
        setFeedback({ type: 'success', message: `Successfully transferred to ${receiverName || receiverIdentifier}!` });
        setIsTransferOpen(false);
      }
      refreshWallets();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedback({ type: 'error', message: err.message || 'Operation failed' });
      } else {
        setFeedback({ type: 'error', message: 'Operation failed' });
      }
    } finally {
      setIsSubmitting(false);
      setPinAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Multi-Currency Digital Wallets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hold, convert, and transfer balances across international fiat currencies.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button variant="mint" size="md" onClick={() => handleOpenExchange()} icon={<ArrowLeftRight className="w-4 h-4" />}>
            Exchange FX
          </Button>
          <Button variant="secondary" size="md" onClick={() => handleOpenTransfer()} icon={<Send className="w-4 h-4" />}>
            Send P2P
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wallets.map((wallet) => (
          <Card key={wallet.id} variant="white" padding="md" className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800">
                    {wallet.currency}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">{wallet.currency} Account</span>
                    <span className="block text-[11px] text-slate-400">
                      {wallet.is_default === 1 ? 'Primary Default' : 'Sub-Account'}
                    </span>
                  </div>
                </div>
                {wallet.is_default === 1 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D4B2]/15 text-[#0A2540]">
                    DEFAULT
                  </span>
                )}
              </div>

              <div className="my-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                  Available Balance
                </span>
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {Number(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="ml-1.5 text-xs font-semibold text-slate-500">{wallet.currency}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs flex-1 text-slate-700"
                onClick={() => handleOpenExchange(wallet.id)}
                icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
              >
                Exchange
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs flex-1 text-slate-700"
                onClick={() => handleOpenTransfer(wallet.id)}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Transfer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Exchange Modal */}
      <Modal isOpen={isExchangeOpen} onClose={() => setIsExchangeOpen(false)} title="Instant Currency Exchange">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              From Wallet
            </label>
            <select
              value={fromWalletId}
              onChange={(e) => setFromWalletId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.currency} (Balance: {parseFloat(w.balance).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              To Wallet
            </label>
            <select
              value={toWalletId}
              onChange={(e) => setToWalletId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
            >
              {wallets
                .filter((w) => w.id !== fromWalletId)
                .map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.currency} (Balance: {parseFloat(w.balance).toFixed(2)})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              Amount to Convert
            </label>
            <input
              type="number"
              min="1"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-xl font-bold p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Rate Lock Duration:</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> 30 seconds guaranteed
              </span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Fee:</span>
              <span className="font-semibold text-slate-900">0.5% (Transparent)</span>
            </div>
          </div>

          <Button
            variant="mint"
            size="lg"
            className="w-full mt-2"
            onClick={() => {
              setPinAction('exchange');
              setIsPinOpen(true);
            }}
          >
            Authorize Exchange
          </Button>
        </div>
      </Modal>

      {/* P2P Transfer Modal */}
      <Modal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} title="Send P2P Balance">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              Debit From Wallet
            </label>
            <select
              value={transferWalletId}
              onChange={(e) => setTransferWalletId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.currency} (Available: {parseFloat(w.balance).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              Receiver Identifier (Username, Email, or Phone)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={receiverIdentifier}
                onChange={(e) => setReceiverIdentifier(e.target.value)}
                placeholder="username or email"
              />
              <Button type="button" variant="secondary" onClick={handleLookupReceiver} isLoading={isLookingUp}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {receiverName && (
              <span className="block text-xs text-emerald-700 font-semibold mt-1">
                Verified Recipient: {receiverName}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              Transfer Amount
            </label>
            <input
              type="number"
              min="1"
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-xl font-bold p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <Button
            variant="mint"
            size="lg"
            className="w-full mt-2"
            onClick={() => {
              setPinAction('transfer');
              setIsPinOpen(true);
            }}
          >
            Authorize Transfer
          </Button>
        </div>
      </Modal>

      {/* Step-up PIN Modal */}
      <PinModal
        isOpen={isPinOpen}
        onClose={() => setIsPinOpen(false)}
        onSuccess={executeActionWithPin}
        title="Authorize Wallet Transaction"
        description="Enter your 4-digit Transaction PIN to confirm this wallet balance mutation."
      />
    </div>
  );
};
