import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Star, Sparkles, Shield, Zap, Rocket, LineChart, MapPin, Calendar, Mail } from "lucide-react";

/**
 * High‑CVR Web Studio – Single‑file site
 * -------------------------------------------------------------
 * Built to your spec:
 * – Psychology‑backed copy & layout (clear value + social proof + scarcity + risk reversal)
 * – Type scale (Major Third 1.25), letter‑spacing, line‑height system
 * – 12‑column grid (desktop) / 4‑column (mobile)
 * – 8‑point spacing system
 * – 60/30/10 color palette with roles
 * – Animated 4‑item showcase carousel (drop‑in your images later)
 * – Three packages with features & CTAs
 * – Contact form with validation (Mr/Ms/Mx/Dr/Prof)
 * – Clean, modern animations via Framer Motion
 *
 * Swap placeholders with your content, then deploy to Netlify.
 */

// Utility: classNames
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Theme tokens (color psychology)
// Neutral (trust, clarity), Secondary (professional depth), Accent (action/competence)
const theme = {
  neutral: "#F5F7FB", // 60% background
  secondary: "#0F172A", // 30% headings/cards
  accent: "#3B82F6", // 10% CTAs (blue -> trust/competence)
  accentHover: "#1D4ED8",
  subtle: "#E5E7EB", // separators
};

// Type scale (Major Third 1.25) rooted at 16px
const typeScale = {
  p: 16,
  h6: 20,
  h5: 25,
  h4: 31.25,
  h3: 39.0625,
  h2: 48.8281,
  h1: 61.0352,
};

// Showcase data (replace image URLs later)
const showcase = [
  {
    title: "Conversion‑first Restaurant Site",
    caption: "Menu sync, Google Maps, bookings – built to sell the visit.",
    bg: "linear-gradient(135deg, #c7d2fe 0%, #93c5fd 100%)",
  },
  {
    title: "Dentist Funnel Redesign",
    caption: "From browse to booking in 2 clicks.",
    bg: "linear-gradient(135deg, #fbcfe8 0%, #fecaca 100%)",
  },
  {
    title: "Gym Landing + Trials",
    caption: "Trial offer + urgency banner lifted sign‑ups.",
    bg: "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)",
  },
  {
    title: "Boutique Barber Studio",
    caption: "Brand, price anchors, and trust badges.",
    bg: "linear-gradient(135deg, #fde68a 0%, #fca5a5 100%)",
  },
];

// Package content
const packages = [
  {
    name: "Starter",
    price: "$900",
    blurb: "2–3 pages, custom design. Mobile + desktop. Modern animations.",
    perfectFor: "Cafés, barbers, freelancers",
    features: [
      "2–3 custom pages",
      "Responsive + performance pass",
      "Simple lead/contact form",
      "Launch in days, not weeks",
    ],
    cta: "Start Starter",
  },
  {
    name: "Growth",
    price: "$2,300",
    blurb:
      "5–7 pages, custom design + SEO. Contact/booking, Maps, integrations, content guidance.",
    perfectFor: "Dentists, gyms, restaurants, small firms",
    features: [
      "5–7 custom pages",
      "On‑page SEO + schema",
      "Contact / booking form + Maps",
      "3rd‑party integrations",
      "Content guidance (no full copy)",
    ],
    highlight: true,
    cta: "Grow with Growth",
  },
  {
    name: "Scale",
    price: "$7,000",
    blurb:
      "10+ pages, full custom design. Strategy (brand/positioning/funnel), advanced SEO + analytics, booking/e‑commerce/CRM, copy support.",
    perfectFor: "Law firms, real estate, healthcare, e‑commerce brands",
    features: [
      "10+ pages, full custom",
      "Strategy session + funnel mapping",
      "Advanced SEO + analytics",
      "Booking systems / e‑commerce",
      "CRM integrations",
      "Copywriting support",
    ],
    cta: "Scale with Scale",
  },
];

