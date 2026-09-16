"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { useSimulation } from "@/hooks/useSimulation";

function Kpi({ label, value, unit, trend }: { label: string; value: string; unit?: string; trend: string }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-1 font-mono">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      <div className="mt-0.5 text-xs text-accent">{trend}</div>
    </div>
  );
}

export default function Hero() {
  const sim = useSimulation();
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <motion.div className="lg:col-span-7" initial="hidden" animate="show">
          <motion.div variants={fadeUp} custom={0} className="eyebrow">
            <Sparkles size={13} className="text-accent" />
            AI-native · Process Orchestration · Food Production
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Orchestra i processi.
            <br />
            Pianifica la produzione alimentare
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent"> con l&apos;AI.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="lead">
            Digita Planner unisce un motore di orchestrazione dei workflow, un planner verticale per il food e un livello di intelligenza
            artificiale che prevede la domanda, individua i colli di bottiglia e ottimizza turni e impianti. Ogni numero passa da un
            algoritmo deterministico: l&apos;AI spiega, non inventa.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn-primary">
              Richiedi una demo <ArrowRight size={16} />
            </a>
            <a href="#demo" className="btn-secondary">
              <PlayCircle size={16} /> Vedi la dashboard
            </a>
          </motion.div>
          <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-accent" /> RBAC · MFA · TLS 1.3 · AES-256
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Workflow size={14} className="text-accent" /> WebSocket real-time · job asincroni
            </span>
            <span className="inline-flex items-center gap-1.5">GDPR · ISO/IEC 27001 readiness</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card relative p-4 shadow-glow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2 w-2 animate-pulseDot rounded-full bg-accent" />
                Live plant · stabilimento 01
              </div>
              <span className="mono-badge">tick #{sim.tick}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Kpi label="OTIF" value={sim.otif.toFixed(1)} unit="%" trend="+1.8 pt vs 30 g" />
              <Kpi label="Scarto" value={sim.wastePct.toFixed(1)} unit="%" trend="−38% dopo il go-live" />
              <Kpi label="Forecast MAPE" value={sim.mape.toFixed(1)} unit="%" trend="orizzonte 7 giorni" />
              <Kpi label="OEE" value={sim.oee.toFixed(1)} unit="%" trend="linee A/B" />
            </div>
            <div className="mt-3 rounded-lg border border-line bg-raised p-3">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Throughput (pz/h)</span>
                <span className="font-mono text-fg">{Math.round(sim.throughput)}</span>
              </div>
              <Sparkline seed={sim.tick} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Sparkline({ seed }: { seed: number }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const x = (i / 31) * 100;
    const y = 50 - Math.sin((i + seed) / 3) * 18 - Math.cos((i + seed) / 7) * 10;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 60" className="mt-2 h-14 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#22c55e" stopOpacity="0.35" />
          <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${pts.join(" ")} 100,60`} fill="url(#sp)" />
      <polyline points={pts.join(" ")} fill="none" stroke="#22c55e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
