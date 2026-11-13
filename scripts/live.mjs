#!/usr/bin/env node
// Run an app's live scenarios against the real, running application and record each
// tool's outcome for the capability atlas.
//
//   node scripts/live.mjs <app> [--atlas <atlas checkout>] [--only <scenario regex>]
//
// The app must already be open; it is left in the background (<APP>_ACTIVATE=false) except
// for menu commands. Scenarios are in packages/<app>/tests/live/index.js and
// work only in ~/Documents/adobe-mcp-validation. Records go to
// <atlas>/corpus/<app>/validation/<date>.json (default atlas: ../adobe-capability-atlas).
// Never run in CI.
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runLive } from 'adobe-mcp-core/testing/live';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [app, ...rest] = process.argv.slice(2);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
if (!app) { console.error('usage: node scripts/live.mjs <app> [--atlas <dir>] [--only <regex>]'); process.exit(2); }

const pkgDir = join(root, 'packages', app);
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const atlasApp = { indesign: 'indesign', illustrator: 'illustrator', photoshop: 'photoshop', aftereffects: 'aftereffects', premiere: 'premiere' }[app];
if (!atlasApp) { console.error(`no live scenarios for ${app}`); process.exit(2); }

const scratch = join(homedir(), 'Documents', 'adobe-mcp-validation');
mkdirSync(join(scratch, 'out', app), { recursive: true });
const { status, scenarios } = await import(pathToFileURL(join(pkgDir, 'tests', 'live', 'index.js')));
const only = opt('--only') ? new RegExp(opt('--only')) : null;
const sha = execFileSync('git', ['-C', root, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain', '--', join('packages', app, 'src'), 'packages/core/src'], { encoding: 'utf8' }).trim() ? '+changes' : '';
const os = `macOS ${execFileSync('sw_vers', ['-productVersion'], { encoding: 'utf8' }).trim()}`;

const report = await runLive({
    app: atlasApp,
    command: join(pkgDir, pkg.bin[pkg.name]),
    // The app stays behind your windows; it comes forward only for menu commands.
    env: { [`${app.toUpperCase()}_ALLOWED_DIRS`]: scratch, [`${app.toUpperCase()}_ACTIVATE`]: 'false' },
    scenarios: scenarios(join(scratch, 'out', app)).filter(([name]) => !only || only.test(name)),
    status,
    server: `${pkg.name}@${pkg.version} (adobe-mcp ${sha}${dirty})`,
    os,
    atlasDir: resolve(opt('--atlas') ?? join(root, '..', 'adobe-capability-atlas')),
});

const s = report.summary;
console.log(`${pkg.name} against ${app} ${report.appVersion}: ${s.validated} validated, ${s.smoke} smoke, ${s.failed} failed, ${s.skipped} skipped, ${s.notRun} not run of ${s.total} tools`);
for (const r of report.rows.filter((x) => x.outcome === 'failed')) console.log(`  failed ${r.tool}: ${r.note}`);
for (const e of report.errors) console.log(`  scenario stopped: ${e}`);
