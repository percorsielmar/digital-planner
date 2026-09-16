export type TaskStatus = "done" | "running" | "planned" | "blocked";

export interface GanttTask {
  id: string;
  dept: string;
  label: string;
  start: number; // hour offset 0..168 (7 days)
  duration: number; // hours
  status: TaskStatus;
  resource: string;
}

export const DEPARTMENTS = ["Impasti", "Cottura", "Confezionamento", "Qualità", "Logistica"] as const;

export const GANTT_TASKS: GanttTask[] = [
  { id: "T-101", dept: "Impasti", label: "Lotto Pinsa base 320 kg", start: 2, duration: 6, status: "done", resource: "Linea A" },
  { id: "T-102", dept: "Impasti", label: "Lievitazione 24h", start: 8, duration: 24, status: "done", resource: "Cella 2" },
  { id: "T-103", dept: "Impasti", label: "Lotto Quarta Gamma 180 kg", start: 30, duration: 5, status: "running", resource: "Linea B" },
  { id: "T-201", dept: "Cottura", label: "Forno 1 · ciclo 1", start: 33, duration: 7, status: "running", resource: "Forno 1" },
  { id: "T-202", dept: "Cottura", label: "Forno 2 · fritti", start: 40, duration: 6, status: "planned", resource: "Forno 2" },
  { id: "T-203", dept: "Cottura", label: "Sanificazione", start: 48, duration: 3, status: "planned", resource: "Forno 1" },
  { id: "T-301", dept: "Confezionamento", label: "ATM 200 g · 4 800 pz", start: 41, duration: 9, status: "planned", resource: "Conf. 1" },
  { id: "T-302", dept: "Confezionamento", label: "Etichettatura lotti", start: 50, duration: 4, status: "blocked", resource: "Conf. 2" },
  { id: "T-401", dept: "Qualità", label: "Campionamento HACCP", start: 44, duration: 2, status: "planned", resource: "Lab" },
  { id: "T-402", dept: "Qualità", label: "Rilascio lotto L-2407", start: 55, duration: 2, status: "planned", resource: "Lab" },
  { id: "T-501", dept: "Logistica", label: "Spedizione GDO Nord", start: 58, duration: 8, status: "planned", resource: "Dock 1" },
  { id: "T-502", dept: "Logistica", label: "Spedizione Horeca", start: 70, duration: 6, status: "planned", resource: "Dock 2" },
];

export interface Batch {
  lot: string;
  product: string;
  category: "Pinse" | "Fritti" | "Quarta Gamma";
  plannedKg: number;
  yieldPct: number;
  shelfLifeDays: number;
  remainingDays: number;
  wastePct: number;
  status: TaskStatus;
}

export const BATCHES: Batch[] = [
  { lot: "L-2404", product: "Pinsa romana classica", category: "Pinse", plannedKg: 320, yieldPct: 96.2, shelfLifeDays: 21, remainingDays: 17, wastePct: 2.1, status: "done" },
  { lot: "L-2405", product: "Supplì al telefono", category: "Fritti", plannedKg: 140, yieldPct: 93.8, shelfLifeDays: 12, remainingDays: 9, wastePct: 3.4, status: "done" },
  { lot: "L-2406", product: "Misticanza IV gamma", category: "Quarta Gamma", plannedKg: 180, yieldPct: 88.5, shelfLifeDays: 7, remainingDays: 3, wastePct: 6.8, status: "running" },
  { lot: "L-2407", product: "Pinsa integrale", category: "Pinse", plannedKg: 260, yieldPct: 95.1, shelfLifeDays: 21, remainingDays: 21, wastePct: 1.9, status: "planned" },
  { lot: "L-2408", product: "Arancini ragù", category: "Fritti", plannedKg: 120, yieldPct: 94.0, shelfLifeDays: 12, remainingDays: 12, wastePct: 2.7, status: "planned" },
];

export interface Recipe {
  ingredient: string;
  perKg: number; // grams per kg of finished product
  supplier: string;
  lot: string;
}

