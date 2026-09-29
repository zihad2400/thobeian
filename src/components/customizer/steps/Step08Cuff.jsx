"use client";
import { CUFFS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step08Cuff({ config, updateConfig }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CUFFS.map((c) => (
        <button key={c.id} onClick={() => updateConfig("cuff", c.id)}
          className={`text-left p-4 border transition-all ${config.cuff === c.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm text-charcoal">{c.name}</h4>
            {config.cuff === c.id && <Check size={14} className="text-gold" />}
          </div>
          {c.price > 0 ? <p className="text-xs text-gold font-medium mt-1">+ {formatPrice(c.price)}</p> : <p className="text-xs text-success font-medium mt-1">Included</p>}
        </button>
      ))}
    </div>
  );
}
