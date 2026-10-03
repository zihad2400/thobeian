import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Return Policy",
  description: "THOBEIAN's return and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Customer Care</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Returns & Exchanges</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Hassle-free returns within 7 days.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="border border-border p-8">
          <div className="flex items-start gap-3 mb-4">
            <RotateCcw size={28} className="text-gold shrink-0" />
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-2">7-Day Return Policy</h2>
              <p className="text-text-secondary">
                Return any unused item within 7 days of delivery for a full refund or exchange.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-success/30 bg-success/5 p-6">
            <CheckCircle size={24} className="text-success mb-3" />
            <h3 className="font-serif text-xl text-charcoal mb-3">Acceptable</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Unused, unworn items</li>
              <li>✓ Original packaging intact</li>
              <li>✓ Tags attached</li>
              <li>✓ Within 7 days of delivery</li>
            </ul>
          </div>

          <div className="border border-error/30 bg-error/5 p-6">
            <XCircle size={24} className="text-error mb-3" />
            <h3 className="font-serif text-xl text-charcoal mb-3">Not Acceptable</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✗ Custom-made thobes</li>
              <li>✗ Worn or washed items</li>
              <li>✗ Without original packaging</li>
              <li>✗ After 7 days</li>
            </ul>
          </div>
        </div>

        <div className="border border-gold/30 bg-gold/5 p-8">
          <AlertCircle size={24} className="text-gold mb-3" />
          <h3 className="font-serif text-xl text-charcoal mb-3">How to Return</h3>
          <ol className="space-y-2 text-text-secondary list-decimal list-inside">
            <li>Contact us at hello@thobeian.com or WhatsApp</li>
            <li>Provide your order number and reason</li>
            <li>We'll arrange pickup or provide return address</li>
            <li>Refund processed within 3-5 business days</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