export const RECIPE_PINSA: Recipe[] = [
  { ingredient: "Farina tipo 0", perKg: 540, supplier: "Molino F-12", lot: "MF-88213" },
  { ingredient: "Farina di riso", perKg: 60, supplier: "Molino F-12", lot: "MF-88220" },
  { ingredient: "Farina di soia", perKg: 30, supplier: "Agri-S", lot: "AS-4410" },
  { ingredient: "Acqua", perKg: 480, supplier: "Rete idrica", lot: "—" },
  { ingredient: "Lievito madre", perKg: 40, supplier: "Interno", lot: "LM-0712" },
  { ingredient: "Sale marino", perKg: 14, supplier: "Salina T", lot: "ST-2201" },
  { ingredient: "Olio EVO", perKg: 20, supplier: "Frantoio V", lot: "FV-1188" },
];

export const FORECAST_7D = [
  { day: "Lun", demand: 4200, p10: 3800, p90: 4650 },
  { day: "Mar", demand: 4450, p10: 4000, p90: 4900 },
  { day: "Mer", demand: 4100, p10: 3700, p90: 4550 },
  { day: "Gio", demand: 4700, p10: 4250, p90: 5150 },
  { day: "Ven", demand: 5300, p10: 4800, p90: 5800 },
  { day: "Sab", demand: 5900, p10: 5300, p90: 6500 },
  { day: "Dom", demand: 3600, p10: 3200, p90: 4000 },
];

export const LOG_TEMPLATES = [
  { level: "info", text: "Tool simulate_scenario → 200 scenari campionati (spazio latente DAE)" },
  { level: "ok", text: "Lotto L-2406 rilasciato · resa 88.5% · shelf-life 7 g" },
  { level: "warn", text: "Bottleneck rilevato: Forno 1 saturo al 97% (fascia 14–18)" },
  { level: "info", text: "Routing automatico: T-202 spostato su Forno 2 (+0 h ritardo)" },
  { level: "ok", text: "Previsione domanda aggiornata · MAPE 6.4% (7 g)" },
  { level: "warn", text: "Shelf-life L-2406: 3 g residui · suggerito sconto canale Horeca" },
  { level: "info", text: "Turno notte: +1 operatore su Confezionamento (ottimizzazione)" },
  { level: "ok", text: "Anomalia energia: nessuna · MSE 0.024 < soglia 0.334" },
  { level: "info", text: "Report finanziario generato in background (job 202 · 2.6 s)" },
  { level: "warn", text: "Rischio stock-out Pinse sabato: 18% → suggerito +2 lotti" },
] as const;

export const SECURITY_MATRIX = [
  { area: "Identità e accessi", items: ["RBAC per ruolo (operator / manager / admin)", "MFA (TOTP, WebAuthn)", "SSO SAML / OIDC", "Sessioni con scadenza e revoca"] },
  { area: "Crittografia", items: ["TLS 1.3 in transito", "AES-256 a riposo", "Chiavi gestite e ruotate", "Segreti fuori dal codice (.env / vault)"] },
  { area: "Compliance", items: ["GDPR: DPA, minimizzazione, diritto all'oblio", "ISO/IEC 27001 readiness", "Log di audit immutabili", "Data residency UE"] },
  { area: "Business continuity", items: ["Backup cifrati giornalieri", "RPO 24h · RTO 4h", "Health check e riavvio automatico servizi", "Worker recycling e limiti memoria"] },
  { area: "Resilienza applicativa", items: ["Timeout HTTP 15–20 s su ogni chiamata esterna", "Retry esponenziale e fallback multi-modello LLM", "Job asincroni (202 Accepted) con stato", "Heartbeat WebSocket ogni 10 s"] },
  { area: "Osservabilità", items: ["request_id per ogni richiesta", "Tracing delle fasi (LLM, tool, report)", "Metriche latenza e memoria", "Modalità debug attivabile per ambiente"] },
] as const;
