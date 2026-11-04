import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
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
