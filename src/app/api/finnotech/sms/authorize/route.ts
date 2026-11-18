import { NextRequest, NextResponse } from "next/server";
import { getServiceById } from "@/src/lib/finnotech/catalog.generated";
import { mapFinnotechError } from "@/src/lib/finnotech/errors";
import { smsAuthorize } from "@/src/lib/finnotech/token";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mobile = String(body.mobile || "");
    const serviceId = String(body.serviceId || "");
    const service = getServiceById(serviceId);
    if (!service?.scope) {
      return NextResponse.json({ ok: false, error: "سرویس یافت نشد." }, { status: 404 });
    }
    if (!/^09\d{9}$/.test(mobile)) {
      return NextResponse.json({ ok: false, error: "شماره موبایل نامعتبر است." }, { status: 400 });
    }

    const result = await smsAuthorize({ mobile, scopes: service.scope });
    return NextResponse.json({ ok: true, result });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: mapFinnotechError({
          message: err instanceof Error ? err.message : "خطا در ارسال پیامک مجوز",
        }),
      },
      { status: 500 }
    );
  }
}
