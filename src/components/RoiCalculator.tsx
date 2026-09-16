"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Euro, Leaf, TimerReset, TrendingUp } from "lucide-react";

const eur = (v: number) => v.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono">
          {value.toLocaleString("it-IT")} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#22c55e]" />
    </label>
  );
}

export default function RoiCalculator() {
  const [batches, setBatches] = useState(40);
  const [kgPerBatch, setKg] = useState(250);
  const [costPerKg, setCostKg] = useState(4.2);
  const [wastePct, setWaste] = useState(5.5);
  const [planningHours, setHours] = useState(14);
  const [hourlyCost, setHourly] = useState(38);
  const [energyMonthly, setEnergy] = useState(6500);

  const r = useMemo(() => {
    const weeks = 50;
    const kgYear = batches * kgPerBatch * weeks;
    const wasteReduction = 0.38; // riduzione relativa osservata
    const wasteSaving = kgYear * (wastePct / 100) * wasteReduction * costPerKg;
    const hoursSaving = planningHours * 0.6 * weeks * hourlyCost;
    const energySaving = energyMonthly * 12 * 0.09;
    const stockoutSaving = kgYear * costPerKg * 0.012;
    const total = wasteSaving + hoursSaving + energySaving + stockoutSaving;
    const licence = 18000;
    return { kgYear, wasteSaving, hoursSaving, energySaving, stockoutSaving, total, roi: (total - licence) / licence, paybackMonths: (licence / total) * 12 };
  }, [batches, kgPerBatch, costPerKg, wastePct, planningHours, hourlyCost, energyMonthly]);

  return (
    <section id="roi" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="max-w-2xl">
          <span className="eyebrow">
            <Calculator size={13} className="text-accent" /> ROI & Analytics
          </span>
          <h2 className="h2 mt-4">Quanto vale un piano migliore?</h2>
          <p className="lead">Stima indicativa basata sui risultati medi osservati: −38% scarto, −60% ore di pianificazione manuale, −9% costo energia grazie allo spostamento delle fasce energivore.</p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="card space-y-5 p-6 lg:col-span-7">
            <Slider label="Lotti a settimana" value={batches} min={5} max={200} step={5} unit="" onChange={setBatches} />
            <Slider label="kg per lotto" value={kgPerBatch} min={50} max={1000} step={10} unit="kg" onChange={setKg} />
            <Slider label="Costo prodotto finito" value={costPerKg} min={1} max={15} step={0.1} unit="€/kg" onChange={setCostKg} />
            <Slider label="Scarto attuale" value={wastePct} min={1} max={15} step={0.5} unit="%" onChange={setWaste} />
            <Slider label="Ore/settimana di pianificazione manuale" value={planningHours} min={2} max={60} step={1} unit="h" onChange={setHours} />
            <Slider label="Costo orario" value={hourlyCost} min={20} max={80} step={1} unit="€/h" onChange={setHourly} />
            <Slider label="Bolletta energia mensile" value={energyMonthly} min={500} max={40000} step={250} unit="€" onChange={setEnergy} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4 lg:col-span-5">
            <div className="card p-6 shadow-glow">
              <div className="text-xs uppercase tracking-wider text-muted">Risparmio annuo stimato</div>
              <div className="mt-2 font-mono text-4xl font-semibold tabular-nums text-accent">{eur(r.total)}</div>
              <div className="mt-1 text-sm text-muted">
                ROI {Math.round(r.roi * 100)}% · payback {r.paybackMonths.toFixed(1)} mesi · {Math.round(r.kgYear).toLocaleString("it-IT")} kg/anno
              </div>
            </div>
            {[
              { icon: Leaf, label: "Riduzione scarto", v: r.wasteSaving },
              { icon: TimerReset, label: "Ore di pianificazione recuperate", v: r.hoursSaving },
              { icon: Euro, label: "Ottimizzazione energia", v: r.energySaving },
              { icon: TrendingUp, label: "Vendite non perse (stock-out)", v: r.stockoutSaving },
            ].map((x) => (
              <div key={x.label} className="card flex items-center justify-between p-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-raised text-accent">
                    <x.icon size={16} />
                  </span>
                  {x.label}
                </div>
                <span className="font-mono tabular-nums">{eur(x.v)}</span>
              </div>
            ))}
            <p className="text-[11px] text-muted">Stime indicative su ipotesi medie di settore e licenza annua di riferimento; non costituiscono offerta.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
