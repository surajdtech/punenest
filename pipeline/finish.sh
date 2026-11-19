#!/usr/bin/env bash
# Wait for the project crawl, then rebuild data, deploy to Cloudflare Pages and push to GitHub.
set -e
cd "$(dirname "$0")"
until grep -qE "project 7318/7318|Traceback" crawl_projects.log; do sleep 60; done
grep -q Traceback crawl_projects.log && { echo "CRAWL FAILED"; exit 1; }
export PYTHONUTF8=1
python build_city.py pune
cd ../web && npx vite build
npx wrangler pages deploy dist --project-name punenest --branch main --commit-dirty=true
cd .. && git add -A && git commit -qm "Pune data: all crawled societies

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push -q
echo FINISHED
