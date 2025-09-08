import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Rocket,
  LineChart,
  MapPin,
  Calendar,
  Mail,
  Menu,
  X,
} from "lucide-react";

/**
 * CITEKS – High-CVR Web Studio (single-file app)
 * Routes: /#/, /#/why-us, /#/brief/:slug, /#/pay/:slug, /#/thank-you, /#/privacy, /#/tech-terms, /#/projects
 */

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Theme
const theme = {
  neutral: "#F5F7FB",
  secondary: "#0F172A",
  accent: "#3B82F6",
  accentHover: "#1D4ED8",
  subtle: "#E5E7EB",
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

/* ------------ PACKAGES (restored) ------------ */
const packages = [
  {
    slug: "starter",
    name: "Starter",
    price: 900,
    displayPrice: "$900",
    days: 4,
    rushDays: 2,
    rushFee: 200,
    blurb: "2–3 pages, custom design. Mobile + desktop. Modern animations.",
    perfectFor: "Cafés, barbers, freelancers",
    features: [
      "2–3 custom pages",
      "Responsive + performance pass",
      "Simple lead/contact form",
      "Launch in days, not weeks",
    ],
    cta: "Start Starter",
    timelineNote:
      "Typical timeline: 4 days (rush 2 days for an additional $200).",
  },
  {
    slug: "growth",
    name: "Growth",
    price: 2300,
    displayPrice: "$2,300",
    days: 8,
    rushDays: 6,
    rushFee: 400,
    blurb:
      "5–7 pages, custom design + SEO. Contact/booking, Maps, integrations, content guidance.",
    perfectFor: "Dentists, gyms, restaurants, small firms",
    features: [
      "5–7 custom pages",
      "On-page SEO + schema",
      "Contact / booking form + Maps",
      "3rd-party integrations",
      "Content guidance (no full copy)",
    ],
    highlight: true,
    cta: "Grow with Growth",
    timelineNote:
      "Typical timeline: 8 days (rush 6 days for an additional $400).",
  },
  {
    slug: "scale",
    name: "Scale",
    price: 7000,
    displayPrice: "$7,000",
    days: 14,
    rushDays: 10,
    rushFee: 800,
    blurb:
      "10+ pages, full custom design. Strategy (brand/positioning/funnel), advanced SEO + analytics, booking/e-commerce/CRM, copy support.",
    perfectFor: "Law firms, real estate, healthcare, e-commerce brands",
    features: [
      "10+ pages, full custom",
      "Strategy session + funnel mapping",
      "Advanced SEO + analytics",
      "Booking systems / e-commerce",
      "CRM integrations",
      "Copywriting support",
    ],
    cta: "Scale with Scale",
    timelineNote:
      "Typical timeline: 14 days (rush 10 days for an additional $800).",
  },
];

/* ------------ PUBLIC images (placed in /public/showcase) ------------ */
const IMGS = {
  law: "/showcase/harbor-sage-law.png",
  gymHero: "/showcase/vigor-lab-hero.png",
  gymPrograms: "/showcase/vigor-lab-programs.png",
  barber: "/showcase/odd-fellow-barber.png",
  museum: "/showcase/meridian-museum.png",
  ai: "/showcase/sentienceworks-ai.png",
};

/* ------------ HOME showcase (4 rotating) ------------ */
const showcase = [
  {
    title: "Harbor & Sage Law",
    caption: "Trust-forward counsel website for a boutique law firm.",
    src: IMGS.law,
    alt: "Homepage of Harbor & Sage Law website",
  },
  {
    title: "Vigor Lab – Gym",
    caption: "High-impact hero with clear trial CTA and value props.",
    src: IMGS.gymHero,
    alt: "Hero section of Vigor Lab gym homepage",
  },
  {
    title: "Odd Fellow Barber",
    caption: "Modern barber site with pricing and quick booking flow.",
    src: IMGS.barber,
    alt: "Barber studio website screenshot",
  },
  {
    title: "Meridian Museum",
    caption: "A showcase-style site for exhibits and visiting info.",
    src: IMGS.museum,
    alt: "Museum showcase website screenshot",
  },
];

/* ------------ Projects page (6 grid items) ------------ */
const allProjects = [
  {
    title: "Harbor & Sage Law",
    role: "Web design • Funnel • Copy support",
    src: IMGS.law,
    alt: "Homepage of Harbor & Sage Law website",
    summary:
      "Clarity-first structure with social proof and transparent services. Focus on booking a consultation.",
  },
  {
    title: "Vigor Lab — Hero",
    role: "Web design • Motion • Conversion copy",
    src: IMGS.gymHero,
    alt: "Hero section of Vigor Lab gym homepage",
    summary:
      "Headline + subline with quick-entry CTAs. Designed to push trials and class schedule exploration.",
  },
  {
    title: "Vigor Lab — Programs",
    role: "Web design • IA • Visual hierarchy",
    src: IMGS.gymPrograms,
    alt: "Programs section for Vigor Lab gym website",
    summary:
      "Simple program cards with benefits and an obvious next step. Reduces friction to sign up.",
  },
  {
    title: "Odd Fellow Barber",
    role: "Web design • Price anchors • Booking",
    src: IMGS.barber,
    alt: "Barber studio website screenshot",
    summary:
      "Premium look, concise pricing, and streamlined booking — built for quick decisions.",
  },
  {
    title: "Meridian Museum",
    role: "Web design • Content structure • Accessibility",
    src: IMGS.museum,
    alt: "Museum showcase website screenshot",
    summary:
      "Showcase-led layout with visiting info surfaced early. Clear paths for exhibits and tickets.",
  },
  {
    title: "SentienceWorks AI",
    role: "Web design • Productization • Narrative",
    src: IMGS.ai,
    alt: "AI integration services website screenshot",
    summary:
      "Story-driven presentation of AI services with proof points and scannable modules.",
  },
];

// Router
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const clean = (hash || "#/").replace(/^#\/?/, "");
  const [path, ...rest] = clean.split("?")[0].split("/").filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(clean.split("?")[1] || ""));
  return { path: path || "", rest, query, raw: hash };
}
function navigate(to) {
  window.location.hash = to.startsWith("#") ? to : `#${to}`;
}

