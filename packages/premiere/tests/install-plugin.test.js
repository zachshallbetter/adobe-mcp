import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin, installPlugin } from '../src/install-plugin.js';

test('the plugin packages as a .ccx with manifest.json at its root', { skip: process.platform === 'win32' }, () => {
    const ccx = packagePlugin();
    assert.match(path.basename(ccx), /^io\.github\.zachshallbetter\.adobe-mcp-premiere_[\d.]+\.ccx$/);
    const listing = spawnSync('unzip', ['-Z1', ccx], { encoding: 'utf8' }).stdout.split('\n');
    for (const file of ['manifest.json', 'index.html', 'index.js', 'runtime.js']) assert.ok(listing.includes(file), file);
    fs.rmSync(path.dirname(ccx), { recursive: true, force: true });
});

test('a missing installer is reported, not thrown', () => {
    const { ok, output } = installPlugin('/nowhere/plugin.ccx', '/definitely/not/UnifiedPluginInstallerAgent');
    assert.equal(ok, false);
    assert.match(output, /Creative Cloud app/);
});

test('an installer that exits without a result while Creative Cloud starts is run again', { skip: process.platform === 'win32' }, () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'upia-'));
    const upia = path.join(dir, 'UnifiedPluginInstallerAgent');
    const runs = path.join(dir, 'runs');
    // First run: only the "not running" notice, as UPIA prints on a cold start. Second: success.
    fs.writeFileSync(upia, `#!/bin/sh\necho x >> '${runs}'\nif [ "$(wc -l < '${runs}')" -lt 2 ]; then echo 'Creative Cloud app is not running, this may take a while ...'; else echo "Installation Successful for extension with file path = $2"; fi\n`, { mode: 0o755 });
    const { ok, output } = installPlugin('/tmp/plugin.ccx', upia, { delayMs: 10 });
    assert.equal(ok, true);
    assert.match(output, /Installation Successful/);
    assert.equal(fs.readFileSync(runs, 'utf8').trim().split('\n').length, 2);
    fs.rmSync(dir, { recursive: true, force: true });
});
