// ContactForm.jsx
import { useState } from "react";
import { companySizes, buyerGoals } from "../../data/linkbuilding";

const initialValues = {
  name: "", email: "", phone: "", companySize: "", goal: "", message: "", consent: false,
};

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-primary-light";

const ContactForm = () => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: send to your backend
    console.log(values);
    setValues(initialValues);
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-surface py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2>Let's get in touch.</h2>
          <p className="mt-4 text-muted">
            Share your goals and our team will get back to you with a tailored link
            building plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-background p-6">
          <input name="name" value={values.name} onChange={handleChange} placeholder="Your Name" required className={inputClass} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="Your Email" required className={inputClass} />
            <input type="tel" name="phone" value={values.phone} onChange={handleChange} placeholder="Phone No" className={inputClass} />
          </div>

          <select name="companySize" value={values.companySize} onChange={handleChange} className={inputClass}>
            <option value="">Your company size</option>
            {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select name="goal" value={values.goal} onChange={handleChange} className={inputClass}>
            <option value="">What are your goals as a buyer?</option>
            {buyerGoals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <textarea name="message" value={values.message} onChange={handleChange} rows={4} placeholder="Message" className={inputClass} />

          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" name="consent" checked={values.consent} onChange={handleChange} className="mt-0.5" />
            I agree to receive marketing emails and updates (optional).
          </label>

          <button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-light">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;