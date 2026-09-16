# Digita Planner — sito web

Landing page / demo interattiva di **Digita Planner** (Process Orchestration + Food Production Planning con AI nativa).

Stack: Next.js 14 (static export), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export statico in ./out
```

## Deploy su IONOS

- Produzione: `https://planner.percorsisolari.it` (nginx, root `/opt/digita-planner/out`)
- Anteprima temporanea: `https://pascale-tv.percorsisolari.it/planner/` (build con `NEXT_PUBLIC_BASE_PATH=/planner`)

```bash
SSHPASS=... ./deploy/deploy.sh
```

Certificato TLS (una volta che il record DNS `A planner → 87.106.233.64` risolve):

```bash
certbot --nginx -d planner.percorsisolari.it
```
