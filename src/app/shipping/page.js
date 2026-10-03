import { Truck, Clock, MapPin, Package } from "lucide-react";

export const metadata = {
  title: "Shipping Information",
  description: "Learn about THOBEIAN's shipping methods and delivery times.",
};

export default function ShippingPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Delivery</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Shipping Information</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Fast, reliable delivery across Bangladesh.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "Inside Dhaka", time: "1-2 days", charge: "৳80" },
            { icon: Truck, title: "Outside Dhaka", time: "2-4 days", charge: "৳130" },
            { icon: Clock, title: "Express", time: "Same day", charge: "৳200" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="border border-border p-6 text-center hover:border-gold/40 transition-colors">
                <Icon size={24} className="text-gold mx-auto mb-4" />
                <h3 className="font-serif text-lg text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary mb-2">{item.time}</p>
                <p className="font-serif text-2xl text-gold">{item.charge}</p>
              </div>
            );
          })}
        </div>

        <div className="border border-border p-8">
          <h2 className="font-serif text-2xl text-charcoal mb-4">Free Shipping</h2>
          <p className="text-text-secondary mb-3">
            Orders above <strong className="text-gold">৳5,000</strong> qualify for free shipping across Bangladesh.
          </p>
        </div>

        <div className="border border-border p-8">
          <h2 className="font-serif text-2xl text-charcoal mb-4">Order Processing</h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <Package size={18} className="text-gold mt-0.5 shrink-0" />
              <span>Orders placed before 2PM are processed same day.</span>
            </li>
            <li className="flex items-start gap-3">
              <Package size={18} className="text-gold mt-0.5 shrink-0" />
              <span>Custom thobe orders may take 7-14 days for crafting.</span>
            </li>
            <li className="flex items-start gap-3">
              <Package size={18} className="text-gold mt-0.5 shrink-0" />
              <span>You'll receive tracking info via SMS/email.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