// Netlify form helper
function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

export default function App() {
  const styleVars = useMemo(
    () => ({
      "--clr-neutral": theme.neutral,
      "--clr-secondary": theme.secondary,
      "--clr-accent": theme.accent,
      "--clr-accent-hover": theme.accentHover,
      "--clr-subtle": theme.subtle,
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

  const route = useHashRoute();

  // Scroll request (from Why Us -> Packages)
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTo");
    if (target && (route.path === "" || route.path === "/")) {
      sessionStorage.removeItem("scrollTo");
      const el = document.getElementById(target);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [route.path]);

  return (
    <div
      style={styleVars}
      className="min-h-screen overflow-x-hidden bg-[var(--clr-neutral)] text-[var(--clr-secondary)]"
    >
      <style>{`
        html, body, #root { height: 100%; overflow-x: hidden; }
        :root { --container: 1280px; }

        /* Base type (desktop/tablet) */
        .ts-p { font-size: var(--ts-p); letter-spacing: 0; line-height: 1.5; }
        .ts-h6 { font-size: var(--ts-h6); letter-spacing: -0.005em; line-height: 1.3; }
        .ts-h5 { font-size: var(--ts-h5); letter-spacing: -0.01em; line-height: 1.3; }
        .ts-h4 { font-size: var(--ts-h4); letter-spacing: -0.012em; line-height: 1.3; }
        .ts-h3 { font-size: var(--ts-h3); letter-spacing: -0.015em; line-height: 1.2; }
        .ts-h2 { font-size: var(--ts-h2); letter-spacing: -0.018em; line-height: 1.1; }
        .ts-h1 { font-size: var(--ts-h1); letter-spacing: -0.02em; line-height: 1.0; }

        .grid-12 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        @media (min-width: 1024px) { .grid-12 { grid-template-columns: repeat(12, 1fr); gap: 2rem; } }

        .card { background: white; border: 1px solid var(--clr-subtle); border-radius: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; }
        .btn-accent { background: var(--clr-accent); color: white; }
        .btn-accent:hover { background: var(--clr-accent-hover); }
        .focus-ring:focus { outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,.35); }

        /* MOBILE: shrink ALL type roughly one scale step (your "2 fonts smaller") */
        @media (max-width: 480px){
          :root {
            --ts-p: 14px;          /* down from 16 */
            --ts-h6: 16px;         /* down from 20 */
            --ts-h5: 20px;         /* down from 25 */
            --ts-h4: 25px;         /* down from 31.25 */
            --ts-h3: 31.25px;      /* down from 39.06 */
            --ts-h2: 39.0625px;    /* down from 48.83 */
            --ts-h1: 48.8281px;    /* down from 61.03 (hero fix) */
          }
          .tight-section { padding-top: 16px !important; padding-bottom: 16px !important; }
          .tight-block { margin-bottom: 16px !important; }
          .card { border-radius: 1rem; }
          .card.p-6 { padding: 16px !important; }
          .grid-12 { gap: 16px; }
          .stack-tight > * + * { margin-top: 12px; }
        }
      `}</style>

      <Header />

      {route.path === "" ? (
        <Home />
      ) : route.path === "why-us" ? (
        <WhyUs />
      ) : route.path === "projects" ? (
        <Projects />
      ) : route.path === "brief" && route.rest[0] ? (
        <Brief slug={route.rest[0]} />
      ) : route.path === "pay" && route.rest[0] ? (
        <Pay slug={route.rest[0]} />
      ) : route.path === "thank-you" ? (
        <ThankYou />
      ) : route.path === "privacy" ? (
        <PrivacyPolicy />
      ) : route.path === "tech-terms" ? (
        <TechTerms />
      ) : (
        <NotFound />
      )}

      <Footer />
      <NetlifyHiddenForms />
    </div>
  );
}

/* ---------------- Header ---------------- */

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkAndClose = (handler) => (e) => {
    handler?.(e);
    setOpen(false);
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur sticky top-0 z-50 border-b border-[var(--clr-subtle)]">
      <div className="mx-auto max-w-[var(--container)] px-6 py-2 flex items-center justify-between">
        <a href="#/" className="ts-h6 font-semibold" onClick={() => setOpen(false)}>CITEKS</a>
        <div className="hidden md:flex items-center gap-6 justify-end flex-1">
          <a href="#/" className="ts-h6 hover:opacity-80">Home</a>
          <a href="#/why-us" className="ts-h6 hover:opacity-80">Why us</a>
          <a href="#/projects" className="ts-h6 hover:opacity-80">Projects</a>
          <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('packages');}} className="ts-h6 hover:opacity-80">Packages</a>
          <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('contact');}} className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2"><Mail className="w-4 h-4"/> Contact</a>
        </div>
        <button className="md:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{height:0, opacity:0}}
            animate={{height:"auto", opacity:1}}
            exit={{height:0, opacity:0}}
            className="md:hidden border-t border-[var(--clr-subtle)] bg-white"
          >
            <div className="px-6 py-3 flex flex-col gap-2">
              <a href="#/" onClick={linkAndClose()} className="ts-h6 py-2">Home</a>
              <a href="#/why-us" onClick={linkAndClose()} className="ts-h6 py-2">Why us</a>
              <a href="#/projects" onClick={linkAndClose()} className="ts-h6 py-2">Projects</a>
              <a href="#/" onClick={linkAndClose((e)=>{e.preventDefault(); scrollToId('packages');})} className="ts-h6 py-2">Packages</a>
              <a href="#/" onClick={linkAndClose((e)=>{e.preventDefault(); scrollToId('contact');})} className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2 justify-center mt-2"><Mail className="w-4 h-4"/> Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) {
    sessionStorage.setItem("scrollTo", id);
    navigate("/"); // go home
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------------- Pages ---------------- */

