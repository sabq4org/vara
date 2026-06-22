// Config resolved lazily from environment variables. Values are read through
// getters so they work both under Bun (process.env at startup) and Cloudflare
// Workers (process.env populated per-request with the nodejs_compat flag).

function env(name: string): string | undefined {
  return typeof process !== "undefined" ? process.env?.[name] : undefined;
}

function required(name: string): string {
  const v = env(name);
  if (!v) {
    console.warn(`[config] Missing env var: ${name} — related provider will be disabled.`);
    return "";
  }
  return v;
}

export const config = {
  get port() {
    return Number(env("PORT") ?? 8787);
  },
  apiFootball: {
    get key() {
      return required("API_FOOTBALL_KEY");
    },
    baseUrl: "https://v3.football.api-sports.io",
  },
  sportmonks: {
    get token() {
      return env("SPORTMONKS_API_TOKEN") ?? "";
    },
    baseUrl: "https://api.sportmonks.com/v3/football",
    // Sportmonks IDs for the Saudi Pro League (Roshn). Season auto-resolves at runtime.
    saudiProLeague: { id: "944" },
  },
  // Primary provider for Saudi data. Sportmonks now covers all Saudi competitions
  // with deeper stats + explicit VAR events; API-Football stays as fallback.
  get primaryProvider() {
    return (env("PRIMARY_PROVIDER") ?? "sportmonks") as "sportmonks" | "api-football";
  },
  // Saudi-first defaults so the prototype works out of the box.
  defaults: {
    // API-Football IDs (fallback provider).
    saudiProLeague: { id: "307", season: 2025 },
  },
  get cacheTtlMs() {
    return Number(env("CACHE_TTL_MS") ?? 30_000);
  },
  // Audience timezone offset (minutes east of UTC). Defaults to KSA (+03:00).
  get tzOffsetMin() {
    return Number(env("VARA_TZ_OFFSET_MIN") ?? 180);
  },
};
