import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipientService } from '../services/recipientService';
import { remittanceService } from '../services/remittanceService';
import { Recipient, RecipientPayload } from '../types/recipient';
import { Country } from '../types/remittance';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  Users,
  UserPlus,
  SendHorizontal,
  Trash2,
  Building2,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export const RecipientsPage: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const [form, setForm] = useState<RecipientPayload>({
    name: '',
    mobile: '',
    email: '',
    country_id: 1,
    bank_name: '',
    account_number: '',
  });

  const loadData = async () => {
    try {
      const [rList, cList] = await Promise.all([
        recipientService.getRecipients(),
        remittanceService.getCountries(),
      ]);
      setRecipients(rList);
      setCountries(cList);
      if (cList.length > 0) setForm((prev) => ({ ...prev, country_id: cList[0].id }));
    } catch (e) {
      console.error('Failed to load recipients:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback('');
    try {
      await recipientService.createRecipient(form);
      setIsModalOpen(false);
      setFeedback('Beneficiary added successfully!');
      loadData();
      setForm({ name: '', mobile: '', email: '', country_id: countries[0]?.id || 1, bank_name: '', account_number: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Failed to save recipient');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this saved beneficiary?')) return;
    try {
      await recipientService.deleteRecipient(id);
      setRecipients((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Failed to delete recipient');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Saved Beneficiaries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly send money to recurring family, friends, and business contacts.
          </p>
        </div>

        <Button
          variant="mint"
          size="md"
          onClick={() => setIsModalOpen(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Add New Beneficiary
        </Button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Recipient list */}
      <Card variant="white" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading beneficiaries...</div>
        ) : recipients.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <h4 className="text-sm font-semibold text-slate-800">No saved beneficiaries yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Save your frequent transfer contacts to send money in one click.
            </p>
            <Button
              variant="mint"
              size="sm"
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add Beneficiary
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recipients.map((r) => (
              <div
                key={r.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {r.name?.[0] || 'R'}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">{r.name}</span>
                    <span className="block text-xs text-slate-500">
                      {r.mobile} • {r.country_name || 'Global Corridor'}
                    </span>
                    {r.service_name && (
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {r.service_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to="/send-money">
                    <Button
                      size="sm"
                      variant="mint"
                      className="text-xs"
                      icon={<SendHorizontal className="w-3.5 h-3.5" />}
                    >
                      Send Money
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    title="Remove Beneficiary"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Beneficiary">
        <form onSubmit={handleCreateRecipient} className="space-y-4">
          <Input
            label="Full Legal Name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Amina Diallo"
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              Destination Country
            </label>
            <select
              value={form.country_id}
              onChange={(e) => setForm({ ...form, country_id: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Mobile Phone (with country code)"
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="+221 77 123 4567"
            required
          />

          <Input
            label="Email Address (Optional)"
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="amina@example.com"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Bank / Operator Name"
              type="text"
              value={form.bank_name || ''}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
              placeholder="Orange Money / GTBank"
            />
            <Input
              label="Account Number / Phone"
              type="text"
              value={form.account_number || ''}
              onChange={(e) => setForm({ ...form, account_number: e.target.value })}
              placeholder="Account or Phone ID"
            />
          </div>

          <Button type="submit" variant="mint" size="lg" className="w-full mt-2" isLoading={isSubmitting}>
            Save Beneficiary
          </Button>
        </form>
      </Modal>
    </div>
  );
};
