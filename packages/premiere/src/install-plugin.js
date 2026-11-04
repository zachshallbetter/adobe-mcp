/**
 * Install the MCP Bridge plugin into Premiere Pro without the UXP Developer Tool:
 * package uxp/plugin as a .ccx and hand it to Adobe's Unified Plugin Installer Agent
 * (UPIA), which the Creative Cloud app installs on every machine with Adobe apps.
 *
 *   adobe-mcp-premiere install-plugin            package and install
 *   adobe-mcp-premiere install-plugin --package  only write the .ccx and print its path
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PLUGIN_DIR = fileURLToPath(new URL('../uxp/plugin/', import.meta.url));
const IS_WINDOWS = process.platform === 'win32';

/** Where UPIA lives on this platform (null on Linux, which has no Adobe apps). */
export function upiaPath() {
    if (process.platform === 'darwin') {
        return '/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent';
    }
    if (IS_WINDOWS) {
        const common = process.env.CommonProgramFiles || 'C:\\Program Files\\Common Files';
        return path.join(common, 'Adobe', 'Adobe Desktop Common', 'RemoteComponents', 'UPI', 'UnifiedPluginInstallerAgent', 'UnifiedPluginInstallerAgent.exe');
    }
    return null;
}

/** Zip the plugin folder (manifest.json at the root) into a .ccx and return its path. */
export function packagePlugin(outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adobe-mcp-premiere-'))) {
    const manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN_DIR, 'manifest.json'), 'utf8'));
    const file = path.join(outDir, `${manifest.id}_${manifest.version}.ccx`);
    fs.rmSync(file, { force: true });
    const result = IS_WINDOWS
        ? spawnSync('powershell', ['-NoProfile', '-Command',
            `Compress-Archive -Path '${PLUGIN_DIR.replace(/'/g, "''")}*' -DestinationPath '${file.replace(/\.ccx$/, '.zip').replace(/'/g, "''")}' -Force`], { encoding: 'utf8' })
        : spawnSync('zip', ['-r', '-X', '-q', file, '.'], { cwd: PLUGIN_DIR, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(`could not package the plugin: ${(result.stderr || result.error?.message || '').trim()}`);
    if (IS_WINDOWS) fs.renameSync(file.replace(/\.ccx$/, '.zip'), file);
    return file;
}

/** Install the packaged plugin with UPIA. Returns { ok, output }. */
export function installPlugin(ccx, upia = upiaPath()) {
    if (!upia || !fs.existsSync(upia)) {
        return { ok: false, output: 'Adobe\'s plugin installer (part of the Creative Cloud app) was not found. Install the Creative Cloud app, or load the plugin with the UXP Developer Tool.' };
    }
    const result = spawnSync(upia, ['--install', ccx], { encoding: 'utf8', timeout: 180000 });
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    // UPIA exits 0 even for some failures; it reports success in words.
    const ok = result.status === 0 && /success/i.test(output) && !/fail|error/i.test(output);
    let text = output || result.error?.message || `exit ${result.status}`;
    if (/status = -411/.test(output)) {
        text += '\nAdobe reports no compatible Premiere Pro (25.6 or later) on this machine, or Creative Cloud does not list it as installed yet. Install or update Premiere Pro, open it once, then run this again.';
    }
    return { ok, output: text };
}

export function main(args) {
    try {
        const ccx = packagePlugin();
        if (args.includes('--package')) {
            console.log(ccx);
            return 0;
        }
        console.log(`Packaged the MCP Bridge plugin: ${ccx}`);
        const { ok, output } = installPlugin(ccx);
        console.log(output);
        if (ok) {
            console.log('\nInstalled. Restart Premiere Pro, then open Window > UXP Plugins > MCP Bridge; it connects to this server by itself.');
            return 0;
        }
        console.log(`\nNot installed automatically. You can double-click ${ccx} to install it through the Creative Cloud app, or load uxp/plugin/manifest.json with the UXP Developer Tool.`);
        return 1;
    } catch (error) {
        console.error(error.message);
        return 1;
    }
}
