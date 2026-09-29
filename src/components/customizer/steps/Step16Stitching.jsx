"use client";
import { STITCHING_STYLES, STITCH_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step16Stitching({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Stitching Style</p>
        <div className="grid grid-cols-2 gap-3">
          {STITCHING_STYLES.map((s) => (
            <button key={s.id} onClick={() => updateConfig("stitchingStyle", s.id)}
              className={`text-left p-3 border text-xs ${config.stitchingStyle === s.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-charcoal">{s.name}</span>
                {config.stitchingStyle === s.id && <Check size={12} className="text-gold" />}
              </div>
              {s.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(s.price)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Stitch Color</p>
        <div className="flex flex-wrap gap-2">
          {STITCH_COLORS.map((c) => (
            <button key={c.id} onClick={() => updateConfig("stitchColor", c.id)}
              className={`w-11 h-11 border-2 flex items-center justify-center ${config.stitchColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
              style={{ backgroundColor: c.hex || "#EEE" }} title={c.name}>
              {config.stitchColor === c.id && <Check size={12} className={c.id === "white" || c.id === "matching" ? "text-charcoal" : "text-white"} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
