#!/usr/bin/env bash
# Build statico e deploy su IONOS (planner.percorsisolari.it).
# Uso: SSHPASS=... ./deploy/deploy.sh   (oppure con chiave SSH senza sshpass)
set -euo pipefail
cd "$(dirname "$0")/.."

HOST=${IONOS_HOST:-root@87.106.233.64}
SSH=(ssh -o StrictHostKeyChecking=no)
SCP=(scp -o StrictHostKeyChecking=no)
if [[ -n "${SSHPASS:-}" ]]; then SSH=(sshpass -e "${SSH[@]}"); SCP=(sshpass -e "${SCP[@]}"); fi

npm run build
tar czf /tmp/dp-out.tgz -C out .
NEXT_PUBLIC_BASE_PATH=/planner npm run build
tar czf /tmp/dp-planner.tgz -C out .
npm run build >/dev/null

"${SCP[@]}" /tmp/dp-out.tgz /tmp/dp-planner.tgz deploy/nginx-planner.conf "$HOST:/tmp/"
"${SSH[@]}" "$HOST" '
set -e
rm -rf /opt/digita-planner/out.new /opt/digita-planner/out-planner.new
mkdir -p /opt/digita-planner/out.new /opt/digita-planner/out-planner.new
tar xzf /tmp/dp-out.tgz -C /opt/digita-planner/out.new
tar xzf /tmp/dp-planner.tgz -C /opt/digita-planner/out-planner.new
rm -rf /opt/digita-planner/out /opt/digita-planner/out-planner
mv /opt/digita-planner/out.new /opt/digita-planner/out
mv /opt/digita-planner/out-planner.new /opt/digita-planner/out-planner
install -m 644 /tmp/nginx-planner.conf /etc/nginx/sites-available/planner.percorsisolari.it
ln -sf /etc/nginx/sites-available/planner.percorsisolari.it /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
'
echo "Deploy OK"
