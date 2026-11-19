// A city's data is split to stay under Cloudflare Pages' 25 MiB file limit:
// <city>.json holds metadata and the names of its parts; societies, card details and building shapes come
// in matching chunks, the research log on its own. getJson(name) fetches /data/<name> and returns parsed JSON.
// Older single-file cities (no "parts") load as they are.
export async function loadCity(getJson, id, { events = true } = {}) {
  const meta = await getJson(`${id}.json`);
  if (!meta.parts) return meta;
  const [chunks, log] = await Promise.all([
    Promise.all(meta.parts.map((p) => getJson(p))),
    events && meta.events_file ? getJson(meta.events_file).catch(() => []) : [],
  ]);
  return { ...meta, societies: chunks.flat(), events: log };
}

export async function loadShapes(getJson, city, id) {
  if (!city.shape_parts) return getJson(`${id}-shapes.geojson`);
  const parts = await Promise.all(city.shape_parts.map((p) => getJson(p)));
  return { type: 'FeatureCollection', features: parts.flatMap((p) => p.features) };
}

// Card details for one society: only the chunk that holds it is fetched (s.dp names it).
const detailCache = new Map();
export async function loadDetails(getJson, city, id, s) {
  const name = city.detail_parts ? city.detail_parts[(s.dp || 1) - 1] : `${id}-details.json`;
  if (!detailCache.has(name)) detailCache.set(name, getJson(name).catch(() => ({})));
  return (await detailCache.get(name))[s.id] || null;
}
