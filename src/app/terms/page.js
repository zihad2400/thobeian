export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Terms & Conditions</h1>
          <p className="text-xs text-text-muted mt-2">Last updated: {new Date().toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">1. Acceptance of Terms</h2>
          <p>By using THOBEIAN's website and services, you agree to these Terms & Conditions.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">2. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">3. Product Information</h2>
          <p>We strive for accuracy, but colors may vary slightly due to screen display differences.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">4. Pricing</h2>
          <p>All prices are in BDT and include applicable taxes. We reserve the right to change prices without notice.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">5. Order Cancellation</h2>
          <p>Orders can be cancelled before shipping. Custom orders cannot be cancelled once production begins.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">6. Governing Law</h2>
          <p>These terms are governed by the laws of Bangladesh.</p>
        </section>
      </div>
    </div>
  );
}
