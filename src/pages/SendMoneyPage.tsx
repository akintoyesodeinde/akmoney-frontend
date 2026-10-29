import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StepWizard } from '../components/ui/StepWizard';
import { PinModal } from '../components/common/PinModal';
import { remittanceService } from '../services/remittanceService';
import { recipientService } from '../services/recipientService';
import { Country, DeliveryMethod, DeliveryService, SendMoneyPayload, SendMoneyRecord } from '../types/remittance';
import { Recipient } from '../types/recipient';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Receipt,
  AlertTriangle,
  Building2,
  Smartphone,
  Banknote,
  SendHorizontal,
} from 'lucide-react';

export const SendMoneyPage: React.FC = () => {
  const { wallets, selectedWallet } = useWallet();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Reference data
  const [countries, setCountries] = useState<Country[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [services, setServices] = useState<DeliveryService[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  // Wizard Form State
  const [sourceWalletId, setSourceWalletId] = useState<number>(selectedWallet?.id || 0);
  const [recipientCountryId, setRecipientCountryId] = useState<number>(0);
  const [deliveryMethodId, setDeliveryMethodId] = useState<number>(0);
  const [serviceId, setServiceId] = useState<number>(0);
  const [sendingAmount, setSendingAmount] = useState<number>(100);

  // Recipient info
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [newRecipientName, setNewRecipientName] = useState<string>('');
  const [newRecipientMobile, setNewRecipientMobile] = useState<string>('');
  const [newRecipientAccount, setNewRecipientAccount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('Family Support');
  const [sourceOfFund, setSourceOfFund] = useState<string>('Salary');

  // Security & Submission
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedRecord, setCompletedRecord] = useState<SendMoneyRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const wizardSteps = [
    { id: 1, name: 'Amount & Corridor' },
    { id: 2, name: 'Recipient Details' },
    { id: 3, name: 'Review & Security' },
    { id: 4, name: 'Status & Receipt' },
  ];

  // Load corridors and recipients
  useEffect(() => {
    const initData = async () => {
      try {
        const [cList, rList] = await Promise.all([
          remittanceService.getCountries(),
          recipientService.getRecipients(),
        ]);
        setCountries(cList);
        setRecipients(rList);
        if (cList.length > 0) {
          setRecipientCountryId(cList[0].id);
        }
      } catch (e) {
        console.error('Failed to load corridor data:', e);
      }
    };
    initData();
  }, []);

  // Update delivery methods when recipient country changes
  useEffect(() => {
    if (recipientCountryId > 0) {
      remittanceService.getDeliveryMethods(recipientCountryId).then(setDeliveryMethods);
    }
  }, [recipientCountryId]);

  // Sync source wallet selection
  useEffect(() => {
    if (selectedWallet && !sourceWalletId) {
      setSourceWalletId(selectedWallet.id);
    }
  }, [selectedWallet, sourceWalletId]);

  const activeSourceWallet = wallets.find((w) => w.id === Number(sourceWalletId)) || wallets[0];
  const activeRecipientCountry = countries.find((c) => c.id === Number(recipientCountryId));

  // Authoritative dynamic calculation
  const fxRate = activeRecipientCountry ? parseFloat(activeRecipientCountry.rate || '1') : 1;
  const fixedFee = 2.50;
  const percentFee = (sendingAmount * 0.01);
  const totalFee = fixedFee + percentFee;
  const totalDebit = sendingAmount + totalFee;
  const recipientAmount = sendingAmount * fxRate;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (sendingAmount <= 0) {
      setErrorMessage('Sending amount must be greater than zero');
      return;
    }
    if (activeSourceWallet && parseFloat(activeSourceWallet.balance) < totalDebit) {
      setErrorMessage(`Insufficient wallet balance. Total required: ${totalDebit.toFixed(2)} ${activeSourceWallet.currency}`);
      return;
    }
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedRecipientId && (!newRecipientName || !newRecipientMobile)) {
      setErrorMessage('Please select a saved recipient or fill in the new recipient details');
      return;
    }
    setCurrentStep(3);
  };

  const handleExecuteTransfer = (pin: string) => {
    setIsSubmitting(true);
    setErrorMessage('');

    const payload: SendMoneyPayload = {
      sending_country_id: activeSourceWallet?.country_id || 1,
      recipient_country_id: recipientCountryId,
      delivery_method_id: deliveryMethodId || 1,
      service_id: serviceId || undefined,
      recipient_id: selectedRecipientId || undefined,
      recipient_name: newRecipientName || undefined,
      recipient_mobile: newRecipientMobile || undefined,
      recipient_account: newRecipientAccount || undefined,
      payment_type: 1, // Funded via wallet
      wallet_id: activeSourceWallet?.id,
      sending_amount: sendingAmount,
      pin,
      purpose,
      source_of_fund: sourceOfFund,
    };

    remittanceService
      .sendMoney(payload)
      .then((res) => {
        setCompletedRecord(res.send_money);
        setCurrentStep(4);
      })
      .catch((err) => {
        const msg = err.response?.data?.message?.error?.[0] || err.message || 'Transfer initiation failed';
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Send International Remittance</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Send funds directly to mobile money, bank accounts, or cash pickup.
        </p>
      </div>

      <StepWizard steps={wizardSteps} currentStep={currentStep} />

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STAGE 1: AMOUNT & CORRIDOR */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep1} className="space-y-5">
          <Card variant="white" padding="md">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">1. Transfer Corridors</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  You Send From (Wallet)
                </label>
                <select
                  value={sourceWalletId}
                  onChange={(e) => setSourceWalletId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white focus:border-[#00D4B2] focus:ring-2 focus:ring-[#00D4B2]/20"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.currency} Wallet (Bal: {parseFloat(w.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Recipient Country
                </label>
                <select
                  value={recipientCountryId}
                  onChange={(e) => setRecipientCountryId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white focus:border-[#00D4B2] focus:ring-2 focus:ring-[#00D4B2]/20"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card variant="white" padding="md">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">2. Transfer Amount & Live Calculation</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Send Amount ({activeSourceWallet?.currency || 'CAD'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={sendingAmount}
                    onChange={(e) => setSendingAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-2xl font-bold p-3 rounded-lg border border-slate-300 focus:border-[#00D4B2] focus:ring-2 focus:ring-[#00D4B2]/20 tabular-nums"
                  />
                  <span className="absolute right-3.5 top-4 text-xs font-bold text-slate-500">
                    {activeSourceWallet?.currency || 'CAD'}
                  </span>
                </div>
              </div>

              {/* Live Fee & Rate Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Guaranteed Exchange Rate</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    1 {activeSourceWallet?.currency || 'CAD'} = {fxRate.toFixed(4)} {activeRecipientCountry?.currency || 'XOF'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transfer Fee (Fixed + 1%)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    + {totalFee.toFixed(2)} {activeSourceWallet?.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total To Be Debited</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {totalDebit.toFixed(2)} {activeSourceWallet?.currency}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Recipient Receives</span>
                  <span className="text-base font-extrabold text-emerald-600 tabular-nums">
                    {recipientAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {activeRecipientCountry?.currency || 'XOF'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="mint" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Recipient
            </Button>
          </div>
        </form>
      )}

      {/* STAGE 2: RECIPIENT DETAILS */}
      {currentStep === 2 && (
        <form onSubmit={handleNextStep2} className="space-y-5">
          <Card variant="white" padding="md">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Select or Add Beneficiary</h3>

            {recipients.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-2">
                  Saved Beneficiaries
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recipients.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRecipientId(r.id);
                        setNewRecipientName('');
                        setNewRecipientMobile('');
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedRecipientId === r.id
                          ? 'border-[#00D4B2] bg-[#00D4B2]/10 ring-2 ring-[#00D4B2]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold text-slate-900">{r.name}</span>
                      <span className="block text-[11px] text-slate-500">{r.mobile} • {r.country_name || 'Destination'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-semibold uppercase text-slate-700 mb-3">
                {recipients.length > 0 ? 'Or Enter New Recipient Details' : 'Recipient Information'}
              </span>

              <div className="space-y-3">
                <Input
                  label="Recipient Full Legal Name"
                  type="text"
                  value={newRecipientName}
                  onChange={(e) => {
                    setNewRecipientName(e.target.value);
                    setSelectedRecipientId(null);
                  }}
                  placeholder="e.g. Amadou Diallo"
                  required={!selectedRecipientId}
                />

                <Input
                  label="Recipient Mobile Phone (for notification / Mobile Money)"
                  type="tel"
                  value={newRecipientMobile}
                  onChange={(e) => {
                    setNewRecipientMobile(e.target.value);
                    setSelectedRecipientId(null);
                  }}
                  placeholder="+221 77 123 4567"
                  required={!selectedRecipientId}
                />

                <Input
                  label="Bank Account / Mobile Money Identifier (Optional)"
                  type="text"
                  value={newRecipientAccount}
                  onChange={(e) => setNewRecipientAccount(e.target.value)}
                  placeholder="Account Number / Orange Money / MTN MoMo"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Transfer Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  <option value="Family Support">Family Support</option>
                  <option value="Education">Education / Tuition</option>
                  <option value="Medical">Medical Expenses</option>
                  <option value="Business">Business / Commercial Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Source of Funds
                </label>
                <select
                  value={sourceOfFund}
                  onChange={(e) => setSourceOfFund(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  <option value="Salary">Salary / Employment Earnings</option>
                  <option value="Savings">Personal Savings</option>
                  <option value="Business Income">Business Income</option>
                  <option value="Gift">Family Gift</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button type="submit" variant="mint" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Review Transfer
            </Button>
          </div>
        </form>
      )}

      {/* STAGE 3: REVIEW & PIN CHALLENGE */}
      {currentStep === 3 && (
        <div className="space-y-5">
          <Card variant="white" padding="md">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Review Transfer Summary</h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">From Wallet</span>
                <span className="font-semibold text-slate-900">
                  {activeSourceWallet?.currency} Wallet (Balance: {parseFloat(activeSourceWallet?.balance || '0').toFixed(2)})
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Destination</span>
                <span className="font-semibold text-slate-900">
                  {activeRecipientCountry?.name} ({activeRecipientCountry?.currency})
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Recipient</span>
                <span className="font-semibold text-slate-900">
                  {selectedRecipientId ? recipients.find(r => r.id === selectedRecipientId)?.name : newRecipientName} ({newRecipientMobile || 'Mobile'})
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Send Amount</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {sendingAmount.toFixed(2)} {activeSourceWallet?.currency}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Platform Fees</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {totalFee.toFixed(2)} {activeSourceWallet?.currency}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Total Debit</span>
                <span className="font-extrabold text-[#0A2540] tabular-nums text-sm">
                  {totalDebit.toFixed(2)} {activeSourceWallet?.currency}
                </span>
              </div>
              <div className="py-3 flex justify-between items-center bg-emerald-50/60 -mx-6 px-6">
                <span className="font-bold text-slate-900">Recipient Payout</span>
                <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                  {recipientAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {activeRecipientCountry?.currency}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setCurrentStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              type="button"
              variant="mint"
              size="lg"
              isLoading={isSubmitting}
              onClick={() => setIsPinModalOpen(true)}
              icon={<Lock className="w-4 h-4" />}
            >
              Authorize & Send
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 4: STATUS & RECEIPT */}
      {currentStep === 4 && completedRecord && (
        <Card variant="white" padding="lg" className="text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">Transfer Initiated & Funded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your transfer of <span className="font-semibold text-slate-800">{completedRecord.sending_amount} {completedRecord.sending_currency}</span> is being processed for dispatch to the recipient.
          </p>

          {/* MTCN Callout */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left min-w-[280px]">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Transfer Tracking Code (MTCN)
            </span>
            <span className="block text-2xl font-mono font-bold text-[#0A2540] tracking-widest mt-0.5">
              {completedRecord.mtcn_number}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Transaction Ref: {completedRecord.trx}
            </span>
          </div>

          {/* Delivery steps */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-left space-y-3 mb-6">
            <div className="flex items-center gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span className="font-medium text-slate-800">Transfer Submitted & Wallet Debited</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span className="font-medium text-slate-800">AML & Sanctions Screening Cleared</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-bold animate-pulse">⏳</span>
              <span className="font-medium text-slate-800">Dispatching to Payout Network ({completedRecord.recipient_currency})</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentStep(1);
                setCompletedRecord(null);
              }}
              icon={<SendHorizontal className="w-4 h-4" />}
            >
              Send Another Transfer
            </Button>
            <Button
              variant="mint"
              onClick={() => window.print()}
              icon={<Receipt className="w-4 h-4" />}
            >
              Print Receipt
            </Button>
          </div>
        </Card>
      )}

      {/* PIN Verification Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleExecuteTransfer}
        title="Confirm Remittance"
        description={`Authorizing transfer of ${sendingAmount.toFixed(2)} ${activeSourceWallet?.currency || 'CAD'} to ${newRecipientName || 'beneficiary'}.`}
      />
    </div>
  );
};
