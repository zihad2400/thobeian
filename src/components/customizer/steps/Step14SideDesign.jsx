"use client";
import { SIDE_DESIGNS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step14SideDesign({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {SIDE_DESIGNS.map((s) => (
          <button key={s.id} onClick={() => updateConfig("sideDesign", s.id)}
            className={`text-left p-3 border text-xs ${config.sideDesign === s.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-charcoal">{s.name}</span>
              {config.sideDesign === s.id && <Check size={12} className="text-gold" />}
            </div>
            {s.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(s.price)}</span>}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-medium text-charcoal mb-2 block">Side Slit Length (inch)</label>
        <input
          type="number"
          value={config.sideSlitLength}
          onChange={(e) => updateConfig("sideSlitLength", e.target.value)}
          placeholder="Example: 12"
          className="w-full px-3 py-2.5 border border-border focus:border-gold outline-none text-sm"
        />
      </div>
    </div>
  );
}
