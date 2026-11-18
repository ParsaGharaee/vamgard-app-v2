const fs = require("fs");
const path = require("path");
const txt = fs.readFileSync(
  path.join(__dirname, "../src/lib/finnotech/catalog.generated.ts"),
  "utf8"
);
const m = txt.match(/export const finnotechServices[^=]*=\s*(\[[\s\S]*?\n\]);/);
const services = eval(m[1]);
const enums = new Map();
for (const s of services) {
  for (const f of s.fields) {
    if (!f.enum?.length) continue;
    for (const v of f.enum) {
      if (/[A-Za-z]/.test(v)) {
        const key = `${f.name}:${v}`;
        if (!enums.has(key)) enums.set(key, { field: f.name, value: v, titles: [] });
        enums.get(key).titles.push(s.title);
      }
    }
  }
  if (/[A-Za-z]{3,}/.test(s.title) && !/OTP|PDF|JSON|SMS|API|IBAN|OCR|KYC|KYB/.test(s.title)) {
    // skip
  }
}
console.log([...enums.values()].map((e) => `${e.field} = ${e.value}`).join("\n"));
console.log("\ncount", enums.size);
