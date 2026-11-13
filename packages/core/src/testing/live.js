/**
 * Live validation: run a server against the real, running application and record
 * what each tool did, in the capability atlas's validation format
 * (adobe-capability-atlas schemas/validation.schema.json).
 *
 * A scenario is an async function that receives a context:
 *   const r = await t.call(tool, args)   calls the tool; a tool error or a failure string
 *                                        records the tool as failed and throws
 *   t.check(tool, ok, how)               after reading the result back: ok marks the tool
 *                                        validated (how says what was compared), not ok failed
 *   t.skip(tool, why)                    records a deliberate skip
 * A tool that was called but never checked is recorded as smoke: it ran without an
 * error, and nothing confirmed its result. Only validated means the result was checked.
 *
 * This never runs in CI: it needs the application open, and the application must
 * already be running (status tools don't start it).
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { looksLikeFailure } from '../result.js';

/** The text of a tool result, parsed as JSON when it is JSON. */
function payload(result) {
    const text = (result.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
    if (result.structuredContent !== undefined) return result.structuredContent;
    try { return JSON.parse(text); } catch { return text; }
}

/** A failure the server reported in its result rather than as isError. */
function reportedFailure(value) {
    if (typeof value === 'string') return looksLikeFailure(value) ? value : null;
    if (value && typeof value === 'object' && value.success === false) return String(value.result ?? value.error ?? 'success: false');
    return null;
}

/**
 * @param {object} opts
 * @param {string} opts.app            atlas app id, e.g. 'indesign'
 * @param {string} opts.command        node script that starts the server
 * @param {Record<string,string>} [opts.env]
 * @param {Array<[string, (t: object) => Promise<void>]>} opts.scenarios  [name, fn] pairs, run in order
 * @param {string} opts.server         package and source, e.g. 'adobe-mcp-indesign@2.5.0 (adobe-mcp 40e8a33)'
 * @param {(call: (tool: string, args?: object) => Promise<any>) => Promise<string|null>} opts.status
 *                                     asks the server whether the app is running and returns its
 *                                     version; null means it isn't running, and nothing is run.
 *                                     It must not start a closed app (status tools only probe
 *                                     a running app unless given probe: true)
 * @param {string} opts.os             e.g. 'macOS 27.2'
 * @param {string} [opts.atlasDir]     write corpus/<app>/validation/<date>.json here
 * @param {() => Promise<Client>} [opts.connect]  a connected client instead of starting `command` (tests)
 * @param {(line: string) => void} [opts.trace]  called with the time and name of every tool call
 */
export async function runLive({ app, command, env = {}, scenarios, server, status, os, atlasDir, connect, trace }) {
    const client = connect ? await connect() : await (async () => {
        const c = new Client({ name: 'adobe-mcp-live', version: '1.0.0' });
        await c.connect(new StdioClientTransport({ command: process.execPath, args: [command], env: { ...process.env, ...env } }));
        return c;
    })();
    const appVersion = await status(async (tool, args = {}) => payload(await client.callTool({ name: tool, arguments: args })));
    if (!appVersion) {
        await client.close();
        throw new Error("the application isn't running: open it first (the status check never starts it)");
    }
    const runAt = new Date().toISOString();
    const date = runAt.slice(0, 10);
    const records = new Map();
    const record = (tool, fields) => {
        const prev = records.get(tool);
        // A failure sticks: a later success in the same run does not hide it.
        if (prev?.outcome === 'failed' && fields.outcome !== 'failed') return;
        records.set(tool, { ...prev, ...fields });
    };

    const t = {
        async call(tool, args = {}) {
            if (trace) trace(`${new Date().toISOString().slice(11, 23)} ${tool}`);
            if (!records.has(tool)) record(tool, { outcome: 'smoke', args });
            let result;
            try {
                result = await client.callTool({ name: tool, arguments: args }, undefined, { timeout: 120_000 });
            } catch (error) {
                record(tool, { outcome: 'failed', args, note: `call threw: ${error.message}` });
                throw error;
            }
            const value = payload(result);
            const failure = result.isError ? (typeof value === 'string' ? value : JSON.stringify(value)) : reportedFailure(value);
            if (failure) {
                record(tool, { outcome: 'failed', args, note: failure.slice(0, 500) });
                throw new Error(`${tool}: ${failure}`);
            }
            return value;
        },
        check(tool, ok, how) {
            if (!records.has(tool)) throw new Error(`check(${tool}) before the tool was called`);
            record(tool, ok ? { outcome: 'validated', check: how } : { outcome: 'failed', check: how, note: `check failed: ${how}` });
            return ok;
        },
        skip(tool, why) { record(tool, { outcome: 'skipped', note: why }); },
    };

    const errors = [];
    for (const [name, scenario] of scenarios) {
        try { await scenario(t); }
        catch (error) { errors.push(`${name}: ${error.message}`); }
    }
    const { tools } = await client.listTools();
    await client.close();

    const rows = [...records].map(([tool, r]) => ({
        id: `${app}.validation.${date}.${tool}`, app, tool, outcome: r.outcome, run_at: runAt, server, app_version: appVersion, os,
        ...(r.args && Object.keys(r.args).length ? { args: r.args } : {}),
        ...(r.check ? { check: r.check } : {}),
        ...(r.note ? { note: r.note } : {}),
    }));
    if (atlasDir) {
        const dir = join(atlasDir, 'corpus', app, 'validation');
        mkdirSync(dir, { recursive: true });
        const file = join(dir, `${date}.json`);
        // Same-day runs merge: a later run of a tool replaces its earlier record.
        const kept = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).filter((r) => !records.has(r.tool)) : [];
        const all = [...kept, ...rows].sort((a, b) => a.tool.localeCompare(b.tool));
        writeFileSync(file, JSON.stringify(all, null, 2) + '\n');
    }
    const count = (o) => rows.filter((r) => r.outcome === o).length;
    const notRun = tools.map((x) => x.name).filter((n) => !records.has(n));
    return { appVersion, rows, errors, notRun, summary: { validated: count('validated'), smoke: count('smoke'), failed: count('failed'), skipped: count('skipped'), notRun: notRun.length, total: tools.length } };
}
