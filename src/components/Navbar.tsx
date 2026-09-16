"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X, Boxes } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "#orchestrator", label: "Orchestrator" },
  { href: "#food-planner", label: "Food Planner" },
  { href: "#ai-copilot", label: "AI Copilot" },
  { href: "#energy", label: "Energy" },
  { href: "#security", label: "Sicurezza" },
  { href: "#roi", label: "ROI" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`} aria-label="Digital Planner">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-black shadow-glow">
        <Boxes className="h-4.5 w-4.5" size={18} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        Digital <span className="text-muted">Planner</span>
      </span>
    </a>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("dp-theme", next ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label="Cambia tema"
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? "border-b border-line/80 bg-bg/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="btn-primary hidden md:inline-flex">
            Richiedi demo
          </a>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-line bg-bg/95 backdrop-blur md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-3">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-raised hover:text-fg">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-2">
                Richiedi demo
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
