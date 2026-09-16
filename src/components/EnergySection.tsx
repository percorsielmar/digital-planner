"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gauge, Sun, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useSimulation } from "@/hooks/useSimulation";
import { asset } from "@/lib/assets";

const PHOTOS = Array.from({ length: 10 }, (_, i) => asset(`/media/plant-${i + 1}.jpg`));

export default function EnergySection() {
  const [idx, setIdx] = useState(0);
  const sim = useSimulation(3000);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const mse = 0.02 + (sim.energyKw - 120) / 4000;
  const threshold = 0.334;

  return (
    <section id="energy" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="lg:col-span-5">
          <span className="eyebrow">
            <Sun size={13} className="text-accent" /> Energy & Asset Intelligence
          </span>
          <h2 className="h2 mt-4">L&apos;energia è un ingrediente: la pianifichiamo anche lei</h2>
          <p className="lead">
            Lo stesso motore di anomaly detection usato per la produzione monitora impianti fotovoltaici e consumi dello stabilimento. Le fasce di
            produzione energivora vengono spostate quando l&apos;autoproduzione è massima, e ogni deviazione degli impianti è segnalata prima che diventi un costo.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Zap size={14} className="text-accent" /> Potenza assorbita
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold">
                {Math.round(sim.energyKw)} <span className="text-sm text-muted">kW</span>
              </div>
              <div className="text-[11px] text-muted">autoconsumo FV 64%</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Gauge size={14} className="text-accent" /> Anomaly score
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold">
                {(mse / threshold).toFixed(2)}
                <span className="text-sm text-muted">×</span>
              </div>
              <div className="text-[11px] text-muted">
                MSE {mse.toFixed(3)} · soglia {threshold}
              </div>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>· Analisi per impianto e per singola stringa/MPPT, con gruppi di orientamento</li>
            <li>· Soglia dinamica su media e deviazione dell&apos;errore di ricostruzione</li>
            <li>· Bollette elettriche lette automaticamente (OCR + LLM) e riconciliate con i consumi</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-7">
          <div className="card relative overflow-hidden">
            <div className="relative aspect-[16/9] bg-raised">
              <AnimatePresence mode="wait">
                <motion.img
                  key={idx}
                  src={PHOTOS[idx]}
                  alt="Impianto fotovoltaico monitorato"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulseDot rounded-full bg-accent" /> Impianto monitorato · stato nella norma
                  </span>
                  <span className="font-mono">
                    {idx + 1}/{PHOTOS.length}
                  </span>
                </div>
              </div>
              <button onClick={() => setIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)} aria-label="Precedente" className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setIdx((i) => (i + 1) % PHOTOS.length)} aria-label="Successiva" className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5 p-2 sm:grid-cols-10">
              {PHOTOS.map((p, i) => (
                <button key={p} onClick={() => setIdx(i)} className={`aspect-video overflow-hidden rounded ${i === idx ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`} aria-label={`Foto ${i + 1}`}>
                  <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
