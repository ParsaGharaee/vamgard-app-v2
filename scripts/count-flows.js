const fs = require("fs");
const txt = fs.readFileSync("src/lib/finnotech/catalog.generated.ts", "utf8");
console.log({
  sms: (txt.match(/authorization_sms/g) || []).length,
  otp: (txt.match(/"flow": "otp"/g) || []).length,
  plate: (txt.match(/"flow": "plate"/g) || []).length,
  upload: (txt.match(/"flow": "upload"/g) || []).length,
  generic: (txt.match(/"flow": "generic"/g) || []).length,
  custom: (txt.match(/"flow": "custom"/g) || []).length,
});
