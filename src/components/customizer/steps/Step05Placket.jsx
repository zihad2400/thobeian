"use client";
import { PLACKETS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step05Placket({ config, updateConfig }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PLACKETS.map((p) => (
        <button key={p.id} onClick={() => updateConfig("placket", p.id)}
          className={`text-left p-4 border transition-all ${config.placket === p.id ? "border-gold bg-gold/5 shadow-soft" : "border-border hover:border-gold/50"}`}>
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm text-charcoal">{p.name}</h4>
            {config.placket === p.id && <Check size={14} className="text-gold" />}
          </div>
          {p.price > 0 ? <p className="text-xs text-gold font-medium mt-1">+ {formatPrice(p.price)}</p> : <p className="text-xs text-success font-medium mt-1">Included</p>}
        </button>
      ))}
    </div>
  );
}
