"use client";
import { SLEEVES } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step07Sleeve({ config, updateConfig }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SLEEVES.map((s) => (
        <button key={s.id} onClick={() => updateConfig("sleeve", s.id)}
          className={`text-left p-4 border transition-all ${config.sleeve === s.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm text-charcoal">{s.name}</h4>
            {config.sleeve === s.id && <Check size={14} className="text-gold" />}
          </div>
          {s.price > 0 ? <p className="text-xs text-gold font-medium mt-1">+ {formatPrice(s.price)}</p> : <p className="text-xs text-success font-medium mt-1">Included</p>}
        </button>
      ))}
    </div>
  );
}
