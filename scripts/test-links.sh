#!/bin/sh
# Serve dist/ with Astro's background preview server, crawl it for broken links, then stop the server.
# Uses port 4322 so a dev server running on the default 4321 is left alone. Astro picks another port if
# 4322 is taken, so crawl the URL it reports rather than assuming the port.
# Astro 7 runs `astro preview` in the background when it detects an AI agent, so use background mode
# explicitly to behave the same in a terminal, in CI, and under an agent.
set -e

out=$(npx astro preview --background --port 4322 2>&1) || { printf '%s\n' "$out" >&2; exit 1; }
printf '%s\n' "$out"

case "$out" in
  *"already running"*)
    echo "test-links: a preview server is already running; stop it with 'npx astro preview stop' and retry." >&2
    exit 1
    ;;
esac

url=$(printf '%s\n' "$out" | grep -o 'http://localhost:[0-9]*' | head -n 1)
if [ -z "$url" ]; then
  echo "test-links: could not find the preview server URL in Astro's output." >&2
  npx astro preview stop >/dev/null 2>&1 || true
  exit 1
fi
trap 'npx astro preview stop' EXIT

npx linkinator "$url/rosary/" --recurse --silent --concurrency 10
