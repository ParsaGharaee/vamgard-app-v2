import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SESSION_HEADER = "x-app-session";

function upstreamBase() {
  const base = (process.env.NEXT_PUBLIC_VAMGARD_API || "https://vamgard.org").replace(/\/$/, "");
  return `${base}/api/app/v1`;
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const key = process.env.VAMGARD_GATEWAY_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "gateway_key_missing", hint: "Set VAMGARD_GATEWAY_KEY in .env.local" },
      { status: 503 },
    );
  }

  const path = pathSegments.map((p) => encodeURIComponent(p)).join("/");
  const target = `${upstreamBase()}/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("X-App-Key", key);

  const session =
    req.headers.get(SESSION_HEADER) ||
    req.headers.get("X-App-Session") ||
    req.cookies.get("X-App-Session")?.value;
  if (session) headers.set("X-App-Session", session);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const text = await upstream.text();
    const resHeaders = new Headers();
    const ct = upstream.headers.get("content-type");
    if (ct) resHeaders.set("Content-Type", ct);

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) resHeaders.set("Set-Cookie", setCookie);

    return new NextResponse(text || "{}", {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "upstream_unreachable", message: "سرور وام‌گرد در دسترس نیست." },
      { status: 502 },
    );
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}