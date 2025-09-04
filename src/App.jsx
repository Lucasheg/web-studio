import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Star, Sparkles, Shield, Zap, Rocket, LineChart, MapPin, Mail, Menu, X } from "lucide-react";

// CITEKS — High-CVR Web Studio (single-file React app)
// Implements: brand rename, we-voice, header CTA change, Why Us page, monthly copy, dash cleanup,
// package-specific brief pages, improved mobile menu, and your design rules.

function cx(...classes) { return classes.filter(Boolean).join(" "); }

const theme = {
  neutral: "#F5F7FB",
  secondary: "#0F172A",
  accent: "#3B82F6",
  accentHover: "#1D4ED8",
  subtle: "#E5E7EB",
};

const typeScale = { p:16, h6:20, h5:25, h4:31.25, h3:39.0625, h2:48.8281, h1:61.0352 };

const showcase = [
  { title: "Restaurant site built to convert", caption: "Menu sync, Maps, and bookings.", bg: "linear-gradient(135deg, #c7d2fe 0%, #93c5fd 100%)" },
  { title: "Clinic funnel redesign", caption: "From browse to booking in 2 clicks.", bg: "linear-gradient(135deg, #fbcfe8 0%, #fecaca 100%)" },
  { title: "Gym trials boost", caption: "Trial offer plus urgency lifted signups.", bg: "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)" },
  { title: "Barber studio brand", caption: "Anchors and trust badges.", bg: "linear-gradient(135deg, #fde68a 0%, #fca5a5 100%)" },
];

const packages = [
  { name: "Starter", slug: "starter", price: "$900", blurb: "2-3 pages. Custom design. Mobile and desktop. Modern animations.", perfectFor: "Cafes, barbers, freelancers", features: ["2-3 custom pages","Responsive and fast","Simple lead or contact form","Launch in days"], cta: "Start Starter" },
  { name: "Growth", slug: "growth", price: "$2,300", blurb: "5-7 pages, custom design plus SEO. Contact or booking, Maps, integrations, content guidance.", perfectFor: "Dentists, gyms, restaurants, small firms", features: ["5-7 custom pages","On-page SEO and schema","Contact or booking plus Maps","Integrations","Content guidance (no full copy)"], cta: "Start Growth", highlight: true },
  { name: "Scale", slug: "scale", price: "$7,000", blurb: "10+ pages, full custom. Strategy, advanced SEO and analytics, bookings or e-commerce, CRM, copy support.", perfectFor: "Law firms, real estate, healthcare, e-commerce brands", features: ["10+ pages","Strategy session and funnel mapping","Advanced SEO and analytics","Booking systems or e-commerce","CRM integrations","Copywriting support"], cta: "Start Scale" },
];

function useRoute(){
  const [route, setRoute] = useState(window.location.hash || "#/");
  useEffect(()=>{ const onHash=()=> setRoute(window.location.hash || "#/"); window.addEventListener("hashchange", onHash); return ()=> window.removeEventListener("hashchange", onHash); },[]);
  return route;
}
function navigate(to){ window.location.hash = to; }

function useStyleVars(){
  return useMemo(()=>({
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
  }),[]);
}