function Home() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIndex((i) => (i + 1) % showcase.length), 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-x-clip">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full"
               style={{background:"radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 60%)"}}/>
          <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full"
               style={{background:"radial-gradient(ellipse at center, rgba(15,23,42,0.12), transparent 60%)"}}/>
        </div>
        <div className="mx-auto max-w-[var(--container)] px-6 pt-12 pb-10 lg:pt-28 lg:pb-24">
          <div className="grid-12 items-center">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}} className="lg:col-span-7 col-span-4">
              <h1 className="ts-h1 font-semibold mb-4">
                Websites engineered to convert -
                <span className="block text-[var(--clr-accent)]">without stealing the spotlight.</span>
              </h1>
              <p className="ts-h5 text-slate-600 max-w-2xl mb-6">
                We design and build fast, modern sites that feel premium and guide users to one clear action. Psychology-backed structure. Motion with restraint. Search-friendly. Easy to update.
              </p>
              <div className="flex items-center gap-4 tight-block">
                <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('packages');}} className="btn-accent px-6 py-3 rounded-full inline-flex items-center gap-2 ts-h6"><Rocket className="w-4 h-4"/> See packages</a>
                <a href="#/projects" className="ts-h6 inline-flex items-center gap-2 hover:opacity-80">View our projects <ArrowRight className="w-4 h-4"/></a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 ts-h6">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4"/> 14-day polish guarantee</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4"/> Limited to 2 new projects this month</div>
              </div>
            </motion.div>

            {/* Showcase Card (rotator) */}
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6, delay:.1}} className="lg:col-span-5 col-span-4">
              <div className="card p-0 relative overflow-hidden">
                {/* Slightly smaller than full page on desktop, not tiny */}
                <div className="relative h-[260px] sm:h-[320px] md:h-[520px] lg:h-[560px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={showcase[index].src + "?v=1"}
                        alt={showcase[index].alt}
                        className="w-full h-full object-cover"
                        loading="eager"
                        onError={(e) => {
                          console.warn("Image failed to load:", e.currentTarget.src);
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.style.background =
                              "linear-gradient(135deg,#e5e7eb,#cbd5e1)";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        <div className="ts-h5 font-semibold">{showcase[index].title}</div>
                        <div className="ts-h6 opacity-90 mt-1">{showcase[index].caption}</div>
                        <div className="mt-3 ts-h6 inline-flex items-center gap-2 opacity-90">
                          <Star className="w-4 h-4"/> From our recent work
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/85 backdrop-blur px-3 py-2 rounded-full">
                  {showcase.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Show slide ${i+1}`}
                      className={cx("h-2.5 rounded-full transition", i === index ? "bg-[var(--clr-accent)] w-6" : "bg-slate-300 w-2.5 hover:bg-slate-400")}
                    />
                  ))}
                </div>
              </div>

              {/* View Projects link under card */}
              <div className="mt-3">
                <a href="#/projects" className="ts-h6 inline-flex items-center gap-2 hover:opacity-80">
                  View all projects <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="py-10 lg:py-24">
        <div className="mx-auto max-w-[var(--container)] px-6 grid-12 items-start">
          <div className="col-span-4 lg:col-span-5">
            <h2 className="ts-h2 font-semibold mb-3">A psychology-backed approach</h2>
            <p className="ts-h6 text-slate-600 max-w-xl">
              Users need to know, trust, like and feel something. We structure pages around one goal, bring value and proof above the fold, reduce friction, and use micro-interactions that reward intent—not distract from it.
            </p>
          </div>
          <div className="col-span-4 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-0">
            {[
              { icon: LineChart, title: "Clarity over clever", text: "Single goal per page. Action-oriented copy. Visible CTAs." },
              { icon: Shield, title: "Trust fast", text: "Social proof, guarantees, and transparent pricing reduce risk." },
              { icon: Zap, title: "Instant feedback", text: "Micro-interactions that guide, not distract. Motion with restraint." },
              { icon: Rocket, title: "Friction down", text: "Mobile-first speed, accessible contrast, and minimal steps to act." },
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
      <section id="packages" className="py-10 lg:py-24 bg-white border-y border-[var(--clr-subtle)]">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <h2 className="ts-h2 font-semibold mb-6">Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((p) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cx("card p-6 flex flex-col", p.highlight && "ring-2 ring-[var(--clr-accent)]")}
              >
                <div className="flex items-baseline justify-between">
                  <div className="ts-h4 font-semibold">{p.name}</div>
                  <div className="ts-h3 font-semibold">{p.displayPrice}</div>
                </div>
                <div className="ts-h6 text-slate-600 mt-1">{p.blurb}</div>
                <div className="ts-h6 text-slate-500 mt-2">Perfect for: {p.perfectFor}</div>
                <div className="ts-h6 text-slate-600 mt-2">{p.timelineNote}</div>
                <ul className="mt-3 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[var(--clr-accent)] mt-0.5"/>
                      <span className="ts-h6">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`#/brief/${p.slug}`}
                  className="btn-accent px-5 py-2 rounded-full ts-h6 inline-flex items-center gap-2 mt-5 self-start"
                >
                  {p.cta} <ArrowRight className="w-4 h-4"/>
                </a>
              </motion.div>
            ))}
          </div>
          <div className="ts-h6 text-slate-500 mt-6">
            * 14-day polish guarantee after launch. Need adjustments? We’ll refine quickly.
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-8 tight-section">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="ts-h4 font-semibold">Two new project slots open this month.</div>
            <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('contact');}} className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Calendar className="w-4 h-4"/> Contact</a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-10 lg:py-24 tight-section">
        <div className="mx-auto max-w-[var(--container)] px-6 grid-12">
          <div className="col-span-4 lg:col-span-5">
            <h2 className="ts-h2 font-semibold">Let’s build something that pays for itself</h2>
            <p className="ts-h6 text-slate-600 mt-2">Genuine questions welcome. Tell us a little about your project and we’ll reply fast.</p>
            <div className="mt-6 flex items-center gap-4 text-slate-600 ts-h6">
              <Mail className="w-5 h-5"/> contact@citeks.net
            </div>
            <div className="mt-2 flex items-center gap-4 text-slate-600 ts-h6">
              <MapPin className="w-5 h-5"/> Langmyrvegen 22a • Europe/Oslo
            </div>
          </div>
          <div className="col-span-4 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

