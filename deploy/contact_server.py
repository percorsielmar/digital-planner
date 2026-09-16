#!/usr/bin/env python3
"""Endpoint minimale per il form "Richiedi demo" (POST /api/contact).

Salva ogni richiesta in LEADS_FILE (jsonl) e, se SMTP_* e' configurato,
inoltra una email a CONTACT_TO. Nessuna dipendenza esterna: solo stdlib.
"""
import json
import os
import re
import smtplib
import ssl
import time
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8093"))
LEADS_FILE = os.environ.get("LEADS_FILE", "/opt/digital-planner/leads.jsonl")
CONTACT_TO = os.environ.get("CONTACT_TO", "percorsi.elmar@gmail.com")
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER or "noreply@planner.percorsisolari.it")

AUTOREPLY = os.environ.get("AUTOREPLY", "1") not in ("0", "false", "")

_last_by_ip: dict[str, float] = {}


def _smtp_send(msg: EmailMessage) -> None:
    ctx = ssl.create_default_context()
    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=ctx, timeout=15) as s:
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.starttls(context=ctx)
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)


def send_mail(lead: dict) -> str:
    if not SMTP_HOST:
        return "smtp-not-configured"
    msg = EmailMessage()
    msg["Subject"] = f"[Digital Planner] {lead['subject']} — {lead['name']}"
    msg["From"] = SMTP_FROM
    msg["To"] = CONTACT_TO
    msg["Reply-To"] = f"{lead['name']} <{lead['email']}>"
    msg.set_content(
        "\n".join(
            [
                "Nuovo messaggio dal form di planner.percorsisolari.it",
                "",
                f"Nome:     {lead['name']}",
                f"Email:    {lead['email']}",
                f"Telefono: {lead.get('phone') or '-'}",
                f"Oggetto:  {lead['subject']}",
                "",
                "Messaggio:",
                lead["message"],
                "",
                f"Privacy accettata: sì  |  Data: {lead['ts']}",
                f"IP: {lead['ip']}  UA: {lead['ua']}",
            ]
        )
    )
    _smtp_send(msg)
    if AUTOREPLY:
        reply = EmailMessage()
        reply["Subject"] = "Abbiamo ricevuto il tuo messaggio — Digital Planner"
        reply["From"] = SMTP_FROM
        reply["To"] = lead["email"]
        reply["Reply-To"] = CONTACT_TO
        reply.set_content(
            f"Ciao {lead['name']},\n\n"
            "grazie per averci contattato. Abbiamo ricevuto la tua richiesta "
            f"(\"{lead['subject']}\") e ti risponderemo entro un giorno lavorativo.\n\n"
            "Riepilogo del messaggio:\n"
            f"{lead['message']}\n\n"
            "Digital Planner — Process Orchestration & Food Production Planning\n"
            "https://planner.percorsisolari.it\n"
        )
        try:
            _smtp_send(reply)
        except Exception as exc:  # noqa: BLE001
            print(f"[contact] autoreply error: {exc!r}", flush=True)
    return "sent"


class Handler(BaseHTTPRequestHandler):
    server_version = "planner-contact/1.0"

    def _json(self, code: int, payload: dict) -> None:
        data = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith("/health"):
            self._json(200, {"ok": True, "smtp": bool(SMTP_HOST)})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        if not self.path.startswith("/api/contact"):
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length") or 0)
        if length > 10_000:
            self._json(413, {"error": "payload too large"})
            return
        try:
            data = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._json(400, {"error": "json non valido"})
            return
        if data.get("website"):  # honeypot
            self._json(200, {"ok": True})
            return
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        subject = str(data.get("subject", "")).strip() or "Richiesta informazioni"
        message = str(data.get("message", "")).strip()
        if not (2 <= len(name) <= 120):
            self._json(400, {"error": "inserisci nome e cognome"})
            return
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]{2,}", email) or len(email) > 200:
            self._json(400, {"error": "email non valida"})
            return
        if not (3 <= len(message) <= 4000):
            self._json(400, {"error": "inserisci un messaggio"})
            return
        if data.get("privacy") is not True:
            self._json(400, {"error": "devi accettare la privacy policy"})
            return
        ip = self.headers.get("X-Real-IP") or self.client_address[0]
        now = time.time()
        if now - _last_by_ip.get(ip, 0) < 10:
            self._json(429, {"error": "troppe richieste, riprova tra poco"})
            return
        _last_by_ip[ip] = now
        lead = {
            "ts": time.strftime("%Y-%m-%d %H:%M:%S %Z"),
            "name": name,
            "email": email,
            "phone": str(data.get("phone", "")).strip()[:50],
            "subject": subject[:120],
            "message": message,
            "ip": ip,
            "ua": self.headers.get("User-Agent", "")[:300],
        }
        os.makedirs(os.path.dirname(LEADS_FILE), exist_ok=True)
        with open(LEADS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(lead, ensure_ascii=False) + "\n")
        try:
            status = send_mail(lead)
        except Exception as exc:  # noqa: BLE001
            print(f"[contact] mail error: {exc!r}", flush=True)
            status = "mail-failed"
        print(f"[contact] lead {email} -> {status}", flush=True)
        self._json(200, {"ok": True, "mail": status})

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"[contact] {self.address_string()} {fmt % args}", flush=True)


if __name__ == "__main__":
    print(f"[contact] listening on 127.0.0.1:{PORT}, smtp={'on' if SMTP_HOST else 'off'}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
