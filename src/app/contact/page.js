import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with THOBEIAN — we're here to help.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Get In Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Contact Us</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Our team is ready to help.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Phone, title: "Call Us", lines: ["+880 1XXX-XXXXXX", "Sat - Thu, 10AM - 8PM"] },
            { icon: Mail, title: "Email Us", lines: ["hello@thobeian.com", "support@thobeian.com"] },
            { icon: MapPin, title: "Visit Us", lines: ["Dhanmondi, Dhaka", "Bangladesh"] },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white border border-border p-8 text-center hover:border-gold/40 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5">
                  <Icon size={24} />
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-3">{item.title}</h3>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-sm text-text-secondary">{line}</p>
                ))}
              </div>
            );
          })}
        </div>

        <div className="bg-background-luxury border border-border p-8 md:p-12 max-w-3xl mx-auto text-center">
          <MessageCircle size={32} className="text-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">Send Us a Message</h2>
          <p className="text-sm text-text-secondary mb-6">
            For fastest response, message us on WhatsApp or email us directly.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://wa.me/8801XXXXXXXXX" className="btn-primary text-xs py-3 px-6">WhatsApp Us</a>
            <a href="mailto:hello@thobeian.com" className="btn-outline text-xs py-3 px-6">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
