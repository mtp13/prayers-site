#!/bin/sh
# Serve dist/ with Astro's background preview server, crawl it for broken links, then stop the server.
# Astro 7 runs `astro preview` in the background when it detects an AI agent, so use background mode
# explicitly to behave the same in a terminal, in CI, and under an agent.
set -e

npx astro preview --background
trap 'npx astro preview stop' EXIT

npx linkinator http://localhost:4321/rosary/ --recurse --silent --concurrency 10
