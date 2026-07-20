import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatMXP, formatDate } from '../utils';
import { exportMxpHistoryPDF } from '../utils/pdfExporter';
import { Wallet as WalletIcon, Send, Clock, CheckCircle, XCircle, AlertCircle, PlusCircle, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react';

interface MxpRequestItem {
  _id: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNote?: string;
  createdAt: string;
}

const WalletPage: React.FC = () => {
  const { user, reloadProfile } = useAuth();
  const [requests, setRequests] = useState<MxpRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [amount, setAmount] = useState<number | ''>(5000);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/mxp-requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error('Failed to load MXP requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!amount || Number(amount) < 100) {
      setFormError('Please enter a valid amount (minimum 100 MXP).');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for requesting additional MXP.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/users/request-mxp', {
        amount: Number(amount),
        reason: reason.trim(),
      });
      setFormSuccess('Your MXP request has been submitted to administrators for review!');
      setReason('');
      setAmount(5000);
      await fetchRequests();
      setTimeout(() => {
        setShowRequestModal(false);
        setFormSuccess(null);
      }, 2000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit MXP request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-success/15 text-brand-success border border-brand-success/30 px-2.5 py-0.5 rounded-full">
            <CheckCircle size={11} />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-danger/15 text-brand-danger border border-brand-danger/30 px-2.5 py-0.5 rounded-full">
            <XCircle size={11} />
            <span>Declined</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
            <Clock size={11} />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-dark-border/30 pb-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-blue/10 text-brand-blue border border-brand-blue/25 px-3 py-1 rounded-full inline-block mb-3">
              Virtual Wallet Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              MXP Wallet & Balances
            </h1>
            <p className="text-xs sm:text-sm text-dark-muted font-medium mt-1">
              Manage your Market Exchange Points (MXP), track credit grants, and request points directly from administrators.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => exportMxpHistoryPDF(user || {}, requests)}
              className="bg-dark border border-dark-border hover:border-brand-blue/50 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-3.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
              title="Download MXP Wallet & Request Log as PDF"
            >
              <Download size={15} />
              <span>Download MXP PDF</span>
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-brand-purple/25 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Request More MXP</span>
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Current Balance */}
          <div className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Available Balance</span>
              <WalletIcon size={18} className="text-brand-blue" />
            </div>
            <div className="text-3xl font-black text-white">
              {formatMXP(user?.mxpBalance || 0)}
            </div>
            <p className="text-[10px] text-dark-muted font-semibold mt-2">
              Instant trading liquidity available for all live market predictions
            </p>
          </div>

          {/* Account Status */}
          <div className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Wallet Type</span>
              <span className="text-xs">⚡</span>
            </div>
            <div className="text-2xl font-black text-brand-purple uppercase">
              {user?.role || 'Standard'} Predictor
            </div>
            <p className="text-[10px] text-dark-muted font-semibold mt-2">
              Receives 10,000 MXP initial welcome credit + daily trading capabilities
            </p>
          </div>

          {/* Pending Requests */}
          <div className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Active Credit Requests</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">
              {requests.filter(r => r.status === 'Pending').length} Pending
            </div>
            <p className="text-[10px] text-dark-muted font-semibold mt-2">
              Submissions are reviewed by system administrators in real-time
            </p>
          </div>
        </div>

        {/* MXP Request Modal / Inline Section */}
        {showRequestModal && (
          <div className="bg-dark-card border border-brand-purple/40 rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl animate-fade-in relative">
            <div className="flex justify-between items-center mb-6 border-b border-dark-border/30 pb-4">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Request Additional MXP Points
                </h3>
                <p className="text-xs text-dark-muted font-medium">
                  Specify how much MXP you require and provide a short reason for the administrators.
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-xs text-dark-muted hover:text-white px-2 py-1 border border-dark-border rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                <CheckCircle size={14} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-5">
              {/* Section 1: Amount Requested */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  1. How much MXP do you want to request?
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    min={100}
                    max={100000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 5000"
                    className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-brand-purple"
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-brand-purple">MXP</span>
                </div>
              </div>

              {/* Section 2: Reason for Request */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  2. Reason for requesting MXP points:
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you are requesting additional points (e.g. ran out of points while testing new AI market bets)..."
                  className="w-full bg-dark/60 border border-dark-border rounded-xl p-4 text-xs font-medium text-white placeholder-dark-muted focus:outline-none focus:border-brand-purple leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-dark-muted hover:text-white border border-dark-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-lg shadow-brand-purple/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting Request...' : 'Submit MXP Request →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MXP Request History List */}
        <div className="bg-dark-card border border-dark-border/70 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-dark-border/30 pb-4 mb-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <span>📋</span>
              <span>Your Admin MXP Request History</span>
            </h3>
            <span className="text-xs text-dark-muted font-bold">
              {requests.length} Submissions
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-dark-muted">
              Loading request records...
            </div>
          ) : requests.length > 0 ? (
            <div className="divide-y divide-dark-border/20">
              {requests.map((req) => (
                <div key={req._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-black text-white">
                        +{req.amount.toLocaleString()} MXP
                      </span>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-dark-muted font-medium leading-relaxed max-w-2xl">
                      "{req.reason}"
                    </p>
                    {req.adminNote && (
                      <p className="text-[10px] text-brand-purple font-semibold">
                        Admin Note: {req.adminNote}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-dark-muted font-medium shrink-0">
                    Requested on {formatDate(req.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-dark-muted space-y-2">
              <p>You haven't requested any MXP grants yet.</p>
              <button
                onClick={() => setShowRequestModal(true)}
                className="text-brand-blue font-bold hover:underline inline-block"
              >
                Click here to request MXP points from Admin →
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WalletPage;
