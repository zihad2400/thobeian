"use client";
import { FABRICS, FABRIC_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step19Fabric({ config, updateConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Preferred Fabric</p>
        <div className="grid grid-cols-2 gap-3">
          {FABRICS.map((f) => (
            <button key={f.id} onClick={() => updateConfig("fabric", f.id)}
              className={`text-left p-3 border transition-all ${config.fabric === f.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 border border-border" style={{
                  backgroundColor: f.color,
                  backgroundImage: f.texture === "textured" ? "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)" : f.texture === "luxurious" ? "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(0,0,0,0.15))" : "none",
                }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-charcoal truncate">{f.name}</span>
                    {config.fabric === f.id && <Check size={12} className="text-gold shrink-0" />}
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">From {f.origin}</p>
                  {f.price > 0 ? <p className="text-[10px] text-gold mt-0.5">+ {formatPrice(f.price)}</p> : <p className="text-[10px] text-success mt-0.5">Included</p>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Fabric Color</p>
        <div className="grid grid-cols-6 gap-2">
          {FABRIC_COLORS.map((c) => (
            <button key={c.id} onClick={() => updateConfig("fabricColor", c.id)}
              className={`relative aspect-square border-2 transition-all ${config.fabricColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
              style={{ backgroundColor: c.hex }} title={c.name}>
              {config.fabricColor === c.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={14} className={["white", "off-white", "cream", "beige", "sand"].includes(c.id) ? "text-charcoal" : "text-white"} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
