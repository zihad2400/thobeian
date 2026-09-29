"use client";
import { CHEST_POCKETS, SIDE_POCKETS, POCKET_STYLES } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step10Pocket({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Chest Pocket</p>
        <div className="grid grid-cols-2 gap-3">
          {CHEST_POCKETS.map((p) => (
            <button key={p.id} onClick={() => updateConfig("chestPocket", p.id)}
              className={`text-left p-3 border text-xs ${config.chestPocket === p.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-center justify-between">
                <span className="text-charcoal">{p.name}</span>
                {config.chestPocket === p.id && <Check size={12} className="text-gold" />}
              </div>
              {p.price > 0 && <p className="text-[10px] text-gold mt-1">+ {formatPrice(p.price)}</p>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Side Pocket</p>
        <div className="grid grid-cols-2 gap-3">
          {SIDE_POCKETS.map((p) => (
            <button key={p.id} onClick={() => updateConfig("sidePocket", p.id)}
              className={`text-left p-3 border text-xs ${config.sidePocket === p.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-center justify-between">
                <span className="text-charcoal">{p.name}</span>
                {config.sidePocket === p.id && <Check size={12} className="text-gold" />}
              </div>
              {p.price > 0 && <p className="text-[10px] text-gold mt-1">+ {formatPrice(p.price)}</p>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Pocket Style</p>
        <div className="grid grid-cols-3 gap-2">
          {POCKET_STYLES.map((p) => (
            <button key={p.id} onClick={() => updateConfig("pocketStyle", p.id)}
              className={`p-2.5 border text-xs ${config.pocketStyle === p.id ? "border-gold bg-gold/5 text-charcoal" : "border-border text-text-secondary hover:border-gold/50"}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
