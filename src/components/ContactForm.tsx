"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Loader2, AlertTriangle } from "lucide-react";

export const CONTACT_EMAIL = "percorsi.elmar@gmail.com";

const SUBJECTS = ["Richiesta demo", "Preventivo / licenze", "Integrazione con i miei sistemi", "Supporto tecnico", "Altro"];

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; message: string };

const field =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      privacy: fd.get("privacy") === "on",
      website: String(fd.get("website") ?? ""),
    };
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || `Errore ${res.status}`);
      setStatus({ kind: "ok" });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Invio non riuscito" });
    }
  }

  if (status.kind === "ok") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm">
        <Check size={18} className="mt-0.5 shrink-0 text-accent" />
        <span>Messaggio inviato con successo! Ti ricontattiamo entro un giorno lavorativo.</span>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-xs text-muted">
        Nome e Cognome *
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Mario Rossi" className={field} />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        Email *
        <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="nome@azienda.it" className={field} />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        Telefono
        <input name="phone" type="tel" maxLength={50} autoComplete="tel" placeholder="+39 ..." className={field} />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        Oggetto *
        <select name="subject" required defaultValue={SUBJECTS[0]} className={field}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs text-muted sm:col-span-2">
        Messaggio *
        <textarea
          name="message"
          required
          minLength={3}
          maxLength={4000}
          rows={4}
          placeholder="Descrivi il tuo stabilimento, i volumi e cosa vorresti pianificare."
          className={`${field} resize-y`}
        />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex items-start gap-2 text-xs text-muted sm:col-span-2">
        <input name="privacy" type="checkbox" required className="mt-0.5 h-4 w-4 accent-accent" />
        <span>
          Ho letto l&apos;informativa e acconsento al trattamento dei dati secondo il GDPR per essere ricontattato. *
        </span>
      </label>
      {status.kind === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200 sm:col-span-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            {status.message}. Puoi scrivere direttamente a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <span className="text-[11px] text-muted">Nessuna carta di credito. Risposta entro un giorno lavorativo.</span>
        <button type="submit" disabled={sending} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {sending ? (
            <>
              Invio… <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              Invia Messaggio <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
