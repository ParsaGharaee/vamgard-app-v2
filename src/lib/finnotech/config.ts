export type FinnotechConfig = {
  clientId: string;
  clientSecret: string;
  nid: string;
  baseUrl: string;
  redirectUri: string;
};

export function getFinnotechConfig(): FinnotechConfig {
  const clientId = process.env.FINNOTECH_CLIENT_ID || "";
  const clientSecret = process.env.FINNOTECH_CLIENT_SECRET || "";
  const nid = process.env.FINNOTECH_NID || "";
  const baseUrl = (process.env.FINNOTECH_BASE_URL || "https://sandboxapi.finnotech.ir").replace(
    /\/$/,
    ""
  );
  const redirectUri = process.env.FINNOTECH_REDIRECT_URI || "http://localhost:3000/api/finnotech/oauth/callback";

  return { clientId, clientSecret, nid, baseUrl, redirectUri };
}

export function assertFinnotechConfig(cfg: FinnotechConfig) {
  if (!cfg.clientId || !cfg.clientSecret || !cfg.nid) {
    throw new Error(
      "پیکربندی فینوتک ناقص است. FINNOTECH_CLIENT_ID، FINNOTECH_CLIENT_SECRET و FINNOTECH_NID را در .env.local تنظیم کنید."
    );
  }
}
