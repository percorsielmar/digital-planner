"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Boxes, Database, MonitorSmartphone, Server } from "lucide-react";

const BLOCKS = [
  {
    icon: MonitorSmartphone,
    name: "Frontend",
    sub: "React · viste operator / manager / admin",
    items: ["Chat Copilot via WebSocket", "Pannello log e approvazioni", "Timeline, batch e finanza", "Polling con stop su failed / cancelled"],
  },
  {
    icon: Server,
    name: "Orchestratore LLM",
    sub: "FastAPI · tool-calling · job asincroni",
    items: ["Loop LLM ↔ tool (max 5 turni)", "RBAC sui tool per ruolo", "Report finanziari 202 + status", "request_id, timeout 15–20 s, retry, fallback modelli"],
  },
  {
    icon: Database,
    name: "Motore analitico",
    sub: "Deep Autoencoder · scenari · dashboard",
    items: ["Train / predict con checkpoint", "Semi-Monte Carlo nello spazio latente", "Rischi stock-out e waste per categoria", "Anomalie su scarti e consumi"],
  },
] as const;

const INTEGRATIONS = ["Meteo (previsioni 7 g)", "ERP / gestionale vendite (MS SQL)", "Bilanci e bollette (PDF, Excel, OCR)", "Impianti energia (API telemetria)"];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="max-w-2xl">
          <span className="eyebrow">
            <Boxes size={13} className="text-accent" /> Architettura
          </span>
          <h2 className="h2 mt-4">Tre blocchi, un&apos;unica fonte di verità</h2>
          <p className="lead">
            Architettura ibrida: agenti deterministici calcolano, persistono e integrano; l&apos;agente LLM orchestra la conversazione e interpreta. Nessun numero viene generato dal modello linguistico.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {BLOCKS.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="card relative p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                  <b.icon size={18} />
                </span>
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-muted">{b.sub}</div>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" /> {it}
                  </li>
                ))}
              </ul>
              {i < BLOCKS.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-muted lg:grid">
                  <ArrowRight size={12} />
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="card p-5 lg:col-span-7">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Flusso di una richiesta</div>
            <pre className="mt-3 overflow-x-auto font-mono text-[12px] leading-relaxed text-muted">
{`utente ─▶ WebSocket /ws/chat (connection_id, heartbeat 10 s)
  ├─ receiver task ─▶ queue ─▶ ChatService.handle
  │     for turn in 1..5:
  │       LLM.complete(system_prompt + storico)
  │       se tool_calls → ToolExecutor.execute → JSON → role="tool"
  │       altrimenti → risposta testuale
  ├─ disconnect → cancel task, job = cancelled, cleanup TTL 300 s
  └─ report PDF → 202 Accepted + task_id → /status → /download`}
            </pre>
          </div>
          <div className="card p-5 lg:col-span-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Integrazioni</div>
            <ul className="mt-3 space-y-2 text-sm">
              {INTEGRATIONS.map((x) => (
                <li key={x} className="flex items-center gap-2 text-muted">
                  <ArrowDown size={13} className="-rotate-90 text-accent" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Python", "FastAPI", "TensorFlow", "React", "WebSocket", "Nginx", "systemd", "Cloudflare"].map((t) => (
                <span key={t} className="mono-badge">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
