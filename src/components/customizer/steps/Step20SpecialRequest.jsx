"use client";

export default function Step20SpecialRequest({ config, updateConfig }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gold/5 border border-gold/30">
        <p className="text-xs text-charcoal font-medium mb-1">💬 Special Instructions</p>
        <p className="text-[11px] text-text-muted">
          Tell us about any special requirement you have for your custom thobe.
        </p>
      </div>

      <textarea
        value={config.specialRequest}
        onChange={(e) => updateConfig("specialRequest", e.target.value)}
        rows={8}
        placeholder={`Example:\n\n"Please keep the collar slightly higher."\n"Keep the sleeve comfortable."\n"Make the body slightly loose."\n"Add extra length at the bottom."`}
        className="w-full p-4 border border-border focus:border-gold outline-none text-sm leading-relaxed"
      />

      <div className="grid grid-cols-2 gap-3 text-[10px] text-text-muted">
        <div className="p-3 border border-dashed border-border">
          <p className="font-medium text-charcoal mb-1">Examples:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Collar slightly higher</li>
            <li>Sleeve comfortable</li>
            <li>Body slightly loose</li>
          </ul>
        </div>
        <div className="p-3 border border-dashed border-border">
          <p className="font-medium text-charcoal mb-1">Notes:</p>
          <p>Your request will be reviewed by our master tailor.</p>
        </div>
      </div>
    </div>
  );
}
