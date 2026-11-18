import { randomUUID } from "crypto";
import { assertFinnotechConfig, getFinnotechConfig } from "./config";
import { mapFinnotechError } from "./errors";
import { getClientCredentialToken } from "./token";
import type { FinnotechResult, FinnotechService } from "./types";

function buildUrl(pathTemplate: string, pathParams: Record<string, string>, query: Record<string, string>) {
  const cfg = getFinnotechConfig();
  let path = pathTemplate.replace(/\{clientId\}/g, encodeURIComponent(cfg.clientId));

  for (const [key, value] of Object.entries(pathParams)) {
    path = path.replace(new RegExp(`\\{${key}\\}`, "g"), encodeURIComponent(value));
  }

  // leftover unresolved path params
  const unresolved = path.match(/\{[^}]+\}/g);
  if (unresolved?.length) {
    throw new Error(`پارامتر مسیر ناقص است: ${unresolved.join(", ")}`);
  }

  const url = new URL(`${cfg.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && String(v).length) {
      url.searchParams.set(k, String(v));
    }
  }
  if (!url.searchParams.has("trackId")) {
    url.searchParams.set("trackId", randomUUID().replace(/-/g, "").slice(0, 20));
  }
  return url;
}

export async function callFinnotechService(options: {
  service: FinnotechService;
  params: Record<string, string>;
  accessToken?: string;
}): Promise<FinnotechResult> {
  const cfg = getFinnotechConfig();
  assertFinnotechConfig(cfg);

  const { service, params } = options;
  const pathParams: Record<string, string> = {};
  const query: Record<string, string> = {};
  const body: Record<string, unknown> = {};

  for (const field of service.fields) {
    const value = params[field.name];
    if ((value === undefined || value === "") && field.required) {
      throw new Error(`فیلد «${field.label}» الزامی است.`);
    }
    if (value === undefined || value === "") continue;

    if (field.in === "path") pathParams[field.name] = value;
    else if (field.in === "query") query[field.name] = value;
    else body[field.name] = value;
  }

  // Common aliases: path often uses {nid} or {user}
  if (pathTemplateHas(service.path, "nid") && !pathParams.nid) {
    pathParams.nid = params.nid || params.nationalCode || params.user || "";
  }
  if (pathTemplateHas(service.path, "user") && !pathParams.user) {
    pathParams.user = params.user || params.nid || params.nationalCode || "";
  }

  const token =
    options.accessToken ||
    (await getClientCredentialToken(service.scope));

  const url = buildUrl(service.path, pathParams, query);
  const init: RequestInit = {
    method: service.method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  if (service.method !== "GET" && service.method !== "HEAD") {
    (init.headers as Record<string, string>)["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), init);
  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.status === "FAILED" || data?.error) {
    return {
      ok: false,
      status: res.status,
      trackId: data?.trackId,
      responseCode: data?.responseCode,
      error: mapFinnotechError({
        status: res.status,
        responseCode: data?.responseCode,
        message: data?.error?.message || data?.message,
        raw: data,
      }),
      result: data?.result,
    };
  }

  return {
    ok: true,
    status: res.status,
    trackId: data?.trackId,
    responseCode: data?.responseCode,
    result: data?.result ?? data,
  };
}

function pathTemplateHas(template: string, name: string) {
  return template.includes(`{${name}}`);
}
