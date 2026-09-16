"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Logo } from "./Navbar";
import { ContactForm, CONTACT_EMAIL } from "./ContactForm";
import { asset } from "@/lib/assets";

export function CTA() {
  return (
    <section id="contact" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="card relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="h2">Porta l&apos;orchestrazione AI nel tuo stabilimento</h2>
              <p className="lead">Demo guidata di 30 minuti sui tuoi dati: pianificazione lotti, previsione domanda e report finanziario automatico.</p>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                <Mail size={16} className="text-accent" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-fg">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
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
