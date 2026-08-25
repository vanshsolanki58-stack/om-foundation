import React, { useState } from "react";
import { Heart, CheckCircle2, ShieldCheck, CreditCard, Sparkles, AlertCircle, Lock } from "lucide-react";
import { notificationService } from "../lib/notifications";
import { submitDonationPledge } from "../lib/supabase";

export function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [panNumber, setPanNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const amounts = [500, 1100, 2500, 5100, 11000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) {
      setError("Please select or enter a valid donation amount.");
      return;
    }

    if (!donorName.trim()) {
      setError("Please enter your full name for the donation receipt.");
      return;
    }

    try {
      setLoading(true);

      // Persist to Supabase Database
      await submitDonationPledge({
        amount: finalAmount,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim() || undefined,
        donorPhone: donorPhone.trim() || undefined,
        panNumber: panNumber.trim() || undefined,
      });

      setIsSuccess(true);

      notificationService.addNotification({
        title: "Donation Pledge Recorded 🙏",
        message: `Thank you ${donorName}! Your contribution of ₹${finalAmount.toLocaleString()} has been recorded. Digital receipt & 80G certificate will be processed shortly.`,
        category: "system",
        priority: "high",
      });
    } catch (err: any) {
      setError(err.message || "Failed to record donation pledge. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
          Sacred Contribution
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Support Our Seva</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Every contribution directly feeds hungry souls, supports women-led cooking kitchens, and maintains our spiritual community shibirs in Bhuj.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              🙏
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Dhanyawaad for Your Generosity!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your pledge of ₹{(customAmount ? Number(customAmount) : selectedAmount).toLocaleString()} has been securely recorded. You will receive an official digital receipt along with photo records of meals served.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setDonorName("");
                setDonorEmail("");
                setDonorPhone("");
                setPanNumber("");
                setCustomAmount("");
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Make another pledge
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-3">Select Sponsorship Amount (₹)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                      selectedAmount === amt && !customAmount
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Or Custom Amount (₹)</label>
              <input
                type="number"
                min="1"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            {/* Donor Information */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Donor Details for Receipt</span>
              
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name / Trust Name *"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone / WhatsApp"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="PAN Card (Optional, for 80G Tax Exemption)"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none uppercase"
                />
              </div>
            </div>

            {/* Impact Calculation */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Your sponsorship provides approximately</span>
              </div>
              <strong className="text-sm text-amber-800 font-extrabold">
                ~{Math.round(((customAmount ? Number(customAmount) : selectedAmount) / 25))} Warm Meals
              </strong>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recording Sacred Pledge...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white/20" />
                  Complete Sacred Contribution
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Tax Deductible (80G)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo-Verified Food Drives
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
