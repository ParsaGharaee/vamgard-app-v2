import type { FinnotechResult } from "./types";

export async function inquireService(
  serviceId: string,
  params: Record<string, string>,
  extras?: { smsAccessToken?: string; smsCode?: string }
): Promise<FinnotechResult> {
  const res = await fetch("/api/finnotech/inquire", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serviceId,
      params,
      smsAccessToken: extras?.smsAccessToken,
      smsCode: extras?.smsCode,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.error) {
    return { ok: false, error: "خطا در ارتباط با سرور." };
  }
  return data as FinnotechResult;
}

export async function authorizeSms(serviceId: string, mobile: string) {
  const res = await fetch("/api/finnotech/sms/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceId, mobile }),
  });
  return res.json();
}

export async function verifySms(payload: {
  serviceId: string;
  mobile: string;
  otp: string;
  trackId?: string;
}) {
  const res = await fetch("/api/finnotech/sms/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