/* -------- Projects page -------- */

function Projects() {
  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <div className="mb-6">
          <h1 className="ts-h2 font-semibold">Selected projects</h1>
          <p className="ts-h6 text-slate-600 max-w-2xl mt-2">
            A few builds we like — less talk, more results. Clear structure, fast performance,
            and design that guides users to action without shouting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allProjects.map((p) => (
            <div key={p.title} className="card overflow-hidden">
              <div className="relative h-[220px] sm:h-[280px] md:h-[360px]">
                <img
                  src={p.src + "?v=1"}
                  alt={p.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.warn("Image failed to load:", e.currentTarget.src);
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.style.background = "linear-gradient(135deg,#e5e7eb,#cbd5e1)";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <div className="ts-h5 font-semibold">{p.title}</div>
                  <div className="ts-h6 opacity-90">{p.role}</div>
                </div>
              </div>
              <div className="p-4 md:p-6 ts-h6 text-slate-700">
                {p.summary}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a
            href="#/"
            className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"
          >
            Back to home <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h1 font-semibold mb-4">Why choose CITEKS</h1>
        <p className="ts-h6 text-slate-600 max-w-3xl">
          We combine clear information architecture with persuasive but honest messaging. Our pages center on a single goal, present value and proof early, reduce cognitive load, and remove friction so people can act with confidence. We keep motion purposeful and copy specific. You get a site that looks premium and quietly guides users to say yes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[
            ["Clarity beats clever", "People decide faster when choices are fewer, labels are plain, and the next step is obvious. We design for scanning and quick decisions."],
            ["Trust quickly", "We surface proof early — reviews, results, guarantees, and transparent pricing — to lower perceived risk and boost confidence."],
            ["Friction kills conversions", "We cut unnecessary steps, optimize forms, and keep load times tight. The easiest path wins."],
            ["Motion with restraint", "Micro-interactions reward intent and provide feedback without stealing attention from the goal."],
          ].map(([title, text]) => (
            <div key={title} className="card p-6">
              <div className="ts-h4 font-semibold">{title}</div>
              <p className="ts-h6 text-slate-600 mt-2">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem("scrollTo", "packages");
              navigate("/");
            }}
            className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"
          >
            See packages <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h2 font-semibold mb-2">Page not found</h1>
        <a href="#/" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2">Go home</a>
      </div>
    </section>
  );
}

/* ---------------- Forms ---------------- */

function ContactForm() {
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

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      "form-name": "contact",
      ...form,
    };
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(payload),
      });
      setSent(true);
    } catch {
      alert("Submission failed. Please email contact@citeks.net");
    }
  }

  return (
    <form
      name="contact"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={submit}
      className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />
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
        <div className="ts-h6 text-slate-500">No spam. We reply within 24h.</div>
        <button type="submit" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Mail className="w-4 h-4"/> Send</button>
      </div>
      {sent && <div className="md:col-span-2 ts-h6 text-green-700">Thanks! Your message is in. We’ll respond shortly.</div>}
    </form>
  );
}

