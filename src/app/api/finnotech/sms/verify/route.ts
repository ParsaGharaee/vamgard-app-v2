import { NextRequest, NextResponse } from "next/server";
import { mapFinnotechError } from "@/src/lib/finnotech/errors";
import { smsToken, smsVerify } from "@/src/lib/finnotech/token";
import { getServiceById } from "@/src/lib/finnotech/catalog.generated";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mobile = String(body.mobile || "");
    const otp = String(body.otp || "");
    const trackId = body.trackId ? String(body.trackId) : undefined;
    const serviceId = String(body.serviceId || "");
    const service = getServiceById(serviceId);

    const verified = await smsVerify({ mobile, otp, trackId });
    const code = verified.code || verified.authorizationCode || verified.authCode;
    if (!code) {
      return NextResponse.json(
        { ok: false, error: "کد مجوز از فینوتک دریافت نشد.", result: verified },
        { status: 400 }
      );
    }

    const accessToken = await smsToken({
      code: String(code),
      scopes: service?.scope,
    });

    return NextResponse.json({ ok: true, accessToken, result: verified });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: mapFinnotechError({
          message: err instanceof Error ? err.message : "خطا در تایید کد پیامکی",
        }),
      },
      { status: 500 }
    );
  }
}
