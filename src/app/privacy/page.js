export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Privacy Policy</h1>
          <p className="text-xs text-text-muted mt-2">Last updated: {new Date().toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing orders, or contacting us. This includes name, email, phone number, and shipping address.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">2. How We Use Your Information</h2>
          <p>Your information is used to process orders, communicate about your purchase, provide customer support, and improve our services.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">3. Payment Security</h2>
          <p>We use secure payment gateways (bKash, Nagad, SSLCommerz). We never store your card details or payment credentials.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">4. Information Sharing</h2>
          <p>We do not sell, trade, or share your personal information with third parties except as required to fulfill your order (delivery partners).</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">5. Your Rights</h2>
          <p>You can access, update, or delete your account information anytime by logging into your account or contacting us.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">6. Contact Us</h2>
          <p>For privacy questions, email <strong className="text-gold">hello@thobeian.com</strong>.</p>
        </section>
      </div>
    </div>
  );
}
