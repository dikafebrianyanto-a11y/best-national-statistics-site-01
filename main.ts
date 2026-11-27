// NusaStat entrypoint (Node 22, standard library only).
//
// Hands the site in: copies app/ and screenshots/ from this repository into
// the output directory and writes /output/dossier.json with buildDossier
// from vendor/makefun-frontend.ts, exactly as the kit requires.
//
// The grader runs this twice into a fresh /output each time and the two
// runs must write the same bytes. Nothing here depends on the clock, the
// environment, or the network, so the output is byte-identical every run.
//
// The output directory itself is never deleted: the grader mounts it as a
// volume, so only its contents (app/, screenshots/, dossier.json) are
// cleared before the fresh copy.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Clear only the contents the previous run may have left, never the
// directory itself.
for (const name of ["app", "screenshots", "dossier.json"]) {
  const target = join(outDir, name);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
  recursive: true,
});

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("NusaStat entry written to", outDir);
