"use client";
import { MONOGRAM_PLACEMENTS, MONOGRAM_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step18Monogram({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-charcoal mb-2 block">
          Your Name / Initials (leave empty if not needed)
        </label>
        <input
          type="text"
          value={config.monogramText}
          onChange={(e) => updateConfig("monogramText", e.target.value)}
          placeholder="Example: ZIHAD"
          maxLength={15}
          className="w-full px-4 py-3 border border-border focus:border-gold outline-none text-sm uppercase tracking-widest"
        />
      </div>

      {config.monogramText && (
        <>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Placement</p>
            <div className="grid grid-cols-2 gap-3">
              {MONOGRAM_PLACEMENTS.map((p) => (
                <button key={p.id} onClick={() => updateConfig("monogramPlacement", p.id)}
                  className={`text-left p-3 border text-xs ${config.monogramPlacement === p.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-charcoal">{p.name}</span>
                    {config.monogramPlacement === p.id && <Check size={12} className="text-gold" />}
                  </div>
                  <span className="text-[10px] text-gold">+ {formatPrice(p.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Text Color</p>
            <div className="flex flex-wrap gap-2">
              {MONOGRAM_COLORS.map((c) => (
                <button key={c.id} onClick={() => updateConfig("monogramColor", c.id)}
                  className={`w-11 h-11 border-2 flex items-center justify-center ${config.monogramColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                  style={{ backgroundColor: c.hex }} title={c.name}>
                  {config.monogramColor === c.id && <Check size={12} className={c.id === "white" ? "text-charcoal" : "text-white"} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
