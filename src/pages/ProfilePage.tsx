import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { authService } from '../services/authService';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  // PIN state
  const [pin, setPin] = useState<string>('');
  const [pinConfirmation, setPinConfirmation] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isPinLoading, setIsPinLoading] = useState<boolean>(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isPasswordLoading, setIsPasswordLoading] = useState<boolean>(false);

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== pinConfirmation) {
      setPinError('PIN confirmations do not match');
      return;
    }
    setPinError('');
    setIsPinLoading(true);
    try {
      await authService.setPin(pin, pinConfirmation);
      setPinSuccess('Transaction PIN updated successfully!');
      setPin('');
      setPinConfirmation('');
      refreshUser();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPinError(err.message || 'Failed to update PIN');
      }
    } finally {
      setIsPinLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile & Security Center</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified identity, credentials, 2FA, and transaction security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <Card variant="white" padding="md" className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              Personal Account Information
            </h3>
            <span className="text-xs text-slate-400 font-mono">ID: #{user?.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-slate-400 mb-0.5">Full Name</span>
              <span className="font-semibold text-slate-900">{user?.firstname} {user?.lastname}</span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Username</span>
              <span className="font-semibold text-slate-900">@{user?.username}</span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Email Address</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Mobile Phone</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                {user?.mobile || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Registered Corridor</span>
              <span className="font-semibold text-slate-900">{user?.country_name || 'Canada (CAD)'}</span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Two-Factor Authentication</span>
              <span className="font-semibold text-emerald-600">
                {user?.ts === 1 ? 'Enabled (Google Authenticator)' : 'Standard Verification'}
              </span>
            </div>
          </div>
        </Card>

        {/* KYC Compliance Status */}
        <Card variant="white" padding="md" className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00D4B2]" />
            KYC Verification Tier
          </h3>

          <div className="py-2">
            <Badge status={user?.kv === 1 ? 'COMPLETED' : 'PENDING'} label={user?.kv === 1 ? 'Tier 2 — Verified' : 'Tier 1 — Basic'} />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {user?.kv === 1
              ? 'Your identity documents have been authenticated. You enjoy unlimited daily transfers and full multi-currency exchange access.'
              : 'Submit your national ID or passport to increase daily transfer limits and unlock high-volume corridors.'}
          </p>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              disabled={user?.kv === 1}
            >
              {user?.kv === 1 ? 'Identity Verified ✓' : 'Upload ID Document'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Transaction PIN Management */}
      <Card variant="white" padding="md">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900">
              Transaction Security PIN (4 Digits)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Your 4-digit PIN is required to authorize all remittances, wallet exchanges, and P2P transfers.
          </p>

          {pinSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{pinSuccess}</span>
            </div>
          )}

          {pinError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleSetPin} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="New 4-Digit PIN"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
              />
              <Input
                label="Confirm 4-Digit PIN"
                type="password"
                maxLength={4}
                value={pinConfirmation}
                onChange={(e) => setPinConfirmation(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="mint"
              size="sm"
              isLoading={isPinLoading}
              icon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Save Transaction PIN
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
