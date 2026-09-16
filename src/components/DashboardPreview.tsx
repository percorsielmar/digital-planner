"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertTriangle, CalendarRange, CheckCircle2, Clock, Factory, Leaf, Package, Scale, Timer, UtensilsCrossed } from "lucide-react";
import { BATCHES, DEPARTMENTS, FORECAST_7D, GANTT_TASKS, RECIPE_PINSA, type TaskStatus } from "@/lib/mock";
import { useSimulation } from "@/hooks/useSimulation";
import { fadeUp, viewport } from "@/lib/motion";

const STATUS: Record<TaskStatus, { label: string; cls: string; dot: string }> = {
  done: { label: "Completato", cls: "bg-accent/15 text-accent border-accent/30", dot: "bg-accent" },
  running: { label: "In corso", cls: "bg-info/15 text-info border-info/30", dot: "bg-info" },
  planned: { label: "Pianificato", cls: "bg-raised text-muted border-line", dot: "bg-muted" },
  blocked: { label: "Bloccato", cls: "bg-danger/15 text-danger border-danger/30", dot: "bg-danger" },
};

const DAYS = ["Lun", "Mar", "Mer", "Gio"];
const NOW_H = 36;

function GanttTimeline() {
  const [selected, setSelected] = useState(GANTT_TASKS[3].id);
  const sel = GANTT_TASKS.find((t) => t.id === selected)!;
  const total = DAYS.length * 24;
  return (
    <div className="grid gap-4">
      <div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[120px_1fr] text-[11px] text-muted">
              <div />
              <div className="grid grid-cols-4 border-b border-line">
                {DAYS.map((d) => (
                  <div key={d} className="border-l border-line px-2 py-1.5">
                    {d}
                  </div>
                ))}
              </div>
            </div>
            {DEPARTMENTS.map((dept) => (
              <div key={dept} className="grid grid-cols-[120px_1fr] border-b border-line/60">
                <div className="flex items-center px-2 py-2 text-xs font-medium">{dept}</div>
                <div className="relative h-11 bg-grid bg-[size:25%_100%]">
                  <div className="absolute inset-y-0 w-px bg-accent/70" style={{ left: `${(NOW_H / total) * 100}%` }}>
                    <span className="absolute -top-0.5 left-1 rounded bg-accent px-1 font-mono text-[9px] text-black">now</span>
                  </div>
                  {GANTT_TASKS.filter((t) => t.dept === dept).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t.id)}
                      className={`absolute top-2 h-7 rounded-md border px-2 text-left text-[11px] leading-7 transition hover:brightness-110 ${STATUS[t.status].cls} ${
                        selected === t.id ? "ring-2 ring-accent/60" : ""
                      }`}
                      style={{ left: `${(t.start / total) * 100}%`, width: `${(t.duration / total) * 100}%` }}
                      title={t.label}
                    >
                      <span className="block truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
          {(Object.keys(STATUS) as TaskStatus[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${STATUS[k].dot}`} /> {STATUS[k].label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="grid gap-4 rounded-lg border border-line bg-raised p-4 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="mono-badge">{sel.id}</span>
                <span className={`rounded-md border px-1.5 py-0.5 text-[11px] ${STATUS[sel.status].cls}`}>{STATUS[sel.status].label}</span>
              </div>
              <div className="mt-2 font-medium">{sel.label}</div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-4">
              <div>
                <dt>Reparto</dt>
                <dd className="text-fg">{sel.dept}</dd>
              </div>
              <div>
                <dt>Risorsa</dt>
                <dd className="text-fg">{sel.resource}</dd>
              </div>
              <div>
                <dt>Inizio</dt>
                <dd className="font-mono text-fg">
                  {DAYS[Math.floor(sel.start / 24)]} {String(sel.start % 24).padStart(2, "0")}:00
                </dd>
              </div>
              <div>
                <dt>Durata</dt>
                <dd className="font-mono text-fg">{sel.duration} h</dd>
              </div>
            </dl>
            {sel.status === "planned" && <div className="hidden md:block" />}
            {sel.status === "done" && <div className="hidden md:block" />}
            {sel.status === "blocked" && (
              <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-2 text-[11px] text-danger">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                Manca il rilascio qualità del lotto L-2407. Il Copilot propone di anticipare il campionamento HACCP di 2 h.
              </div>
            )}
            {sel.status === "running" && (
              <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info/10 p-2 text-[11px] text-info">
                <Activity size={14} className="mt-0.5 shrink-0" />
                Avanzamento 62% · fine stimata in linea con il piano.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FoodPlannerView() {
  const [scale, setScale] = useState(320);
  const recipe = useMemo(() => RECIPE_PINSA.map((r) => ({ ...r, qty: (r.perKg * scale) / 1000 })), [scale]);
  const maxDemand = Math.max(...FORECAST_7D.map((f) => f.p90));
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="card p-4 lg:col-span-7">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Package size={16} className="text-accent" /> Batch plan · settimana 28
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-2 font-medium">Lotto</th>
                <th className="font-medium">Prodotto</th>
                <th className="font-medium text-right">kg</th>
                <th className="font-medium text-right">Resa</th>
                <th className="font-medium text-right">Scarto</th>
                <th className="font-medium">Shelf-life</th>
                <th className="font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {BATCHES.map((b) => {
                const pct = (b.remainingDays / b.shelfLifeDays) * 100;
                const tone = pct < 40 ? "bg-danger" : pct < 70 ? "bg-warn" : "bg-accent";
                return (
                  <tr key={b.lot} className="border-b border-line/60">
                    <td className="py-2 font-mono">{b.lot}</td>
                    <td>
                      <div>{b.product}</div>
                      <div className="text-[10px] text-muted">{b.category}</div>
                    </td>
                    <td className="text-right font-mono">{b.plannedKg}</td>
                    <td className="text-right font-mono">{b.yieldPct.toFixed(1)}%</td>
                    <td className={`text-right font-mono ${b.wastePct > 5 ? "text-danger" : ""}`}>{b.wastePct.toFixed(1)}%</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded bg-line">
                          <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-mono text-muted">
                          {b.remainingDays}/{b.shelfLifeDays} g
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] ${STATUS[b.status].cls}`}>{STATUS[b.status].label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 lg:col-span-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Scale size={16} className="text-accent" /> Recipe scaling · Pinsa romana
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input type="range" min={50} max={800} step={10} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[#22c55e]" aria-label="Quantità lotto" />
          <span className="w-20 text-right font-mono text-sm">{scale} kg</span>
        </div>
        <ul className="mt-3 space-y-1.5 text-xs">
          {recipe.map((r) => (
            <li key={r.ingredient} className="flex items-center justify-between border-b border-line/60 pb-1.5">
              <div>
                <div>{r.ingredient}</div>
                <div className="text-[10px] text-muted">
                  {r.supplier} · lotto <span className="font-mono">{r.lot}</span>
                </div>
              </div>
              <span className="font-mono">{r.qty.toFixed(1)} kg</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4 lg:col-span-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarRange size={16} className="text-accent" /> Yield & demand forecast · 7 giorni
          </div>
          <span className="mono-badge">p10 / p50 / p90</span>
        </div>
        <div className="mt-4 flex h-40 items-end gap-2">
          {FORECAST_7D.map((f) => (
            <div key={f.day} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div className="absolute bottom-0 w-3/5 rounded-t bg-accent/15" style={{ height: `${(f.p90 / maxDemand) * 100}%` }} />
                <div className="relative w-2/5 rounded-t bg-accent" style={{ height: `${(f.demand / maxDemand) * 100}%` }} />
                <div className="absolute bottom-0 w-3/5 border-t border-dashed border-accent/60" style={{ height: `${(f.p10 / maxDemand) * 100}%` }} />
              </div>
              <span className="text-[10px] text-muted">{f.day}</span>
              <span className="font-mono text-[10px]">{(f.demand / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:col-span-5">
        <Metric icon={Leaf} label="Riduzione scarto (90 g)" value="−38%" hint="da 5.0% a 3.1% sul peso prodotto" />
        <Metric icon={Timer} label="Shelf-life monitorata" value="5 lotti" hint="1 lotto sotto il 45% di vita residua" />
        <Metric icon={UtensilsCrossed} label="Tracciabilità ingredienti" value="100%" hint="lotto fornitore → lotto finito → cliente" />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint }: { icon: typeof Leaf; label: string; value: string; hint: string }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
        <Icon size={18} />
      </span>
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="font-mono text-xl font-semibold">{value}</div>
        <div className="text-[11px] text-muted">{hint}</div>
      </div>
    </div>
  );
}

function LiveLog() {
  const sim = useSimulation(2600);
  const tone = { info: "text-info", ok: "text-accent", warn: "text-warn" } as const;
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulseDot rounded-full bg-accent" /> Event stream · WebSocket
        </span>
        <span className="mono-badge">ping 10 s</span>
      </div>
      <ul className="mt-3 space-y-1.5 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {sim.logs.map((l) => (
            <motion.li key={l.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2">
              <span className="text-muted">{l.ts}</span>
              <span className={`${tone[l.level]} uppercase`}>{l.level.padEnd(4)}</span>
              <span className="truncate">{l.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default function DashboardPreview() {
  const [tab, setTab] = useState<"orchestrator" | "food">("orchestrator");
  return (
    <section id="demo" className="py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} className="max-w-2xl">
          <span className="eyebrow">
            <Factory size={13} className="text-accent" /> Anteprima interattiva
          </span>
          <h2 className="h2 mt-4">Una sola vista su workflow, lotti e previsioni</h2>
          <p className="lead">Timeline dell&apos;Orchestrator e metriche del Food Production Planner sullo stesso dato, aggiornato in tempo reale.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} custom={1} className="card mt-10 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-raised/60 px-4 py-3">
            <div className="flex gap-1 rounded-lg border border-line bg-surface p-1">
              {(
                [
                  ["orchestrator", "Orchestrator · Timeline", CalendarRange],
                  ["food", "Food Production · Batch", UtensilsCrossed],
                ] as const
              ).map(([k, label, Icon]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    tab === k ? "bg-accent text-black" : "text-muted hover:text-fg"
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={13} className="text-accent" /> 12 task · 5 reparti
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> aggiornato ora
              </span>
            </div>
          </div>
          <div className="grid gap-4 p-4 2xl:grid-cols-12">
            <div className="2xl:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {tab === "orchestrator" ? <GanttTimeline /> : <FoodPlannerView />}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="2xl:col-span-4">
              <LiveLog />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
