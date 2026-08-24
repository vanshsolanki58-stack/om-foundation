import React, { useState } from "react";
import { Heart, CheckCircle2, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { notificationService } from "../lib/notifications";

export function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const amounts = [500, 1100, 2500, 5100, 11000];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    setIsSuccess(true);
    notificationService.addNotification({
      title: "Donation Pledge Received 🙏",
      message: `Thank you for pledging ₹${finalAmount} towards Om Foundation meals! We will provide the tax exemption 80G receipt shortly.`,
      category: "system",
      priority: "high",
    });
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
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              🙏
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Dhanyawaad for Your Generosity!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your pledge has been registered. You will receive an official digital receipt along with AI audit photos of the meals served through your sponsorship.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl"
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
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
              />
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
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              Complete Sacred Donation
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Tax Deductible (80G)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified AI Audit
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
