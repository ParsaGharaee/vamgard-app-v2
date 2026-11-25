import { loadSession } from "@/src/lib/session";

export type GatewayJson = Record<string, unknown>;

export type GatewayFetchResult<T = GatewayJson> = {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
  message?: string;
};

type GatewayFetchOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
  /** Skip attaching X-App-Session (e.g. verify-otp) */
  noSession?: boolean;
};

function parseGatewayError(data: GatewayJson, status: number): string | undefined {
  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;
  if (!status || status >= 500) return "خطای سرور. لطفاً بعداً تلاش کنید.";
  if (status === 401 || status === 403) return "دسترسی مجاز نیست.";
  if (status === 502 || status === 503) return "ارتباط با سرور برقرار نشد.";
  return undefined;
}

/**
 * Calls the Next.js BFF at `/api/gateway/{path}` which forwards to vamgard.org.
 */
export async function gatewayFetch<T = GatewayJson>(
  path: string,
  opts: GatewayFetchOptions = {},
): Promise<GatewayFetchResult<T>> {
  const clean = path.replace(/^\/+/, "");
  const headers = new Headers(opts.headers);

  if (!opts.noSession && typeof window !== "undefined") {
    const token = loadSession().sessionToken;
    if (token) headers.set("X-App-Session", token);
  }

  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  if (opts.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(opts.json);
  }

  try {
    const res = await fetch(`/api/gateway/${clean}`, {
      ...opts,
      headers,
      body,
    });

    let data = {} as T;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = { raw: text } as T;
      }
    }

    const rec = data as unknown as GatewayJson;
    const explicitOk = rec.ok;
    const ok = res.ok && explicitOk !== false;
    const error = ok ? undefined : parseGatewayError(rec, res.status);

    return {
      ok,
      status: res.status,
      data,
      error,
      message: typeof rec.message === "string" ? rec.message : undefined,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: {} as T,
      error: "اتصال برقرار نشد. اینترنت یا سرور را بررسی کنید.",
    };
  }
}