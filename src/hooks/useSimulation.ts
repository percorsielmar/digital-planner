"use client";

import { useEffect, useRef, useState } from "react";
import { LOG_TEMPLATES } from "@/lib/mock";

export interface LogLine {
  id: number;
  ts: string;
  level: "info" | "ok" | "warn";
  text: string;
}

export interface SimState {
  otif: number;
  wastePct: number;
  mape: number;
  oee: number;
  energyKw: number;
  throughput: number;
  logs: LogLine[];
  tick: number;
}

function jitter(v: number, amp: number, min: number, max: number) {
  const n = v + (Math.random() - 0.5) * amp;
  return Math.min(max, Math.max(min, n));
}

function ts() {
  return new Date().toLocaleTimeString("it-IT", { hour12: false });
}

const initial: SimState = {
  otif: 97.4,
  wastePct: 3.1,
  mape: 6.4,
  oee: 82.5,
  energyKw: 148,
  throughput: 1240,
  logs: [],
  tick: 0,
};

export function useSimulation(intervalMs = 2200): SimState {
  const [state, setState] = useState<SimState>(initial);
  const counter = useRef(0);

  useEffect(() => {
    const seed = LOG_TEMPLATES.slice(0, 4).map((l) => ({ id: counter.current++, ts: ts(), level: l.level, text: l.text }));
    setState((s) => ({ ...s, logs: seed }));

    const id = setInterval(() => {
      setState((s) => {
        const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        const line: LogLine = { id: counter.current++, ts: ts(), level: tpl.level, text: tpl.text };
        return {
          otif: jitter(s.otif, 0.4, 95.5, 99.2),
          wastePct: jitter(s.wastePct, 0.3, 2.2, 4.2),
          mape: jitter(s.mape, 0.3, 5.4, 7.6),
          oee: jitter(s.oee, 0.8, 78, 88),
          energyKw: jitter(s.energyKw, 6, 120, 175),
          throughput: jitter(s.throughput, 30, 1150, 1350),
          logs: [line, ...s.logs].slice(0, 8),
          tick: s.tick + 1,
        };
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return state;
}
