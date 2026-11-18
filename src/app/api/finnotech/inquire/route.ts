import { NextRequest, NextResponse } from "next/server";
import { callFinnotechService } from "@/src/lib/finnotech/client";
import { getServiceById } from "@/src/lib/finnotech/catalog";
import { mapFinnotechError } from "@/src/lib/finnotech/errors";
import { smsToken } from "@/src/lib/finnotech/token";
import { getServiceById as getGenerated } from "@/src/lib/finnotech/catalog.generated";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serviceId = String(body.serviceId || "");
    const params = (body.params || {}) as Record<string, string>;
    const smsAccessToken = body.smsAccessToken as string | undefined;
    const smsCode = body.smsCode as string | undefined;

    const target = getGenerated(serviceId) || getServiceById(serviceId);
    if (!target || target.operationId.startsWith("composite")) {
      return NextResponse.json({ ok: false, error: "سرویس یافت نشد." }, { status: 404 });
    }

    let accessToken = smsAccessToken;
    if (!accessToken && smsCode && target.grantType === "authorization_sms") {
      accessToken = await smsToken({ code: smsCode, scopes: target.scope });
    }

    const result = await callFinnotechService({
      service: target,
      params,
      accessToken,
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (err: unknown) {
    const message = mapFinnotechError({
      message: err instanceof Error ? err.message : "خطای ناشناخته",
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
