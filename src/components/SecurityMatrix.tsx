"use client";

import { motion } from "framer-motion";
import { Check, Fingerprint, KeyRound, Lock, ScrollText, ServerCog, ShieldCheck, Eye } from "lucide-react";
import { SECURITY_MATRIX } from "@/lib/mock";

const ICONS = [Fingerprint, Lock, ScrollText, ServerCog, KeyRound, Eye];

export default function SecurityMatrix() {
  return (
    <section id="security" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="max-w-2xl">
          <span className="eyebrow">
            <ShieldCheck size={13} className="text-accent" /> Enterprise Security & Infrastructure
          </span>
          <h2 className="h2 mt-4">Sicurezza progettata per la produzione, non aggiunta dopo</h2>
          <p className="lead">Controllo accessi per ruolo, cifratura end-to-end, conformità europea e continuità operativa: la matrice completa di ciò che è già nel prodotto.</p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_MATRIX.map((row, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={row.area} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-raised text-accent">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-semibold">{row.area}</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {row.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent" /> {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>Specifiche:</span>
          {["RBAC", "MFA", "SSO", "TLS 1.3", "AES-256", "GDPR", "ISO/IEC 27001 readiness", "Audit log", "Backup cifrati", "RPO 24h · RTO 4h"].map((t) => (
            <span key={t} className="mono-badge">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
