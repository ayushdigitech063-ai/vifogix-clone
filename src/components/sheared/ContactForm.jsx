// ContactForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Globe } from "lucide-react";
import { companySizes, buyerGoals } from "../../data/linkbuilding";
import { contactFormSchema } from "../../schemas";

// TODO: move these next to buyerGoals in data/linkbuilding.js
const publisherGoals = [
  "Monetize my website",
  "Get more guest post orders",
  "Build relationships with brands",
  "Grow my audience",
  "Other",
];
const countryCodes = ["us +1", "uk +44", "in +91", "ae +971", "au +61", "ca +1"];

// Optional: put an image in /public/images and set the path, e.g. "/images/contact-bg.webp"
const BG_IMAGE = "https://thumbs.dreamstime.com/b/professional-sitting-office-front-laptop-home-based-student-getting-distant-education-serious-man-working-desktop-159868691.jpg";

const SECTION_BG = "#0b0908";

// TODO: replace "#" with your real profile links
const socials = [
  { label: "LinkedIn", short: "in", href: "#" },
  { label: "X", short: "X", href: "#" },
  { label: "YouTube", short: "YT", href: "#" },
  { label: "Instagram", short: "IG", href: "#" },
  { label: "Facebook", short: "f", href: "#" },
  { label: "WhatsApp", short: "WA", href: "#" },
];

const initialValues = {
  name: "", email: "", countryCode: "us +1", phone: "",
  companySize: "", goal: "", message: "", consent: false,
};

const inputClass =
  "w-full rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary-light [&>option]:bg-white [&>option]:text-fg";

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm text-white/90">
    {children}
  </label>
);

const BuyerIcon = () => (
  <ShoppingBag className="h-6 w-6" aria-hidden="true" />
);

const PublisherIcon = () => (
  <Globe className="h-6 w-6" aria-hidden="true" />
);

const AUDIENCES = [
  { id: "buyer", label: "For Buyer", Icon: BuyerIcon },
  { id: "publisher", label: "For Publisher", Icon: PublisherIcon },
];

const ContactForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [audience, setAudience] = useState("buyer");
  const [sent, setSent] = useState(false);

  const goals = audience === "buyer" ? buyerGoals : publisherGoals;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const chooseAudience = (id) => {
    setAudience(id);
    setValues((prev) => ({ ...prev, goal: "" })); // goal options differ per audience
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = contactFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const next = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs[0]) next[key] = msgs[0];
      }
      setErrors(next);
      return;
    }

    setErrors({});
    // later: send to your backend
    console.log({ audience, ...values });
    setValues(initialValues);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden py-16 text-white md:py-20"
      style={{ backgroundColor: SECTION_BG }}
    >
      {BG_IMAGE && (
        <>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('${BG_IMAGE}')` }}
        />
         <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: SECTION_BG, opacity: 0.60 }}
      />
      </>
      )}

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[5fr_7fr] lg:gap-16">
        {/* Left: heading, audience toggle, socials */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Let's get in touch.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Share your goals and our team will get back to you with a tailored plan.
          </p>

          <div className="mt-8 space-y-4" role="group" aria-label="I am a">
            {AUDIENCES.map(({ id, label, Icon }) => {
              const active = audience === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseAudience(id)}
                  className={`flex w-full items-center gap-4 rounded-full border-2 p-2 pr-6 text-left transition ${
                    active
                      ? "border-white/80 bg-white/10"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-fg md:h-14 md:w-14">
                    <Icon />
                  </span>
                  <span className="text-lg font-semibold md:text-xl">{label}</span>
                </button>
              );
            })}
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-fg transition hover:bg-accent-yellow"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Name"
                className={`${inputClass} ${errors.name ? "border-accent-red" : ""}`}
              />
              {errors.name && <p className="mt-1 text-xs text-accent-red">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Your Email</Label>
              <input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Email"
                className={`${inputClass} ${errors.email ? "border-accent-red" : ""}`}
              />
              {errors.email && <p className="mt-1 text-xs text-accent-red">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone No</Label>
              <div
                className={`flex overflow-hidden rounded-lg border bg-white/5 focus-within:border-primary-light ${
                  errors.phone ? "border-accent-red" : "border-white/25"
                }`}
              >
                <select
                  name="countryCode"
                  value={values.countryCode}
                  onChange={handleChange}
                  aria-label="Country code"
                  className="w-24 border-r border-white/25 bg-transparent px-3 py-3 text-sm text-white outline-none [&>option]:bg-white [&>option]:text-fg"
                >
                  {countryCodes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-accent-red">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="companySize">Your company size</Label>
              <select id="companySize" name="companySize" value={values.companySize} onChange={handleChange} className={inputClass}>
                <option value="">Size</option>
                {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="goal">What are your goals as a {audience}?</Label>
            <select id="goal" name="goal" value={values.goal} onChange={handleChange} className={inputClass}>
              <option value="">Select Your Goal</option>
              {goals.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={5}
              placeholder="Message"
              className={`${inputClass} ${errors.message ? "border-accent-red" : ""}`}
            />
            {errors.message && <p className="mt-1 text-xs text-accent-red">{errors.message}</p>}
          </div>

          <label className="flex items-start gap-2 text-xs text-white/70">
            <input type="checkbox" name="consent" checked={values.consent} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-primary" />
            <span>
              I agree to receive marketing emails, updates and promotional communications. <span className="text-white/50">(Optional)</span>
            </span>
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-xs text-white/60">
              By submitting your message you agree to our{" "}
              <Link to="/terms-and-conditions" className="text-primary-light hover:underline">Terms and Conditions</Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-primary-light hover:underline">Privacy Policy</Link>.
            </p>
            <button
              type="submit"
              className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-light"
            >
              Submit
            </button>
          </div>

          {sent && (
            <p role="status" className="rounded-lg bg-white/10 px-4 py-3 text-sm text-accent-yellow">
              Thanks! Your message has been sent. We'll get back to you soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;