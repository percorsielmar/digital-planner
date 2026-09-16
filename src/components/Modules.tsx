"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  CalendarClock,
  ChefHat,
  Clock3,
  Cpu,
  GitBranch,
  Layers,
  LineChart,
  Network,
  Radar,
  Route,
  ScanBarcode,
  Send,
  Sparkles,
  Timer,
  TrendingUp,
  Trash2,
  Users,
  Workflow,
} from "lucide-react";
import FeatureSection from "./FeatureSection";

export function OrchestratorSection() {
  return (
    <FeatureSection
      id="orchestrator"
      eyebrow="Orchestrator Engine"
      icon={Workflow}
      title="Workflow dinamici, risorse allocate in tempo reale"
      lead="Ogni operazione tra reparti diventa un task con dipendenze, risorse e SLA. L'engine ricalcola il piano quando cambia la domanda, si ferma una macchina o un lotto non passa il controllo qualità."
      features={[
        { icon: GitBranch, title: "Workflow manager dinamico", text: "Definisci processi con dipendenze, approvazioni e ruoli. Le modifiche si propagano a valle senza ripianificare a mano." },
        { icon: Cpu, title: "Allocazione risorse real-time", text: "Linee, forni, celle, operatori e dock assegnati in base a capacità, turni e vincoli HACCP." },
        { icon: CalendarClock, title: "Gantt e timeline interattive", text: "Trascina, riprogramma e confronta piano vs. consuntivo con evidenza dei colli di bottiglia." },
        { icon: Network, title: "Stato cross-dipartimentale", text: "Impasti, cottura, confezionamento, qualità e logistica condividono un'unica sorgente di verità." },
      ]}
      aside={
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="mono-badge">operator</span> registra log vocali/testuali dal reparto
          </li>
          <li className="flex gap-2">
            <span className="mono-badge">manager</span> approva, pianifica e interroga il Copilot
          </li>
          <li className="flex gap-2">
            <span className="mono-badge">admin</span> configura integrazioni, finanza e sicurezza
          </li>
        </ul>
      }
    />
  );
}

export function FoodPlannerSection() {
  return (
    <FeatureSection
      id="food-planner"
      reverse
      eyebrow="Food Production Planner · core vertical"
      icon={ChefHat}
      title="Dal lotto alla scadenza, tutto tracciato"
      lead="Pianificazione batch per categorie ad alta deperibilità (pinse, fritti, quarta gamma), scalatura ricette, tracciabilità ingrediente → lotto → cliente e previsione della resa."
      features={[
        { icon: Layers, title: "Batch planning", text: "Sequenzia i lotti su linee e forni rispettando lievitazioni, sanificazioni e finestre di consegna." },
        { icon: ChefHat, title: "Recipe scaling", text: "Ricette parametriche: cambia i kg e ottieni ingredienti, tempi e costo materia prima aggiornati." },
        { icon: ScanBarcode, title: "Tracciabilità ingredienti", text: "Ogni lotto finito conserva i lotti fornitore usati: richiami mirati in minuti, non giorni." },
        { icon: TrendingUp, title: "Yield forecasting", text: "Resa attesa per prodotto e linea con intervalli di confidenza, calibrata sui dati storici." },
        { icon: Trash2, title: "Waste reduction metrics", text: "Scarto per categoria e causa, con soglie e anomalie statistiche sui dati reali di produzione." },
        { icon: Timer, title: "Shelf-life monitoring", text: "Vita residua per lotto e canale; suggerimenti di rotazione e promozione prima della scadenza." },
      ]}
    />
  );
}

