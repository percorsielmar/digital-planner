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

"${SCP[@]}" /tmp/dp-out.tgz /tmp/dp-planner.tgz deploy/nginx-planner.conf deploy/contact_server.py deploy/planner-contact.service "$HOST:/tmp/"
"${SSH[@]}" "$HOST" '
set -e
rm -rf /opt/digital-planner/out.new /opt/digital-planner/out-planner.new
mkdir -p /opt/digital-planner/out.new /opt/digital-planner/out-planner.new
tar xzf /tmp/dp-out.tgz -C /opt/digital-planner/out.new
tar xzf /tmp/dp-planner.tgz -C /opt/digital-planner/out-planner.new
rm -rf /opt/digital-planner/out /opt/digital-planner/out-planner
mv /opt/digital-planner/out.new /opt/digital-planner/out
mv /opt/digital-planner/out-planner.new /opt/digital-planner/out-planner
install -m 755 /tmp/contact_server.py /opt/digital-planner/contact_server.py
install -m 644 /tmp/planner-contact.service /etc/systemd/system/planner-contact.service
touch /opt/digital-planner/contact.env; chmod 600 /opt/digital-planner/contact.env
systemctl daemon-reload && systemctl enable --now planner-contact && systemctl restart planner-contact
install -m 644 /tmp/nginx-planner.conf /etc/nginx/sites-available/planner.percorsisolari.it
ln -sf /etc/nginx/sites-available/planner.percorsisolari.it /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
'
echo "Deploy OK"
