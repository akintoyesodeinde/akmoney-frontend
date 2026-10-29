import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Lock } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  description?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Verify Transaction PIN',
  description = 'Enter your 4-digit security PIN to authorize this financial transfer.',
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Please enter your full 4-digit PIN');
      return;
    }
    setIsLoading(true);
    // Complete callback
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(pin);
      setPin('');
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <form onSubmit={handleSubmit} className="text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-[#0A2540]">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-500 mb-6">{description}</p>

        {/* Masked PIN bubbles */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
                pin.length > index
                  ? 'border-[#00D4B2] bg-[#00D4B2]/10 text-slate-900 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-transparent'
              }`}
            >
              {pin.length > index ? '●' : ''}
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-rose-600 mb-4">{error}</p>}

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (key === 'C') setPin('');
                else if (key === '⌫') handleBackspace();
                else handleDigit(key);
              }}
              className="h-12 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 font-semibold text-slate-800 text-base active:scale-95 transition-all flex items-center justify-center"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="mint"
            isLoading={isLoading}
            disabled={pin.length < 4}
            className="flex-1"
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
};
