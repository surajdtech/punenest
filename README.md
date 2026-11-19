# PuneNest · Pune

Every housing society in Pune and Pimpri-Chinchwad on one 3D night map. Set the smallest bedroom you can live with, home size, BHK, amenities, buy or rent budget and what you want nearby (metro, park, school, hospital, mall), and watch the societies that fit light up. Every number links to where it came from.

Forked from [kairothq/flat-finder](https://github.com/kairothq/flat-finder) (MIT), which did the same for Gurugram. The code is city-agnostic; this fork adds Pune and renames the site, CLI, skill and MCP server.

## What the colours mean

- **Bright**: matches your search.
- **Amber**: likely. The rooms read so far pass.
- **Faint outline**: not checked yet (no room sizes), neither pass nor fail.
- **Dark**: does not match.

Building outlines come from OpenStreetMap where mapped; otherwise towers are drawn from the listed tower count and the card says "approximate shape".

## Data

| Source | What it gives |
| --- | --- |
| Magicbricks project pages | location, developer, units, towers, configs, amenities, live sale and rent listings, resident ratings and reviews, price trend |
| OpenStreetMap (Overpass) | society boundaries, building footprints, Pune Metro and rail stations, parks, schools, hospitals, malls |
| `data/verified/*.json` | hand-checked bedroom sizes from brochures / RERA plans (Gurugram rows are reused only to fit the "probably fits" bedroom-size model) |

Pune has no hand-verified rows yet, so the room filter relies on "probably fits" (cautious lower bound from unit size). Add verified rows in `data/verified/pune.json` (same format as `gurgaon.json`) to make societies **match** outright.

## MCP endpoint (use it inside Claude)

PuneNest is an MCP server at `https://punenest.pages.dev/mcp` once deployed (`http://localhost:8788/mcp` locally). In Claude, add a custom connector with that URL and ask things like *"3 BHK in Baner or Balewadi under ₹1.6 Cr, every bedroom at least 10 by 12, metro within 1 km"*.

Tools: `search_societies`, `breakdown` (group by locality, BHK, amenity, metro distance, rent or price band), `list_localities`, `get_society`, `compare_societies`. Default city is `pune`.

## Run it

```bash
# data (Python 3.10+, no extra packages)
cd pipeline
python mb_crawl.py list pune                       # ~1,700 list pages, cached + resumable
python mb_crawl.py projects pune --min-units 40    # project pages for real societies only
python osm_fetch.py pune                           # outlines + nearby places
python build_city.py pune                          # -> web/public/data/

# site + MCP (Cloudflare Pages)
cd ../web
npm install
npx vite build && npx wrangler pages dev dist      # http://localhost:8788 and /mcp
npx wrangler pages deploy dist --project-name punenest
```

On Windows set `PYTHONUTF8=1` before running the pipeline.

Useful links: `?city=pune`, `?map=streets` or `?map=light`, `?preset=example`, `?open=<society id>`, `?nointro`.

## Terminal

```bash
node cli/punenest.mjs --bhk 2,3 --max-rent 45k --amenity pool
```

## Before you publish

- Magicbricks data is scraped from public pages; check their terms before running a public site on it. The crawler is polite (1 request/second, cached).
- OSM data is ODbL: keep the attribution.
