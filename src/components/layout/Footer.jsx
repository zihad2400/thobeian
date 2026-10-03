"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  TwitterIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import NewsletterForm from "@/components/forms/NewsletterForm";

const DEFAULT_SOCIAL = {
  facebook: "https://facebook.com/thobeian",
  instagram: "https://instagram.com/thobeian",
  youtube: "https://youtube.com/@thobeianofficial",
  tiktok: "https://tiktok.com/@thobeian",
  twitter: "https://twitter.com/thobeian",
  linkedin: "https://linkedin.com/company/thobeian",
};

const DEFAULT_CONTACT = {
  email: "hello@thobeian.com",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "8801XXXXXXXXX",
  address: "Dhaka, Bangladesh",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [social, setSocial] = useState(DEFAULT_SOCIAL);
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/site-settings");
      if (data.data.settings?.social) {
        setSocial({ ...DEFAULT_SOCIAL, ...data.data.settings.social });
      }
      if (data.data.settings?.contact) {
        setContact({ ...DEFAULT_CONTACT, ...data.data.settings.contact });
      }
    } catch (error) {
      // Use defaults if API fails
    }
  };

  // Clean WhatsApp number
  const cleanWhatsApp = (contact.whatsapp || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanWhatsApp
    ? `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
        "Hello THOBEIAN! I need help with my order."
      )}`
    : null;

  // Social links (WhatsApp included)
  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, url: social.facebook },
    { name: "Instagram", icon: InstagramIcon, url: social.instagram },
    { name: "YouTube", icon: YoutubeIcon, url: social.youtube },
    { name: "TikTok", icon: TikTokIcon, url: social.tiktok },
    { name: "Twitter", icon: TwitterIcon, url: social.twitter },
    { name: "LinkedIn", icon: LinkedInIcon, url: social.linkedin },
    { name: "WhatsApp", icon: WhatsAppIcon, url: whatsappUrl },
  ].filter((s) => s.url);

  return (
    <footer className="bg-charcoal text-white mt-auto">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-2xl mb-2">
                Join the THOBEIAN Circle
              </h3>
              <p className="text-white/60 text-sm">
                Be the first to know about new collections and exclusive
                offers.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl tracking-wider text-white mb-4 block hover:text-gold transition-colors"
            >
              THOBEIAN
            </Link>
            <p className="text-white/60 text-sm mb-6">
              Premium Islamic fashion. Sunnah in Style.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((socialItem) => {
                const Icon = socialItem.icon;
                return (
                  <a
                    key={socialItem.name}
                    href={socialItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialItem.name}
                    title={socialItem.name}
                    className="p-2 border border-white/20 hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/thobe" className="hover:text-gold transition-colors">
                  Thobe
                </Link>
              </li>
              <li>
                <Link href="/panjabi" className="hover:text-gold transition-colors">
                  Panjabi
                </Link>
              </li>
              <li>
                <Link href="/fabrics" className="hover:text-gold transition-colors">
                  Fabrics
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/custom-thobe" className="hover:text-gold transition-colors">
                  Custom Thobe
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-gold transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-gold transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-gold transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 shrink-0" />
                <a
                  href={`tel:${contact.phone}`}
                  className="hover:text-gold transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <p>© {currentYear} THOBEIAN. All rights reserved.</p>
          <p>Secure payments by bKash • Nagad • SSLCommerz</p>
        </div>
      </div>
    </footer>
  );
}
