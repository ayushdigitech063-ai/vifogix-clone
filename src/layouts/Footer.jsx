// src/layouts/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  footerColumns,
  legalLinks,
  socialLinks,
  contactInfo,
} from "../data/footerLinks";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // later: call a newsletter service
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="mt-auto bg-fg text-white">
      {/* Top section */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-6">
        {/* Brand + contact */}
        <div className="lg:col-span-2">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Vefogix"
            className="h-10 w-auto object-contain"
          />
        </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Top #1 SEO &amp; Guest Post Agency. We help you build a stronger
            online presence with trusted guest posts and link building.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent-yellow" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white">
                {contactInfo.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent-yellow" />
              <a href={`tel:${contactInfo.phone}`} className="hover:text-white">
                {contactInfo.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-yellow" />
              <span>{contactInfo.address}</span>
            </li>
          </ul>
        </div>

        {/* Link columns */}
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-4 text-base text-white">{col.title}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Newsletter + social */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-white">Newsletter</h3>
            <p className="text-sm text-white/70">
              Get the latest updates, SEO tips, and exclusive offers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-primary-light"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary-light px-5 py-2 text-sm font-semibold text-white hover:bg-primary"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} All Rights Reserved by Vefogix Clone.</p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex gap-4">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;