/* ---------------- Brief (required + file upload) ---------------- */

function Brief({ slug }) {
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) return <NotFound />;

  const [rush, setRush] = useState(false);
  const total = pkg.price + (rush ? pkg.rushFee : 0);

  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    pages: "",
    goal: "",
    assetsNote: "",
    seo: "",
    integrations: "",
    ecommerce: "",
    crm: "",
    references: "",
    competitors: "",
    notes: "",
  });
  const [files, setFiles] = useState([]); // uploaded asset files
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.company) e.company = "Required";
    if (!form.contact) e.contact = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone) e.phone = "Required";
    if (!form.pages) e.pages = "Required";
    if (!form.goal) e.goal = "Required";
    if (!form.assetsNote && (!files || files.length === 0)) {
      e.assetsNote = "Provide either a note or upload at least one asset file";
    }
    return e;
  }

  async function submitBrief(e) {
    e.preventDefault();
    const e1 = validate();
    setErrors(e1);
    if (Object.keys(e1).length) return;

    const fd = new FormData();
    fd.append("form-name", `brief-${pkg.slug}`);
    fd.append("package", pkg.name);
    fd.append("rush", rush ? "Yes" : "No");
    fd.append("total", `$${total}`);

    Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
    if (files?.length) Array.from(files).forEach((f) => fd.append("assetsFiles", f));

    try {
      await fetch("/", { method: "POST", body: fd });
      navigate(`/pay/${pkg.slug}?rush=${rush ? "1" : "0"}`);
    } catch {
      alert("Submission failed. Please email contact@citeks.net");
    }
  }

  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h2 font-semibold">{pkg.name} brief</h1>
        <p className="ts-h6 text-slate-600 mt-1">
          {pkg.displayPrice} · Typical timeline: {pkg.days} days
          {` (rush ${pkg.rushDays} days +$${pkg.rushFee})`}
        </p>

        <form
          name={`brief-${pkg.slug}`}
          data-netlify="true"
          netlify-honeypot="bot-field"
          encType="multipart/form-data"
          onSubmit={submitBrief}
          className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          <input type="hidden" name="form-name" value={`brief-${pkg.slug}`} />
          <input type="hidden" name="bot-field" />

          <div className="md:col-span-2 ts-h6 text-slate-600">
            Optional rush delivery will be displayed in your total and can also be toggled on the payment page.
          </div>

          {/* Required */}
          <FormField label="Company / brand" value={form.company} onChange={(v)=>setForm({...form, company:v})} error={errors.company}/>
          <FormField label="Contact name" value={form.contact} onChange={(v)=>setForm({...form, contact:v})} error={errors.contact}/>
          <FormField label="Email" type="email" value={form.email} onChange={(v)=>setForm({...form, email:v})} error={errors.email}/>
          <FormField label="Phone" value={form.phone} onChange={(v)=>setForm({...form, phone:v})} error={errors.phone}/>

          {/* Required */}
          <FormField label="Goal of the site" textarea value={form.goal} onChange={(v)=>setForm({...form, goal:v})} error={errors.goal}/>
          <FormField label="Estimated pages" value={form.pages} onChange={(v)=>setForm({...form, pages:v})} error={errors.pages}/>

          {/* Assets: note or files required */}
          <FormField
            label="Available assets (logo, photos, copy?) – brief notes"
            textarea
            value={form.assetsNote}
            onChange={(v)=>setForm({...form, assetsNote:v})}
            error={errors.assetsNote}
          />
          <div>
            <label className="ts-h6 block mb-1">Upload assets (images, logos, docs)</label>
            <input
              name="assetsFiles"
              type="file"
              multiple
              onChange={(e)=>setFiles(e.target.files)}
              className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 bg-white"
            />
            <div className="ts-h6 text-slate-500 mt-1">You can upload multiple files. No previews; we’ll receive them attached.</div>
          </div>

          {/* Optional */}
          <FormField label="SEO targets (keywords/locations)" textarea value={form.seo} onChange={(v)=>setForm({...form, seo:v})}/>
          <FormField label="Integrations (maps, booking, payments)" value={form.integrations} onChange={(v)=>setForm({...form, integrations:v})}/>
          <FormField label="E-commerce (if needed)" value={form.ecommerce} onChange={(v)=>setForm({...form, ecommerce:v})}/>
          <FormField label="CRM (if needed)" value={form.crm} onChange={(v)=>setForm({...form, crm:v})}/>
          <FormField label="Reference sites (what you like)" textarea value={form.references} onChange={(v)=>setForm({...form, references:v})}/>
          <FormField label="Competitors" value={form.competitors} onChange={(v)=>setForm({...form, competitors:v})}/>
          <FormField label="Notes / constraints" textarea value={form.notes} onChange={(v)=>setForm({...form, notes:v})}/>

          {/* Rush */}
          <div className="md:col-span-2 flex items-center justify-between border-t border-[var(--clr-subtle)] pt-4 mt-2">
            <label className="ts-h6 flex items-center gap-2">
              <input type="checkbox" checked={rush} onChange={(e)=>setRush(e.target.checked)} />
              Rush delivery: finish in {pkg.rushDays} days (+${pkg.rushFee})
            </label>
            <div className="ts-h5 font-semibold">Total: ${total}</div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button type="submit" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FormField({ label, value, onChange, textarea, type = "text", error }) {
  return (
    <div>
      <label className="ts-h6 block mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          rows={4}
          className={cx("w-full border rounded-lg p-3 focus-ring bg-white", error?"border-red-400":"border-[var(--clr-subtle)]")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          className={cx("w-full border rounded-lg p-3 focus-ring bg-white", error?"border-red-400":"border-[var(--clr-subtle)]")}
        />
      )}
      {error && <div className="ts-h6 text-red-600 mt-1">{error}</div>}
    </div>
  );
}

