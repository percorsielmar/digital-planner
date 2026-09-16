"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, stagger, viewport } from "@/lib/motion";

export interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export default function FeatureSection({
  id,
  eyebrow,
  icon: Icon,
  title,
  lead,
  features,
  aside,
  reverse,
}: {
  id: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  lead: string;
  features: Feature[];
  aside?: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="border-t border-line/60 py-20 sm:py-28">
      <div className={`container-x grid items-start gap-12 lg:grid-cols-12 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="lg:col-span-5">
          <motion.span variants={fadeUp} className="eyebrow">
            <Icon size={13} className="text-accent" /> {eyebrow}
          </motion.span>
          <motion.h2 variants={fadeUp} className="h2 mt-4">
            {title}
          </motion.h2>
          <motion.p variants={fadeUp} className="lead">
            {lead}
          </motion.p>
          {aside && (
            <motion.div variants={fadeUp} className="mt-8">
              {aside}
            </motion.div>
          )}
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="card group p-5 transition hover:border-accent/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-raised text-accent transition group-hover:bg-accent/15">
                <f.icon size={18} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
