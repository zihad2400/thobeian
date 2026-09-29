"use client";
import { Check } from "lucide-react";

const CONFIRMATIONS = [
  { key: "confirmMeasurements", label: "I have provided my measurements carefully." },
  { key: "confirmFitting", label: "I understand that the final fitting will be based on the measurements I provided." },
  { key: "confirmChecked", label: "I have checked my measurements before submitting the order." },
];

export default function Step21Confirmation({ config, updateConfig }) {
  const allChecked = CONFIRMATIONS.every((c) => config[c.key]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gold/5 border border-gold/30">
        <p className="text-xs text-charcoal font-medium mb-1">⚠️ Please Confirm</p>
        <p className="text-[11px] text-text-muted">
          Custom thobes cannot be returned or exchanged once production begins.
        </p>
      </div>

      <div className="space-y-3">
        {CONFIRMATIONS.map((c) => (
          <label key={c.key} className="flex items-start gap-3 p-3 border border-border hover:border-gold/50 cursor-pointer transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config[c.key] || false}
                onChange={(e) => updateConfig(c.key, e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${config[c.key] ? "border-gold bg-gold" : "border-border"}`}>
                {config[c.key] && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
            </div>
            <span className="text-xs text-charcoal leading-relaxed flex-1">{c.label}</span>
          </label>
        ))}
      </div>

      {allChecked && (
        <div className="p-3 bg-success/10 border border-success/30 text-xs text-success flex items-center gap-2">
          <Check size={14} /> All confirmations checked — ready to submit
        </div>
      )}
    </div>
  );
}
