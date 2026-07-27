#!/bin/sh
# Sert la PWA en local pour tester sans build APK.
#   ./serve.sh          -> http://192.168.1.80:34880/
PORT="${1:-34880}"
cd "$(dirname "$0")/www" || exit 1
echo "Numérologie servie sur http://$(hostname -I | awk '{print $1}'):$PORT/"
exec python3 -m http.server "$PORT" --bind 0.0.0.0
