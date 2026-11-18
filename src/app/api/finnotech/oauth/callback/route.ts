import { NextRequest, NextResponse } from "next/server";

/** OAuth redirect landing — used by Finnotech SMS authorize redirect_uri. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  const html = `<!doctype html><html lang="fa" dir="rtl"><body style="font-family:tahoma;padding:24px">
    <h3>${error ? "خطای مجوز" : "مجوز دریافت شد"}</h3>
    <p>${error ? error : "می‌توانید این پنجره را ببندید و به اپ بازگردید."}</p>
    <script>
      try {
        window.opener && window.opener.postMessage({ type: 'finnotech-oauth', code: ${JSON.stringify(code)}, state: ${JSON.stringify(state)}, error: ${JSON.stringify(error)} }, '*');
      } catch (e) {}
    </script>
  </body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
