"use client";
import { COLLAR_TYPES, COLLAR_HEIGHTS, COLLAR_FINISHES } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step03Collar({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Collar Type</p>
        <div className="grid grid-cols-2 gap-3">
          {COLLAR_TYPES.map((c) => (
            <button key={c.id} onClick={() => updateConfig("collarType", c.id)}
              className={`text-left p-3 border transition-all ${config.collarType === c.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-charcoal">{c.name}</span>
                {config.collarType === c.id && <Check size={12} className="text-gold" />}
              </div>
              <span className="text-[10px] text-gold">+ {formatPrice(c.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Collar Height</p>
        <div className="flex gap-2">
          {COLLAR_HEIGHTS.map((h) => (
            <button key={h.id} onClick={() => updateConfig("collarHeight", h.id)}
              className={`flex-1 p-3 border text-xs ${config.collarHeight === h.id ? "border-gold bg-gold/5 text-charcoal" : "border-border text-text-secondary hover:border-gold/50"}`}>
              {h.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Collar Finish</p>
        <div className="flex gap-2">
          {COLLAR_FINISHES.map((f) => (
            <button key={f.id} onClick={() => updateConfig("collarFinish", f.id)}
              className={`flex-1 p-3 border text-xs ${config.collarFinish === f.id ? "border-gold bg-gold/5 text-charcoal" : "border-border text-text-secondary hover:border-gold/50"}`}>
              {f.name} {f.price > 0 && <span className="text-gold">+{formatPrice(f.price)}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
