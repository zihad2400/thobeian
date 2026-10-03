import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with THOBEIAN — we're here to help.",
};

export default function ContactPage() {
  const contactInfo = {
    email: "thobeianofficial@gmail.com",
    phone: "+880 1350-888080",
    whatsapp: "8801350888080",
    address: "West Agargon, Sher-e-Bangla Nagar, Dhaka-1207, Bangladesh",
  };

  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Get In Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Contact Us
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Our team is ready to
            help.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Call */}
          <div className="bg-white border border-border p-8 text-center hover:border-gold/40 hover:shadow-lg transition-all duration-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5 rounded-full">
              <Phone size={24} />
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3">
              Call Us
            </h3>
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-sm text-text-secondary hover:text-gold transition-colors block mb-2"
            >
              {contactInfo.phone}
            </a>
            <p className="text-xs text-text-muted">Sat - Thu, 10AM - 8PM</p>
          </div>

          {/* Email */}
          <div className="bg-white border border-border p-8 text-center hover:border-gold/40 hover:shadow-lg transition-all duration-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5 rounded-full">
              <Mail size={24} />
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3">
              Email Us
            </h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-text-secondary hover:text-gold transition-colors break-all"
            >
              {contactInfo.email}
            </a>
            <p className="text-xs text-text-muted mt-2">24/7 Support</p>
          </div>

          {/* Location */}
          <div className="bg-white border border-border p-8 text-center hover:border-gold/40 hover:shadow-lg transition-all duration-300 rounded-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 text-gold mb-5 rounded-full">
              <MapPin size={24} />
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3">
              Visit Us
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {contactInfo.address}
            </p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-background-luxury border border-border p-8 md:p-12 max-w-3xl mx-auto text-center rounded-2xl">
          <MessageCircle size={32} className="text-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">
            Message Us on WhatsApp
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            For fastest response, message us on WhatsApp
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent("Hello THOBEIAN! I need help.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20b858] text-white text-sm uppercase tracking-widest font-medium transition-colors rounded-full"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-sm uppercase tracking-widest font-medium transition-colors rounded-full"
            >
              <Mail size={16} />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
