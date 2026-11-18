import { assertFinnotechConfig, getFinnotechConfig } from "./config";
import { mapFinnotechError } from "./errors";

type CachedToken = {
  accessToken: string;
  refreshToken?: string;
  scopes: string;
  expiresAt: number;
};

const cache = new Map<string, CachedToken>();

function basicAuthHeader(clientId: string, clientSecret: string) {
  const raw = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${raw}`;
}

function cacheKey(scopes: string) {
  return `cc:${scopes.split(/[,\s]+/).filter(Boolean).sort().join(",")}`;
}

export async function getClientCredentialToken(scopes: string): Promise<string> {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const key = cacheKey(scopes || "*");
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now() + 30_000) {
    return hit.accessToken;
  }

  // Try refresh first
  if (hit?.refreshToken) {
    try {
      const refreshed = await refreshToken(hit.refreshToken);
      cache.set(key, refreshed);
      return refreshed.accessToken;
    } catch {
      cache.delete(key);
    }
  }

  const res = await fetch(`${cfg.baseUrl}/dev/v2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(cfg.clientId, cfg.clientSecret),
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      nid: cfg.nid,
      scopes: scopes || undefined,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      mapFinnotechError({
        status: res.status,
        message: data?.error?.message || data?.message,
        raw: data,
      })
    );
  }

  const result = data.result || data;
  const accessToken = result.value || result.accessToken || result.access_token;
  if (!accessToken) throw new Error("توکن دسترسی از فینوتک دریافت نشد.");

  const lifeMs = Number(result.lifeTime || result.expires_in || 3600) * 1000;
  const cached: CachedToken = {
    accessToken,
    refreshToken: result.refreshToken || result.refresh_token,
    scopes: Array.isArray(result.scopes) ? result.scopes.join(",") : scopes,
    expiresAt: Date.now() + (Number.isFinite(lifeMs) ? lifeMs : 3600_000),
  };
  cache.set(key, cached);
  return accessToken;
}

export async function refreshToken(refreshTokenValue: string): Promise<CachedToken> {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const res = await fetch(`${cfg.baseUrl}/dev/v2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(cfg.clientId, cfg.clientSecret),
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      token_type: "CLIENT-CREDENTIAL",
      refresh_token: refreshTokenValue,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      mapFinnotechError({
        status: res.status,
        message: data?.error?.message || data?.message,
        raw: data,
      })
    );
  }

  const result = data.result || data;
  const accessToken = result.value || result.accessToken || result.access_token;
  if (!accessToken) throw new Error("رفرش توکن ناموفق بود.");

  const lifeMs = Number(result.lifeTime || result.expires_in || 3600) * 1000;
  return {
    accessToken,
    refreshToken: result.refreshToken || result.refresh_token || refreshTokenValue,
    scopes: Array.isArray(result.scopes) ? result.scopes.join(",") : "",
    expiresAt: Date.now() + (Number.isFinite(lifeMs) ? lifeMs : 3600_000),
  };
}

/** SMS authorization code flow — step 1 */
export async function smsAuthorize(params: {
  mobile: string;
  scopes: string;
  state?: string;
}) {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const url = new URL(`${cfg.baseUrl}/dev/v2/oauth2/authorize`);
  url.searchParams.set("client_id", cfg.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", cfg.redirectUri);
  url.searchParams.set("scope", params.scopes);
  url.searchParams.set("mobile", params.mobile);
  url.searchParams.set("auth_type", "SMS");
  if (params.state) url.searchParams.set("state", params.state);

  const res = await fetch(url.toString(), { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      mapFinnotechError({ status: res.status, message: data?.error?.message, raw: data })
    );
  }
  return data.result || data;
}

/** SMS authorization — verify OTP */
export async function smsVerify(params: { mobile: string; otp: string; trackId?: string }) {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const res = await fetch(`${cfg.baseUrl}/dev/v2/oauth2/verify/sms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mobile: params.mobile,
      otp: params.otp,
      trackId: params.trackId,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      mapFinnotechError({ status: res.status, message: data?.error?.message, raw: data })
    );
  }
  return data.result || data;
}

/** Exchange auth code for token */
export async function smsToken(params: {
  code: string;
  scopes?: string;
}): Promise<string> {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const res = await fetch(`${cfg.baseUrl}/dev/v2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(cfg.clientId, cfg.clientSecret),
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: cfg.redirectUri,
      nid: cfg.nid,
      scopes: params.scopes,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      mapFinnotechError({ status: res.status, message: data?.error?.message, raw: data })
    );
  }

  const result = data.result || data;
  const accessToken = result.value || result.accessToken || result.access_token;
  if (!accessToken) throw new Error("توکن پیامکی دریافت نشد.");
  return accessToken;
}
