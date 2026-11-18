const fs = require("fs");
const path = require("path");

const spec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "finnotech-openapi.json"), "utf8")
);

function resolveRef(ref) {
  if (!ref || !ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let cur = spec;
  for (const p of parts) cur = cur?.[p];
  return cur;
}

function schemaType(schema) {
  if (!schema) return "string";
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref);
    return schemaType(resolved);
  }
  return schema.type || "string";
}

const paths = spec.paths || {};
const ops = [];

for (const [apiPath, methods] of Object.entries(paths)) {
  for (const [method, op] of Object.entries(methods)) {
    if (!op || typeof op !== "object" || !op.operationId) continue;

    let scope = op["x-scope"] || null;
    const sec = op.security || [];
    if (!scope && Array.isArray(sec)) {
      for (const s of sec) {
        for (const vals of Object.values(s)) {
          if (Array.isArray(vals) && vals.length) {
            scope = vals[0];
            break;
          }
        }
        if (scope) break;
      }
    }

    // Sometimes scope is in description / extensions
    if (!scope && op["x-finnotech-scope"]) scope = op["x-finnotech-scope"];

    const params = (op.parameters || []).map((p) => ({
      name: p.name,
      in: p.in,
      required: !!p.required,
      type: schemaType(p.schema),
      description: p.description || "",
    }));

    let bodyProps = [];
    if (op.requestBody?.content) {
      const content =
        op.requestBody.content["application/json"] ||
        op.requestBody.content["multipart/form-data"] ||
        Object.values(op.requestBody.content)[0];
      let schema = content?.schema;
      if (schema?.$ref) schema = resolveRef(schema.$ref);
      if (schema?.properties) {
        bodyProps = Object.entries(schema.properties).map(([name, s]) => ({
          name,
          in: "body",
          required: (schema.required || []).includes(name),
          type: schemaType(s),
          description: s.description || "",
        }));
      }
    }

    ops.push({
      id: op.operationId,
      summary: op.summary || "",
      description: (op.description || "").slice(0, 200),
      method: method.toUpperCase(),
      path: apiPath,
      tags: op.tags || [],
      scope,
      params,
      bodyProps,
      hasBody: !!op.requestBody,
    });
  }
}

const TOKEN_IDS = new Set([
  "boomrangGetClientCredentialToken",
  "boomrangRefreshToken",
  "boomrangSmsStep1Authorize",
  "boomrangSmsStep2Verify",
  "boomrangSmsStep3Token",
]);

const usable = ops.filter((o) => !TOKEN_IDS.has(o.id));

console.log("total", ops.length, "usable", usable.length);
console.log(
  "tags",
  [...new Set(ops.flatMap((o) => o.tags))].join(" | ")
);
console.log(
  "missing scope",
  usable.filter((o) => !o.scope).length
);

fs.writeFileSync(
  path.join(__dirname, "..", "finnotech-ops.json"),
  JSON.stringify({ usable, all: ops }, null, 2)
);

// Print sample
console.log(JSON.stringify(usable.slice(0, 3), null, 2));
