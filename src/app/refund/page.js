import { DollarSign, Clock, CheckCircle } from "lucide-react";

export const metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Customer Care</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Refund Policy</h1>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-text-secondary leading-relaxed">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: "3-5 Days", desc: "Processing time" },
            { icon: DollarSign, title: "100%", desc: "Refund for defects" },
            { icon: CheckCircle, title: "bKash/Nagad", desc: "Refund method" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="border border-border p-6 text-center">
                <Icon size={24} className="text-gold mx-auto mb-3" />
                <p className="font-serif text-xl text-charcoal mb-1">{item.title}</p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Refund Eligibility</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Defective or damaged items</li>
            <li>Wrong item delivered</li>
            <li>Returns within 7 days (unused)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Refund Method</h2>
          <p>Refunds are processed to your original payment method:</p>
          <ul className="space-y-2 mt-3 list-disc list-inside">
            <li>bKash / Nagad: 1-2 business days</li>
            <li>Card payments: 5-7 business days</li>
            <li>COD: Bank transfer or mobile wallet</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Non-Refundable</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Custom-made thobes</li>
            <li>Sale items</li>
            <li>Items damaged by customer</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
