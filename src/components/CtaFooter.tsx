"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Logo } from "./Navbar";
import { asset } from "@/lib/assets";

export function CTA() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <section id="contact" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="card relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="h2">Porta l&apos;orchestrazione AI nel tuo stabilimento</h2>
              <p className="lead">Demo guidata di 30 minuti sui tuoi dati: pianificazione lotti, previsione domanda e report finanziario automatico.</p>
            </div>
            <form
              className="lg:col-span-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm">
                  <Check size={18} className="text-accent" /> Richiesta ricevuta: ti ricontattiamo entro un giorno lavorativo.
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="relative flex-1">
                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email aziendale"
                      className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <button type="submit" className="btn-primary">
                    Richiedi demo <ArrowRight size={16} />
                  </button>
                </div>
              )}
              <p className="mt-3 text-[11px] text-muted">Nessuna carta di credito. Dati trattati secondo GDPR.</p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line/60 py-10">
      <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-xs text-muted">Process Orchestration & Food Production Planning con AI nativa.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>Un prodotto di</span>
          <img src={asset("/media/percorsi-solari.jpg")} alt="Percorsi Solari" className="h-8 rounded bg-white px-1.5 py-0.5" />
        </div>
        <div className="flex flex-wrap gap-5 text-xs text-muted">
          <a href="#security" className="hover:text-fg">
            Sicurezza
          </a>
          <a href="#architecture" className="hover:text-fg">
            Architettura
          </a>
          <a href="#contact" className="hover:text-fg">
            Contatti
          </a>
          <span>© {new Date().getFullYear()} Digital Planner</span>
        </div>
      </div>
    </footer>
  );
}