function Nav(){
  const [open,setOpen]=useState(false);
  return (
    <div className="w-full bg-white/70 backdrop-blur sticky top-0 z-50 border-b border-[var(--clr-subtle)]">
      <div className="mx-auto max-w-[var(--container)] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 ts-h6 select-none"><Sparkles className="w-5 h-5"/><span className="font-semibold">CITEKS</span></div>
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <a href="#work" className="ts-h6 hover:opacity-80">Work</a>
          <a href="#packages" className="ts-h6 hover:opacity-80">Packages</a>
          <a href="#/why-us" className="ts-h6 hover:opacity-80">Why us</a>
          <a href="#contact" className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center gap-2">Contact</a>
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-white" aria-label="Open menu" onClick={()=>setOpen(true)}><Menu className="w-6 h-6"/></button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="md:hidden border-t border-[var(--clr-subtle)] bg-white">
            <div className="mx-auto max-w-[var(--container)] px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="ts-h6 font-semibold">CITEKS</div>
                <button className="p-2" aria-label="Close menu" onClick={()=>setOpen(false)}><X className="w-6 h-6"/></button>
              </div>
              <div className="mt-3 grid gap-2">
                <a href="#work" onClick={()=>setOpen(false)} className="ts-h6 py-2">Work</a>
                <a href="#packages" onClick={()=>setOpen(false)} className="ts-h6 py-2">Packages</a>
                <a href="#/why-us" onClick={()=>setOpen(false)} className="ts-h6 py-2">Why us</a>
                <a href="#contact" onClick={()=>setOpen(false)} className="ts-h6 btn-accent px-5 py-2 rounded-full inline-flex items-center justify-center">Contact</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero(){
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full" style={{background:"radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 60%)"}}/>
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full" style={{background:"radial-gradient(ellipse at center, rgba(15,23,42,0.12), transparent 60%)"}}/>
      </div>
      <div className="mx-auto max-w-[var(--container)] px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid-12 items-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="lg:col-span-7 col-span-4">
            <h1 className="ts-h1 font-semibold mb-6">
              Websites engineered to convert, without stealing the spotlight.
              <span className="block text-[var(--clr-accent)]">Built by CITEKS.</span>
            </h1>
            <p className="ts-h5 text-slate-600 max-w-2xl mb-8">We design and build fast, modern sites that feel premium and guide users to one clear action. Psychology backed structure. Motion with restraint. Search friendly. Easy to update.</p>
            <div className="flex items-center gap-4">
              <a href="#packages" className="btn-accent px-6 py-3 rounded-full inline-flex items-center gap-2 ts-h6"><Rocket className="w-4 h-4"/> See packages</a>
              <a href="#work" className="ts-h6 inline-flex items-center gap-2 hover:opacity-80">See 4 showcase projects <ArrowRight className="w-4 h-4"/></a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-slate-500 ts-h6">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4"/> 14 day polish guarantee</div>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4"/> Limited to 2 new projects this month</div>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,delay:0.1}} className="lg:col-span-5 col-span-4">
            <div className="card pad-32 relative overflow-hidden">
              <div className="absolute inset-0" style={{background:"radial-gradient(600px 200px at 20% 0%, rgba(59,130,246,.08), transparent), radial-gradient(600px 200px at 80% 100%, rgba(15,23,42,.08), transparent)"}}/>
              <div className="relative">
                <div className="ts-h6 text-slate-500 mb-2">What clients want</div>
                <ul className="space-y-3">
                  {["One goal per page (buy, book, or call)","Social proof early and clear value","Fast, mobile first, accessible","SEO structure and trackable results"].map(t=> (
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
  );
}

function TrustRow(){
  return (
    <section className="py-8">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {["Restaurants","Clinics","Gyms","Local services"].map(t=> <div key={t} className="ts-h6 text-center text-slate-500">Trusted by {t}</div>)}
        </div>
      </div>
    </section>
  );
}

function Showcase(){
  const [index,setIndex]=useState(0);
  const timeoutRef=useRef(null);
  useEffect(()=>{ if(timeoutRef.current) clearTimeout(timeoutRef.current); timeoutRef.current=setTimeout(()=> setIndex(i=> (i+1)%showcase.length),5000); return ()=> clearTimeout(timeoutRef.current); },[index]);
  return (
    <section id="work" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <div className="mb-10">
          <h2 className="ts-h2 font-semibold">Showcase projects</h2>
          <p className="ts-h6 text-slate-600 mt-2">Swap each slide background with your image later. Subtle auto play with manual control.</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[var(--clr-subtle)]">
          <div className="aspect-[16/9] relative">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.02}} transition={{duration:0.6}} className="absolute inset-0" style={{background: showcase[index].bg}}>
                <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                  <div className="ts-h4 font-semibold">{showcase[index].title}</div>
                  <div className="ts-h6 opacity-90 mt-1">{showcase[index].caption}</div>
                  <div className="mt-4 ts-h6 inline-flex items-center gap-2 opacity-90"><Star className="w-4 h-4"/> Replace with project screenshot</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-full">
            {showcase.map((_,i)=> <button key={i} onClick={()=>setIndex(i)} aria-label={`Show slide ${i+1}`} className={cx("w-2.5 h-2.5 rounded-full transition", i===index?"bg-[var(--clr-accent)] w-6":"bg-slate-300 hover:bg-slate-400")} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Approach(){
  return (
    <section className="py-16 lg:py-24" id="approach">
      <div className="mx-auto max-w-[var(--container)] px-6 grid-12 items-start">
        <div className="col-span-4 lg:col-span-5">
          <h2 className="ts-h2 font-semibold mb-4">A psychology backed approach</h2>
          <p className="ts-h6 text-slate-600 max-w-xl">Users need to know, trust, like and feel something. We structure pages around one goal, surface value and proof early, reduce friction, and use micro interactions that reward intent without distraction.</p>
        </div>
        <div className="col-span-4 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: LineChart, title: "Clarity over clever", text: "Single goal per page. Action oriented copy. Visible CTAs." },
            { icon: Shield, title: "Trust fast", text: "Social proof, guarantees, and transparent pricing reduce risk." },
            { icon: Zap, title: "Instant feedback", text: "Micro interactions that guide. Motion with restraint." },
            { icon: Rocket, title: "Friction down", text: "Mobile first speed, accessible contrast, and minimal steps to act." },
          ].map(({icon:Icon,title,text})=> (
            <div key={title} className="card p-6">
              <Icon className="w-6 h-6 text-[var(--clr-accent)]"/>
              <div className="ts-h5 font-semibold mt-3">{title}</div>
              <p className="ts-h6 text-slate-600 mt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages(){
  return (
    <section id="packages" className="py-16 lg:py-24 bg-white border-y border-[var(--clr-subtle)]">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h2 className="ts-h2 font-semibold mb-10">Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(p=> (
            <motion.div key={p.name} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}} className={cx("card p-6 flex flex-col", p.highlight && "ring-2 ring-[var(--clr-accent)]")}>
              <div className="flex items-baseline justify-between">
                <div className="ts-h4 font-semibold">{p.name}</div>
                <div className="ts-h3 font-semibold">{p.price}</div>
              </div>
              <div className="ts-h6 text-slate-600 mt-1">{p.blurb}</div>
              <div className="ts-h6 text-slate-500 mt-3">Perfect for: {p.perfectFor}</div>
              <ul className="mt-4 space-y-2">
                {p.features.map(f=> (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[var(--clr-accent)] mt-0.5"/>
                    <span className="ts-h6">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={()=>navigate(`#/brief/${p.slug}`)} className="btn-accent px-5 py-2 rounded-full ts-h6 inline-flex items-center gap-2 mt-6 self-start">{p.cta} <ArrowRight className="w-4 h-4"/></button>
            </motion.div>
          ))}
        </div>
        <div className="ts-h6 text-slate-500 mt-6">* 14 day polish guarantee after launch. Need adjustments? We refine quickly.</div>
      </div>
    </section>
  );
}

function CTA(){
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="ts-h4 font-semibold">Two new project slots open this month.</div>
          <a href="#contact" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Mail className="w-4 h-4"/> Contact</a>
        </div>
      </div>
    </section>
  );
}

function Contact(){
  const [form,setForm]=useState({ title:"Mr", first:"", last:"", email:"", project:"", budget:"", message:"" });
  const [sent,setSent]=useState(false);
  const [errors,setErrors]=useState({});
  function validate(){ const e={}; if(!form.first) e.first="Required"; if(!form.last) e.last="Required"; if(!form.email.includes("@")) e.email="Enter a valid email"; if(!form.project) e.project="Required"; if(!form.budget) e.budget="Required"; return e; }
  function submit(ev){ ev.preventDefault(); const e=validate(); setErrors(e); if(Object.keys(e).length===0){ setSent(true); } }
  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[var(--container)] px-6 grid-12">
        <div className="col-span-4 lg:col-span-5">
          <h2 className="ts-h2 font-semibold">Let us build something that pays for itself</h2>
          <p className="ts-h6 text-slate-600 mt-2">Genuine questions welcome. Tell us a little about your project and we will reply fast.</p>
          <div className="mt-6 flex items-center gap-4 text-slate-600 ts-h6"><Mail className="w-5 h-5"/> hello@citeks.com</div>
          <div className="mt-2 flex items-center gap-4 text-slate-600 ts-h6"><MapPin className="w-5 h-5"/> Remote • Europe/Oslo</div>
        </div>
        <div className="col-span-4 lg:col-span-7">
          <form name="contact" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="hidden" name="form-name" value="contact"/>
            <input type="hidden" name="bot-field"/>
            <div>
              <label className="ts-h6 block mb-1">Title</label>
              <select value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white">{['Mr','Ms','Mx','Dr','Prof','Other'].map(o=> <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label className="ts-h6 block mb-1">First name</label>
              <input name="first" value={form.first} onChange={e=>setForm({...form, first:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.first?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Jane"/>
              {errors.first && <div className="ts-h6 text-red-600 mt-1">{errors.first}</div>}
            </div>
            <div>
              <label className="ts-h6 block mb-1">Surname</label>
              <input name="last" value={form.last} onChange={e=>setForm({...form, last:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.last?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Doe"/>
              {errors.last && <div className="ts-h6 text-red-600 mt-1">{errors.last}</div>}
            </div>
            <div>
              <label className="ts-h6 block mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.email?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="you@company.com"/>
              {errors.email && <div className="ts-h6 text-red-600 mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="ts-h6 block mb-1">Project type</label>
              <input name="project" value={form.project} onChange={e=>setForm({...form, project:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.project?"border-red-400":"border-[var(--clr-subtle)]")} placeholder="Website redesign for a clinic"/>
              {errors.project && <div className="ts-h6 text-red-600 mt-1">{errors.project}</div>}
            </div>
            <div>
              <label className="ts-h6 block mb-1">Budget</label>
              <select name="budget" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})} className={cx("w-full border rounded-lg p-3 focus-ring bg-white", errors.budget?"border-red-400":"border-[var(--clr-subtle)]")}>
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
              <textarea name="message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white" rows={5} placeholder="What is the goal of the site? Any deadlines?"/>
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <div className="ts-h6 text-slate-500">No spam. We reply within 24h.</div>
              <button type="submit" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2"><Mail className="w-4 h-4"/> Send</button>
            </div>
            {sent && <div className="md:col-span-2 ts-h6 text-green-700">Thanks. Your message is in. We will respond shortly.</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

function WhyUs(){
  const points = [
    { title: "Clarity reduces cognitive load", text: "We design for instant understanding so visitors know what you offer and what to do next without thinking hard." },
    { title: "Proof precedes persuasion", text: "We place social proof, results, and de-riskers early so trust forms before asking for action." },
    { title: "One decision at a time", text: "Each page has a single goal. Fewer parallel choices means more momentum and fewer drop offs." },
    { title: "Emotion plus evidence", text: "We pair clean visuals and subtle motion with concrete outcomes and numbers so the site feels premium and credible." },
    { title: "Friction down, feedback up", text: "Mobile first speed, strong contrast, accessible forms, and micro feedback that confirms progress." },
    { title: "Anchoring and expectations", text: "Clear package tiers, transparent scope, and a polish guarantee set expectations and reduce risk." },
  ];
  return (
    <main>
      <header className="mx-auto max-w-[var(--container)] px-6 pt-14 pb-8">
        <h1 className="ts-h1 font-semibold">Why choose CITEKS</h1>
        <p className="ts-h5 text-slate-600 mt-3 max-w-2xl">We combine modern design with behavioral science so people understand, trust, and act. Below is how that thinking shows up in your site.</p>
      </header>
      <section className="mx-auto max-w-[var(--container)] px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {points.map(p=> (
          <div key={p.title} className="card p-6">
            <div className="ts-h4 font-semibold">{p.title}</div>
            <p className="ts-h6 text-slate-600 mt-2">{p.text}</p>
          </div>
        ))}
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-[var(--container)] px-6">
          <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="ts-h4 font-semibold">Ready to turn visitors into customers</div>
            <a href="#packages" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2">See packages</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function BriefForm({ variant }){
  const names = { starter:"Starter", growth:"Growth", scale:"Scale" };
  const formName = `${variant}-brief`;
  const isStarter = variant === "starter";
  const isGrowth = variant === "growth";
  const isScale = variant === "scale";
  const [sent,setSent]=useState(false);

  function Field({ label, name, type="text", required=false, placeholder="", area=false }){
    return (
      <div className={area?"md:col-span-2":""}>
        <label className="ts-h6 block mb-1">{label}{required && <span className="text-slate-400"> *</span>}</label>
        {area ? (
          <textarea name={name} required={required} placeholder={placeholder} rows={6} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white"/>
        ) : (
          <input type={type} name={name} required={required} placeholder={placeholder} className="w-full border border-[var(--clr-subtle)] rounded-lg p-3 focus-ring bg-white"/>
        )}
      </div>
    );
  }

  return (
    <main className="py-14">
      <div className="mx-auto max-w-[var(--container)] px-6">
        <h1 className="ts-h2 font-semibold">{names[variant]} project brief</h1>
        <p className="ts-h6 text-slate-600 mt-2">Fill the details so we can price accurately and start fast.</p>
        <form name={formName} data-netlify="true" netlify-honeypot="bot-field" method="POST" className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" onSubmit={e=>{e.preventDefault(); setSent(true);}}>
          <input type="hidden" name="form-name" value={formName}/>
          <input type="hidden" name="bot-field"/>
          <Field label="Your name" name="contact_name" required placeholder="Jane Doe"/>
          <Field label="Email" name="contact_email" type="email" required placeholder="you@company.com"/>
          <Field label="Company" name="company" placeholder="Company Ltd"/>
          <Field label="Industry" name="industry" placeholder="Dental, Fitness, Restaurant"/>
          <Field label="Website (if any)" name="site" type="url" placeholder="https://example.com"/>
          <Field label="Deadline" name="deadline" placeholder="e.g., 30 Nov 2025"/>
          <Field label="Primary goal of the site" name="goal" required placeholder="Book more appointments, sell online, generate leads" area/>
          <Field label="Pages needed" name="pages" required placeholder={isStarter?"Home, About, Contact": (isGrowth?"Home, Services, About, Contact, Booking":"Home, About, Services, Blog, Contact, Shop")} area/>
          <Field label="Brand assets" name="brand_assets" placeholder="Logo, fonts, colors, brand guidelines" area/>
          {(isGrowth || isScale) && <Field label="SEO priorities" name="seo" placeholder="Locations, services, target keywords" area/>}
          {(isGrowth || isScale) && <Field label="Integrations" name="integrations" placeholder="Booking, CRM, Payment, Maps, email marketing" area/>}
          {isScale && <Field label="E commerce or CRM details" name="ecom_crm" placeholder="Products, variants, CRM provider, automations" area/>}
          <Field label="3 reference sites you like" name="references" placeholder="URLs and what you like about them" area/>
          <Field label="Competitors" name="competitors" placeholder="Names or URLs" area/>
          <Field label="Anything else we should know" name="notes" placeholder="Copywriting help, photography, constraints" area/>
          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <a href="#packages" className="ts-h6 hover:opacity-80">Back to packages</a>
            <button type="submit" className="btn-accent px-6 py-3 rounded-full ts-h6 inline-flex items-center gap-2">Submit brief <ArrowRight className="w-4 h-4"/></button>
          </div>
          {sent && <div className="md:col-span-2 ts-h6 text-green-700">Thanks. Your brief is submitted.</div>}
        </form>
      </div>
    </main>
  );
}

function Footer(){
  return (
    <footer className="py-10 border-t border-[var(--clr-subtle)]">
      <div className="mx-auto max-w-[var(--container)] px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="ts-h6">© {new Date().getFullYear()} CITEKS - Modern sites that convert</div>
        <div className="flex items-center gap-4 ts-h6">
          <a href="#packages" className="hover:opacity-80">Pricing</a>
          <a href="#work" className="hover:opacity-80">Work</a>
          <a href="#/why-us" className="hover:opacity-80">Why us</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function NetlifyHiddenForms(){
  return (
    <div style={{display:"none"}} aria-hidden>
      {['starter','growth','scale'].map(v => (
        <form key={v} name={`${v}-brief`} data-netlify="true">
          <input name="contact_name"/>
          <input name="contact_email"/>
        </form>
      ))}
    </div>
  );
}

export default function App(){
  const styleVars = useStyleVars();
  const route = useRoute();
  return (
    <div style={styleVars} className="min-h-screen bg-[var(--clr-neutral)] text-[var(--clr-secondary)]">
      <style>{`
        :root { --container: 1280px; }
        .ts-p { font-size: var(--ts-p); letter-spacing: 0; line-height: 1.5; }
        .ts-h6 { font-size: var(--ts-h6); letter-spacing: -0.005em; line-height: 1.3; }
        .ts-h5 { font-size: var(--ts-h5); letter-spacing: -0.01em; line-height: 1.3; }
        .ts-h4 { font-size: var(--ts-h4); letter-spacing: -0.012em; line-height: 1.3; }
        .ts-h3 { font-size: var(--ts-h3); letter-spacing: -0.015em; line-height: 1.2; }
        .ts-h2 { font-size: var(--ts-h2); letter-spacing: -0.018em; line-height: 1.1; }
        .ts-h1 { font-size: var(--ts-h1); letter-spacing: -0.02em; line-height: 1.0; }
        .grid-12 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        @media (min-width: 1024px) { .grid-12 { grid-template-columns: repeat(12, 1fr); } }
        .card { background: white; border: 1px solid var(--clr-subtle); border-radius: 1.25rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .btn-accent { background: var(--clr-accent); color: white; }
        .btn-accent:hover { background: var(--clr-accent-hover); }
        .pad-32 { padding: 32px; }
        .focus-ring:focus { outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,.35); }
      `}</style>

      <Nav/>

      {route.startsWith("#/why-us") ? (
        <WhyUs/>
      ) : route.startsWith("#/brief/starter") ? (
        <BriefForm variant="starter"/>
      ) : route.startsWith("#/brief/growth") ? (
        <BriefForm variant="growth"/>
      ) : route.startsWith("#/brief/scale") ? (
        <BriefForm variant="scale"/>
      ) : (
        <main>
          <Hero/>
          <TrustRow/>
          <Showcase/>
          <Approach/>
          <Packages/>
          <CTA/>
          <Contact/>
        </main>
      )}

      <Footer/>
      <NetlifyHiddenForms/>
    </div>
  );
}
