"use client";
import { EMBROIDERY_TYPES, EMBROIDERY_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step17Embroidery({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {EMBROIDERY_TYPES.map((e) => (
          <button key={e.id} onClick={() => updateConfig("embroidery", e.id)}
            className={`text-left p-3 border text-xs ${config.embroidery === e.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-charcoal">{e.name}</span>
              {config.embroidery === e.id && <Check size={12} className="text-gold" />}
            </div>
            {e.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(e.price)}</span>}
          </button>
        ))}
      </div>

      {config.embroidery !== "none" && (
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Embroidery Color</p>
          <div className="flex flex-wrap gap-2">
            {EMBROIDERY_COLORS.map((c) => (
              <button key={c.id} onClick={() => updateConfig("embroideryColor", c.id)}
                className={`w-11 h-11 border-2 flex items-center justify-center ${config.embroideryColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                style={{ backgroundColor: c.hex || "#EEE" }} title={c.name}>
                {config.embroideryColor === c.id && <Check size={12} className={c.id === "white" || c.id === "matching" ? "text-charcoal" : "text-white"} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
