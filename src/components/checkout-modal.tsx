"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

const INDIAN_STATES = [
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "28", name: "Andhra Pradesh" },
  { code: "37", name: "Andhra Pradesh (New)" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "18", name: "Assam" },
  { code: "10", name: "Bihar" },
  { code: "04", name: "Chandigarh" },
  { code: "22", name: "Chhattisgarh" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "07", name: "Delhi" },
  { code: "30", name: "Goa" },
  { code: "24", name: "Gujarat" },
  { code: "06", name: "Haryana" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "01", name: "Jammu and Kashmir" },
  { code: "20", name: "Jharkhand" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "38", name: "Ladakh" },
  { code: "31", name: "Lakshadweep" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "27", name: "Maharashtra" },
  { code: "14", name: "Manipur" },
  { code: "17", name: "Meghalaya" },
  { code: "15", name: "Mizoram" },
  { code: "13", name: "Nagaland" },
  { code: "21", name: "Odisha" },
  { code: "34", name: "Puducherry" },
  { code: "03", name: "Punjab" },
  { code: "08", name: "Rajasthan" },
  { code: "11", name: "Sikkim" },
  { code: "33", name: "Tamil Nadu" },
  { code: "36", name: "Telangana" },
  { code: "16", name: "Tripura" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "05", name: "Uttarakhand" },
  { code: "19", name: "West Bengal" },
];

interface CheckoutModalProps {
  planName: string;
  basePrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: BillingDetails, totalAmountPaise: number) => Promise<void>;
  loading: boolean;
}

export interface BillingDetails {
  name: string;
  address: string;
  state: string;
  pin_code: string;
  country: string;
  gstin?: string;
}

export function CheckoutModal({ planName, basePrice, isOpen, onClose, onSubmit, loading }: CheckoutModalProps) {
  const [details, setDetails] = useState<BillingDetails>({
    name: "",
    address: "",
    state: "",
    pin_code: "",
    country: "IN",
    gstin: ""
  });

  if (!isOpen) return null;

  const isIndia = details.country === "IN" || details.country.toLowerCase() === "india";
  const SUPPLIER_STATE_CODE = "06"; // Haryana

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isIndia) {
    if (details.state === SUPPLIER_STATE_CODE) {
      cgstAmount = Math.round(basePrice * 0.09);
      sgstAmount = Math.round(basePrice * 0.09);
    } else {
      igstAmount = Math.round(basePrice * 0.18);
    }
  }

  const taxAmount = cgstAmount + sgstAmount + igstAmount;
  const totalAmount = basePrice + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIndia) return; // Prevent submission for non-India
    onSubmit(details, totalAmount);
  };

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(paise / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/[0.08] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Billing Details</h2>
          <p className="text-sm text-neutral-400 mb-6">Enter your details to complete your {planName} subscription.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Legal Billing Name</label>
              <input 
                type="text"
                required
                className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                value={details.name}
                onChange={e => setDetails({...details, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Full Billing Address</label>
              <input 
                type="text"
                required
                className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                value={details.address}
                onChange={e => setDetails({...details, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">State</label>
                <select 
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  value={details.state}
                  onChange={e => setDetails({...details, state: e.target.value})}
                >
                  <option value="" disabled>Select state</option>
                  {INDIAN_STATES.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                    <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">PIN Code</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  value={details.pin_code}
                  onChange={e => setDetails({...details, pin_code: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Country</label>
                <select 
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  value={details.country}
                  onChange={e => setDetails({...details, country: e.target.value})}
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">GSTIN (Optional)</label>
                <input 
                  type="text"
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  value={details.gstin}
                  onChange={e => setDetails({...details, gstin: e.target.value})}
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="mt-6 bg-white/[0.02] border border-white/[0.05] rounded-lg p-4">
              {isIndia ? (
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Base Price</span>
                    <span className="text-neutral-200">{formatINR(basePrice)}</span>
                  </div>
                  {details.state === SUPPLIER_STATE_CODE ? (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">CGST (9%)</span>
                        <span className="text-neutral-200">{formatINR(cgstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3 pb-3 border-b border-white/[0.05]">
                        <span className="text-neutral-400">SGST (9%)</span>
                        <span className="text-neutral-200">{formatINR(sgstAmount)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm mb-3 pb-3 border-b border-white/[0.05]">
                      <span className="text-neutral-400">IGST (18%)</span>
                      <span className="text-neutral-200">{formatINR(igstAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-white">Total Payable</span>
                    <span className="text-white">{formatINR(totalAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-amber-500 p-2 text-center bg-amber-500/10 rounded border border-amber-500/20">
                  International billing is currently available through our sales team. Contact <strong>sales@krixaisecurity.com</strong>.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isIndia}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${formatINR(totalAmount)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