const COPILOT_SCRIPT = [
  { role: "user", text: "Se sabato la domanda di pinse cresce del 15%, rischiamo stock-out?" },
  { role: "tool", text: "simulate_scenario({categoria:'Pinse', variazione:+15%, n_scenari:200})" },
  { role: "assistant", text: "Con +15% la probabilità di stock-out sabato sale al 31% (shortfall medio 640 pz). Consiglio +2 lotti da 260 kg giovedì sera: Forno 2 ha 6 h libere, costo energia +€48. Il rischio scende al 6%." },
  { role: "user", text: "Ok, pianifica e avvisa il turno." },
  { role: "tool", text: "schedule_batches(...) · notify_shift('notte', 'Confezionamento')" },
  { role: "assistant", text: "Fatto: lotti L-2409 e L-2410 inseriti nella timeline, notifica inviata. Nessun conflitto con la sanificazione delle 48h." },
] as const;

function CopilotDemo() {
  const [step, setStep] = useState(0);
  const visible = COPILOT_SCRIPT.slice(0, step + 1);
  const next = () => setStep((s) => Math.min(COPILOT_SCRIPT.length - 1, s + 1));
  const reset = () => setStep(0);
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line bg-raised/60 px-4 py-2.5 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <Bot size={14} className="text-accent" /> AI Copilot · tool-calling
        </span>
        <span className="mono-badge">timeout 20 s · fallback multi-modello</span>
      </div>
      <div className="min-h-[300px] space-y-3 p-4 text-sm">
        <AnimatePresence initial={false}>
          {visible.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "tool" ? (
                <div className="w-full rounded-md border border-dashed border-line bg-raised px-3 py-2 font-mono text-[11px] text-muted">
                  <span className="text-info">⚙ tool</span> {m.text}
                </div>
              ) : (
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${m.role === "user" ? "bg-accent text-black" : "border border-line bg-raised"}`}>{m.text}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="text-[11px] text-muted">I numeri arrivano sempre da tool deterministici: il modello spiega e propone, non inventa.</span>
        <div className="flex gap-2">
          <button onClick={reset} className="btn-secondary !px-3 !py-1.5 text-xs">
            Reset
          </button>
          <button onClick={next} disabled={step === COPILOT_SCRIPT.length - 1} className="btn-primary !px-3 !py-1.5 text-xs disabled:opacity-50">
            <Send size={13} /> Avanti
          </button>
        </div>
      </div>
    </div>
  );
}

export function AICopilotSection() {
  return (
    <section id="ai-copilot" className="border-t border-line/60 py-20 sm:py-28">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="max-w-2xl">
          <span className="eyebrow">
            <Sparkles size={13} className="text-accent" /> Native AI Copilot · Intelligence Layer
          </span>
          <h2 className="h2 mt-4">Un livello di intelligenza che lavora sui tuoi dati, non al posto tuo</h2>
          <p className="lead">
            Un motore analitico (autoencoder profondo + campionamento semi-Monte Carlo) produce scenari e probabilità; il Copilot LLM li interpreta e li traduce in azioni operative, chiamando strumenti verificabili.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {[
              { icon: LineChart, title: "Demand forecasting automatico", text: "Previsioni a 7/30 giorni per categoria con bande p10–p90, addestrate sullo storico di produzione, meteo e vendite." },
              { icon: Radar, title: "Bottleneck detection", text: "Rileva saturazioni di linee e forni prima che accadano, con impatto stimato su OTIF e scarto." },
              { icon: Route, title: "Task routing automatico", text: "Sposta e ri-sequenzia i task sulle risorse disponibili rispettando vincoli di processo e qualità." },
              { icon: Users, title: "Smart shift & equipment scheduling", text: "Propone turni e uso macchine che minimizzano straordinari, energia e tempi di attesa." },
              { icon: BrainCircuit, title: "Anomaly detection", text: "Errore di ricostruzione su scarti, consumi e produzione con soglie dinamiche (media + k·σ)." },
              { icon: Clock3, title: "Risposte in secondi, non minuti", text: "Timeout 20 s, retry esponenziale, fallback tra modelli e job asincroni con stato: niente attese cieche." },
            ].map((f) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="card p-5 transition hover:border-accent/40">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-raised text-accent">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="lg:col-span-6">
            <CopilotDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