/* ---------------- Payment (Embedded Checkout) ---------------- */

function Pay({ slug }) {
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) return <NotFound />;

  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const initialRush = params.get("rush") === "1";

  const [rush, setRush] = useState(initialRush);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    async function go() {
      try {
        const res = await fetch("/.netlify/functions/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            rush,
            origin: window.location.origin,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create session");
        }

        const { clientSecret } = await res.json();
        setClientSecret(clientSecret);
        setError("");
      } catch (e) {
        try {
          const parsed = JSON.parse(e.message);
          setError(parsed.error || "Could not start checkout. Please email contact@citeks.net.");
        } catch {
          setError(e.message || "Could not start checkout. Please email contact@citeks.net.");
        }
      }
    }
    go();
  }, [slug, rush]);

  useEffect(() => {
    let cleanup = () => {};
    async function mount() {
      if (!clientSecret || !containerRef.current) return;

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || window.STRIPE_PUBLISHABLE_KEY
      );
      if (!stripe) { setError("Stripe not available."); return; }

      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
      checkout.mount(containerRef.current);
      cleanup = () => checkout.destroy();
    }
    mount();
    return () => cleanup();
  }, [clientSecret]);

  const total = pkg.price + (rush ? pkg.rushFee : 0);

  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h2 font-semibold">Payment</h1>

        <div className="card p-6 mt-6">
          <div className="ts-h4 font-semibold">{pkg.name}</div>
          <div className="ts-h6 text-slate-600 mt-1">
            Base price {pkg.displayPrice}. Typical timeline {pkg.days} days.
          </div>

        <div className="flex items-center justify-between mt-4">
            <label className="ts-h6 flex items-center gap-2">
              <input
                type="checkbox"
                checked={rush}
                onChange={(e) => setRush(e.target.checked)}
              />
              Rush delivery: finish in {pkg.rushDays} days (+${pkg.rushFee})
            </label>
            <div className="ts-h4 font-semibold">Total: ${total}</div>
          </div>

          <div className="mt-6">
            {error && (
              <div className="ts-h6 text-red-600 mb-3 whitespace-pre-wrap">
                {error}
              </div>
            )}
            <div ref={containerRef} id="checkout" className="w-full" />
          </div>

          <div className="mt-4 ts-h6 text-slate-500">
            Secure payment powered by Stripe.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Thank You (with session summary) ---------------- */