export default function WebStudio() {
  // Carousel state
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Auto‑advance showcase every 5s
  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIndex((i) => (i + 1) % showcase.length), 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // Contact form state
  const [form, setForm] = useState({
    title: "Mr",
    first: "",
    last: "",
    email: "",
    project: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.first) errs.first = "Required";
    if (!form.last) errs.last = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.project) errs.project = "Required";
    if (!form.budget) errs.budget = "Required";
    return errs;
  }

  function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // For Netlify, you can switch this to a real submission.
      // See notes in the chat for enabling Netlify forms.
      setSent(true);
    }
  }

  // Memo inline CSS to enforce rules (type scale, letter spacing, line height)
  const styleVars = useMemo(
    () => ({
      "--clr-neutral": theme.neutral,
      "--clr-secondary": theme.secondary,
      "--clr-accent": theme.accent,
      "--clr-accent-hover": theme.accentHover,
      "--clr-subtle": theme.subtle,
      // Type scale
      "--ts-p": `${typeScale.p}px`,
      "--ts-h6": `${typeScale.h6}px`,
      "--ts-h5": `${typeScale.h5}px`,
      "--ts-h4": `${typeScale.h4}px`,
      "--ts-h3": `${typeScale.h3}px`,
      "--ts-h2": `${typeScale.h2}px`,
      "--ts-h1": `${typeScale.h1}px`,
    }),
    []
  );

  return (
    <div style={styleVars} className="min-h-screen bg-[var(--clr-neutral)] text-[var(--clr-secondary)]">
      {/* Global styles enforcing the ruleset */}
      <style>{`
        :root {
          --container: 1280px;
        }
        /* Type scale */
        .ts-p { font-size: var(--ts-p); letter-spacing: 0; line-height: 1.5; }
        .ts-h6 { font-size: var(--ts-h6); letter-spacing: -0.005em; line-height: 1.3; }
        .ts-h5 { font-size: var(--ts-h5); letter-spacing: -0.01em; line-height: 1.3; }
        .ts-h4 { font-size: var(--ts-h4); letter-spacing: -0.012em; line-height: 1.3; }
        .ts-h3 { font-size: var(--ts-h3); letter-spacing: -0.015em; line-height: 1.2; }
        .ts-h2 { font-size: var(--ts-h2); letter-spacing: -0.018em; line-height: 1.1; }
        .ts-h1 { font-size: var(--ts-h1); letter-spacing: -0.02em; line-height: 1.0; }

        /* 12‑col desktop / 4‑col mobile grid */
        .grid-12 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        @media (min-width: 1024px) { .grid-12 { grid-template-columns: repeat(12, 1fr); } }

        /* Card */
        .card { background: white; border: 1px solid var(--clr-subtle); border-radius: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        /* Accent button */
        .btn-accent { background: var(--clr-accent); color: white; }
        .btn-accent:hover { background: var(--clr-accent-hover); }

        /* 8‑point spacing helpers (subset) */
        .pad-16 { padding: 16px; } .pad-24 { padding: 24px; } .pad-32 { padding: 32px; }
        .mar-16 { margin: 16px; } .mar-24 { margin: 24px; } .mar-32 { margin: 32px; }

        /* Focus ring */
        .focus-ring:focus { outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,.35); }
      `}</style>

      {/* Top ribbon (mild scarcity) */}
      <div className="w-full bg-white/70 backdrop-blur sticky top-0 z-50 border-b border-[var(--clr-subtle)]">
        <div className="mx-auto max-w-[var(--container)] px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 ts-h6"><Sparkles className="w-5 h-5"/> High‑CVR sites that look expensive, not loud.</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#work" className="ts-h6 hover:opacity-80">Work</a>
            <a href="#packages" className="ts-h6 hover:opacity-80">Packages</a>
            <a href="#approach" className="ts-h6 hover:opacity-80">Approach</a>
            <a href="#contact" className="ts-h6 hover:opacity-80">Contact</a>
            <a href="#contact" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2"><Calendar className="w-4 h-4"/> Book a strategy call</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          {/* Soft background accent gradients */}
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full" style={{background: "radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 60%)"}} />
          <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full" style={{background: "radial-gradient(ellipse at center, rgba(15,23,42,0.12), transparent 60%)"}} />
        </div>
        <div className="mx-auto max-w-[var(--container)] px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 col-span-4"
            >
              <h1 className="ts-h1 font-semibold mb-6">
                Websites engineered to convert –
                <span className="block text-[var(--clr-accent)]">without stealing the spotlight.</span>
              </h1>
              <p className="ts-h5 text-slate-600 max-w-2xl mb-8">
                I design and build fast, modern sites that feel premium and guide users to one clear action. Psychology‑backed structure. Motion with restraint. Search‑friendly. Easy to update.
              </p>
              <div className="flex items-center gap-4">
                <a href="#packages" className="btn-accent px-6 py-3 rounded-full inline-flex items-center gap-2 ts-h6"><Rocket className="w-4 h-4"/> See packages</a>
                <a href="#work" className="ts-h6 inline-flex items-center gap-2 hover:opacity-80">See 4 showcase projects <ArrowRight className="w-4 h-4"/></a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-slate-500 ts-h6">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4"/> 14‑day polish guarantee</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4"/> Limited to 2 new projects / month</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 col-span-4"
            >
              <div className="card pad-32 relative overflow-hidden">
                <div className="absolute inset-0" style={{background: "radial-gradient(600px 200px at 20% 0%, rgba(59,130,246,.08), transparent), radial-gradient(600px 200px at 80% 100%, rgba(15,23,42,.08), transparent)"}} />
                <div className="relative">
                  <div className="ts-h6 text-slate-500 mb-2">What clients want</div>
                  <ul className="space-y-3">
                    {[
                      "One goal per page (buy/book/call)",
                      "Social proof early + clear value",
                      "Fast, mobile‑first, accessible",
                      "SEO structure and trackable results",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[var(--clr-accent)] mt-0.5"/>
                        <span className="ts-h6">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-8">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {["Restaurants", "Clinics", "Gyms", "Local services"].map((t) => (
              <div key={t} className="ts-h6 text-center text-slate-500">Trusted by {t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase – animated carousel */}
      <section id="work" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <div className="mb-10">
            <h2 className="ts-h2 font-semibold">Showcase projects</h2>
            <p className="ts-h6 text-slate-600 mt-2">Swap each slide background with your image later. Subtle auto‑play with manual control.</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--clr-subtle)]">
            <div className="aspect-[16/9] relative">
              <AnimatePresence mode="wait">{
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                  style={{ background: showcase[index].bg }}
                >
                  {/* Overlay content */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                    <div className="ts-h4 font-semibold">{showcase[index].title}</div>
                    <div className="ts-h6 opacity-90 mt-1">{showcase[index].caption}</div>
                    <div className="mt-4 ts-h6 inline-flex items-center gap-2 opacity-90">
                      <Star className="w-4 h-4"/> Replace with project screenshot
                    </div>
                  </div>
                </motion.div>
              }</AnimatePresence>
            </div>
            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-full">
              {showcase.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i+1}`}
                  className={cx(
                    "w-2.5 h-2.5 rounded-full transition",
                    i === index ? "bg-[var(--clr-accent)] w-6" : "bg-slate-300 hover:bg-slate-400"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 lg:py-24" id="approach">
        <div className="mx-auto max-w-[var(--container)] px-6 grid-12 items-start">
          <div className="col-span-4 lg:col-span-5">
            <h2 className="ts-h2 font-semibold mb-4">A psychology‑backed approach</h2>
            <p className="ts-h6 text-slate-600 max-w-xl">
              Users need to know, trust, like and feel something. I structure pages around one goal, bring value and proof above the fold, reduce friction, and use micro‑interactions that reward intent—not distract from it.
            </p>
          </div>
          <div className="col-span-4 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: LineChart, title: "Clarity > clever", text: "Single goal per page. Clear value, action‑oriented copy, visible CTAs." },
              { icon: Shield, title: "Trust fast", text: "Social proof, guarantees, and transparent pricing reduce risk." },
              { icon: Zap, title: "Instant feedback", text: "Micro‑interactions that guide, not distract. Motion with restraint." },
              { icon: Rocket, title: "Friction down", text: "Mobile‑first speed, accessible contrast, and minimal steps to act." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <Icon className="w-6 h-6 text-[var(--clr-accent)]"/>
                <div className="ts-h5 font-semibold mt-3">{title}</div>
                <p className="ts-h6 text-slate-600 mt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 lg:py-24 bg-white border-y border-[var(--clr-subtle)]">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <h2 className="ts-h2 font-semibold mb-10">Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cx("card p-6 flex flex-col", p.highlight && "ring-2 ring-[var(--clr-accent)]")}
              >
                <div className="flex items-baseline justify-between">
                  <div className="ts-h4 font-semibold">{p.name}</div>
                  <div className="ts-h3 font-semibold">{p.price}</div>
                </div>
                <div className="ts-h6 text-slate-600 mt-1">{p.blurb}</div>
                <div className="ts-h6 text-slate-500 mt-3">Perfect for: {p.perfectFor}</div>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--clr-accent)] mt-0.5"/>
                      <span className="ts-h6">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn-accent px-5 py-2 rounded-full ts-h6 inline-flex items-center gap-2 mt-6 self-start">{p.cta} <ArrowRight className="w-4 h-4"/></a>
              </motion.div>
            ))}
          </div>
          <div className="ts-h6 text-slate-500 mt-6">
            * 14‑day polish guarantee after launch. Need adjustments? I’ll refine quickly.
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-10">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="ts-h4 font-semibold">Two new project slots open this month.</div>
            <a href="#contact" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Calendar className="w-4 h-4"/> Book a strategy call</a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[var(--container)] px-6 grid-12">
          <div className="col-span-4 lg:col-span-5">
            <h2 className="ts-h2 font-semibold">Let’s build something that pays for itself</h2>
            <p className="ts-h6 text-slate-600 mt-2">Genuine questions welcome. Tell me a little about your project and I’ll reply fast.</p>
            <div className="mt-6 flex items-center gap-4 text-slate-600 ts-h6">
              <Mail className="w-5 h-5"/> you@yourstudio.com
            </div>
            <div className="mt-2 flex items-center gap-4 text-slate-600 ts-h6">
              <MapPin className="w-5 h-5"/> Remote • Europe/Oslo
            </div>
          </div>
          <div className="col-span-4 lg:col-span-7">
            <form
              name="contact"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={submit}
              className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />
              {/* Netlify: add data-netlify="true" name="contact" and a hidden input with form-name for production */}
              <div>
                <label className="ts-h6 block mb-1">Title</label>
                <select value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white">
                  {['Mr','Ms','Mx','Dr','Prof','Other'].map(o=> <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="ts-h6 block mb-1">First name</label>
                <input value={form.first} onChange={(e)=>setForm({...form, first:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.first?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Jane"/>
                {errors.first && <div className="ts-h6 text-red-600 mt-1">{errors.first}</div>}
              </div>
              <div>
                <label className="ts-h6 block mb-1">Surname</label>
                <input value={form.last} onChange={(e)=>setForm({...form, last:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.last?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Doe"/>
                {errors.last && <div className="ts-h6 text-red-600 mt-1">{errors.last}</div>}
              </div>
              <div>
                <label className="ts-h6 block mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.email?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="you@company.com"/>
                {errors.email && <div className="ts-h6 text-red-600 mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="ts-h6 block mb-1">Project type</label>
                <input value={form.project} onChange={(e)=>setForm({...form, project:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.project?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Website redesign for a clinic"/>
                {errors.project && <div className="ts-h6 text-red-600 mt-1">{errors.project}</div>}
              </div>
              <div>
                <label className="ts-h6 block mb-1">Budget</label>
                <select value={form.budget} onChange={(e)=>setForm({...form, budget:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.budget?"border-red-400":"border-[var(--clr-subtle)]")}>
                  <option value="">Select…</option>
                  <option>Up to $1,000</option>
                  <option>$1,000 – $2,500</option>
                  <option>$2,500 – $7,000</option>
                  <option>$7,000+</option>
                </select>
                {errors.budget && <div className="ts-h6 text-red-600 mt-1">{errors.budget}</div>}
              </div>
              <div className="md:col-span-2">
                <label className="ts-h6 block mb-1">Message</label>
                <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white" rows={5} placeholder="What’s the goal of the site? Any deadlines?"/>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <div className="ts-h6 text-slate-500">No spam. I reply within 24h.</div>
                <button type="submit" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Mail className="w-4 h-4"/> Send</button>
              </div>
              {sent && <div className="md:col-span-2 ts-h6 text-green-700">Thanks! Your message is in. I’ll respond shortly.</div>}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--clr-subtle)]">
        <div className="mx-auto max-w-[var(--container)] px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="ts-h6">© {new Date().getFullYear()} Your Studio — Modern sites that convert</div>
          <div className="flex items-center gap-4 ts-h6">
            <a href="#packages" className="hover:opacity-80">Pricing</a>
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
