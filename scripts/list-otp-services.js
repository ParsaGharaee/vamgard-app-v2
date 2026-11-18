const fs = require("fs");
const path = require("path");
const { finnotechServices } = (() => {
  // parse generated TS as JSON-ish by eval after strip
  const txt = fs.readFileSync(
    path.join(__dirname, "../src/lib/finnotech/catalog.generated.ts"),
    "utf8"
  );
  const m = txt.match(/export const finnotechServices[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error("no array");
  return { finnotechServices: eval(m[1]) };
})();

const interesting = finnotechServices.filter((s) => {
  const blob = `${s.id} ${s.title} ${s.scope} ${s.flow} ${s.grantType}`;
  return (
    s.grantType === "authorization_sms" ||
    s.flow === "otp" ||
    /sms|otp|پیامک|مرحله|verify/i.test(blob) ||
    s.fields.some((f) => f.kind === "otp" || /otp|verify/i.test(f.name))
  );
});

for (const s of interesting) {
  console.log(
    [
      s.flow.padEnd(8),
      s.grantType.padEnd(20),
      s.id,
      "|",
      s.title,
      "| fields:",
      s.fields.map((f) => f.name + ":" + f.kind).join(","),
    ].join(" ")
  );
}
console.log("\nTOTAL", interesting.length);
console.log(
  "by flow",
  interesting.reduce((a, s) => ((a[s.flow] = (a[s.flow] || 0) + 1), a), {})
);
console.log(
  "by grant",
  interesting.reduce((a, s) => ((a[s.grantType] = (a[s.grantType] || 0) + 1), a), {})
);