function ThankYou() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const sessionId = new URLSearchParams(window.location.hash.split("?")[1] || "").get("session_id");

  useEffect(() => {
    async function load() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/.netlify/functions/session-status?session_id=${encodeURIComponent(sessionId)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed");
        setSummary(json);
      } catch (e) {
        setError("We received your payment, but couldn’t load the details. We’ll email you shortly.");
      }
    }
    load();
  }, [sessionId]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h2 font-semibold mb-2">Thank you!</h1>
        <p className="ts-h6 text-slate-600">
          Your payment was received. We’ll email you shortly from <b>contact@citeks.net</b> with next steps.
        </p>

        {summary && (
          <div className="card p-6 mt-6">
            <div className="ts-h5 font-semibold">Purchase summary</div>
            <div className="ts-h6 text-slate-600 mt-2 stack-tight">
              <div><b>Status:</b> {summary.payment_status}</div>
              <div><b>Transaction ID:</b> {summary.payment_intent_id}</div>
              <div><b>Package:</b> {summary.metadata?.package || "—"}</div>
              <div><b>Rush:</b> {summary.metadata?.rush === "true" ? "Yes" : "No"}</div>
              <div><b>Total:</b> {summary.amount_total
                ? `$${(summary.amount_total/100).toFixed(2)} ${summary.currency?.toUpperCase()}`
                : "—"}</div>
            </div>
            <div className="ts-h6 text-slate-600 mt-3">
              Forgot to include something in your brief? Send a message via the <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('contact');}} className="underline">contact form</a> and include your Transaction ID above. We’ll attach your note to the project.
            </div>
          </div>
        )}
        {error && <div className="ts-h6 text-red-600 mt-4">{error}</div>}

        <a href="#/" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2 mt-6">Back to home</a>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="pt-10 border-t border-[var(--clr-subtle)] bg-white">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="ts-h5 font-semibold">CITEKS</div>
            <div className="ts-h6 text-slate-600 mt-2">Modern sites that convert.</div>
            <div className="ts-h6 text-slate-600 mt-2">Langmyrvegen 22a • Europe/Oslo</div>
            <a href="mailto:contact@citeks.net" className="ts-h6 text-[var(--clr-accent)] underline mt-2 inline-block">contact@citeks.net</a>
          </div>
          <div>
            <div className="ts-h6 font-semibold mb-2">Navigate</div>
            <ul className="ts-h6 text-slate-700 space-y-2">
              <li><a href="#/" className="hover:opacity-80">Home</a></li>
              <li><a href="#/why-us" className="hover:opacity-80">Why us</a></li>
              <li><a href="#/projects" className="hover:opacity-80">Projects</a></li>
              <li><a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('contact');}} className="hover:opacity-80">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="ts-h6 font-semibold mb-2">Info</div>
            <ul className="ts-h6 text-slate-700 space-y-2">
              <li><a href="#/privacy" className="hover:opacity-80">Privacy</a></li>
              <li><a href="#/tech-terms" className="hover:opacity-80">Technical terms</a></li>
            </ul>
          </div>
          <div>
            <div className="ts-h6 font-semibold mb-2">Follow</div>
            <ul className="ts-h6 text-slate-700 space-y-2">
              <li><a href="https://www.linkedin.com/company/108523228" target="_blank" rel="noreferrer" className="hover:opacity-80">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/citeks_net/" target="_blank" rel="noreferrer" className="hover:opacity-80">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-6 border-t border-[var(--clr-subtle)] mt-8">
          <div className="ts-h6">© {new Date().getFullYear()} CITEKS — All rights reserved</div>
          <div className="ts-h6">
            <a href="#/" onClick={(e)=>{e.preventDefault(); scrollToId('packages');}} className="hover:opacity-80">Pricing</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Hidden pages ---------------- */

