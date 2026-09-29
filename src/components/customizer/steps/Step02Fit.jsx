"use client";
import { FITS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step02Fit({ config, updateConfig }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FITS.map((f) => (
        <button key={f.id} onClick={() => updateConfig("fit", f.id)}
          className={`text-left p-4 border transition-all ${config.fit === f.id ? "border-gold bg-gold/5 shadow-soft" : "border-border hover:border-gold/50"}`}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-serif text-sm text-charcoal">{f.name}</h4>
            {config.fit === f.id && <Check size={14} className="text-gold" />}
          </div>
          {f.price > 0 ? <p className="text-xs text-gold font-medium">+ {formatPrice(f.price)}</p> : <p className="text-xs text-success font-medium">Included</p>}
        </button>
      ))}
    </div>
  );
}