function PrivacyPolicy() {
  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h1 font-semibold mb-4">Privacy Policy</h1>
        <div className="card p-6 ts-h6 text-slate-700 space-y-3">
          <p><b>Who we are.</b> CITEKS is a web design studio focused on fast, modern websites that convert. You can reach us at contact@citeks.net.</p>
          <p><b>What we collect.</b> When you submit the contact form or a project brief, we collect the information you provide (e.g., name, email, company, project details) and any files you upload. We do not use cookies.</p>
          <p><b>How we use data.</b> We use your details to respond, prepare proposals, deliver services, process payments (via Stripe), and maintain records for accounting and legal compliance.</p>
          <p><b>How we share.</b> We only share data with service providers needed to operate (e.g., Netlify for hosting, Stripe for payments). We don’t sell personal data.</p>
          <p><b>Retention.</b> We keep information only as long as needed to provide services and meet legal obligations, then delete or anonymize it.</p>
          <p><b>Security.</b> We use reputable providers (Netlify/Stripe) with modern security. No method is 100% secure, but we take reasonable steps to protect your data.</p>
          <p><b>Your rights.</b> You can request access, correction, or deletion of your data by emailing contact@citeks.net.</p>
          <p><b>International.</b> We may process data in the EEA and other locations through our providers. Transfers use appropriate safeguards provided by those providers.</p>
          <p><b>Updates.</b> We may update this policy as our services change. We’ll post the new version here.</p>
        </div>
        <a href="#/" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2 mt-6">Back to home</a>
      </div>
    </section>
  );
}

function TechTerms() {
  const rows = [
    ["CTA (Call to Action)", "The primary action you want a visitor to take (e.g., call, book, buy)."],
    ["Conversion rate (CVR)", "Percentage of visitors who complete the desired action."],
    ["IA (Information Architecture)", "How content is structured and labeled for easy navigation."],
    ["Responsive", "Layouts that adapt to different screen sizes (mobile/desktop)."],
    ["SEO", "Optimizing content and structure so search engines can find and rank pages."],
    ["Schema", "Structured data markup that helps search engines understand your content."],
    ["CRM", "A system to track leads/customers and integrate forms/booking."],
    ["Analytics", "Tracking user behavior and performance (e.g., conversions)."],
    ["Accessibility", "Designing so people of all abilities can use the site (contrast, keyboard, labels)."],
    ["Performance", "How quickly a page loads and responds to interaction."],
  ];

  return (
    <section className="py-10 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h1 font-semibold mb-4">Technical terms</h1>
        <div className="card p-6">
          <ul className="ts-h6 text-slate-700 space-y-2">
            {rows.map(([term, def]) => (
              <li key={term}><b>{term}:</b> {def}</li>
            ))}
          </ul>
        </div>
        <a href="#/" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2 mt-6">Back to home</a>
      </div>
    </section>
  );
}

/* ---------------- Netlify: Hidden forms so they are detected at build ---------------- */

function NetlifyHiddenForms() {
  return (
    <div style={{display:"none"}}>
      <form name="brief-starter" data-netlify="true" encType="multipart/form-data">
        <input name="company" />
        <input name="assetsFiles" type="file" />
      </form>
      <form name="brief-growth" data-netlify="true" encType="multipart/form-data">
        <input name="company" />
        <input name="assetsFiles" type="file" />
      </form>
      <form name="brief-scale" data-netlify="true" encType="multipart/form-data">
        <input name="company" />
        <input name="assetsFiles" type="file" />
      </form>
      <form name="contact" data-netlify="true">
        <input name="first" />
      </form>
    </div>
  );
}
