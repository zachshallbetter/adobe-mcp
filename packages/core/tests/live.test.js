import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { runLive } from '../src/testing/live.js';

// A stand-in application: a document with named items, reachable only through tools.
function fakeApp({ running = true } = {}) {
    const items = new Map();
    const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }] });
    const tools = {
        fake_status: () => text(running ? { running: true, version: '22.0.0.104' } : { running: false }),
        create_item: ({ name }) => { items.set(name, { name }); return text({ success: true, result: { name } }); },
        list_items: () => text([...items.values()]),
        delete_item: ({ name }) => text(items.delete(name) ? 'Deleted' : `Item ${name} not found`),
        broken: () => ({ isError: true, content: [{ type: 'text', text: 'Error: boom' }] }),
        never_called: () => text('ok'),
    };
    const mcp = new Server({ name: 'fake', version: '0.0.0' }, { capabilities: { tools: {} } });
    mcp.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: Object.keys(tools).map((name) => ({ name, inputSchema: { type: 'object' } })) }));
    mcp.setRequestHandler(CallToolRequestSchema, async (req) => tools[req.params.name](req.params.arguments ?? {}));
    return async () => {
        const [a, b] = InMemoryTransport.createLinkedPair();
        await mcp.connect(a);
        const client = new Client({ name: 'test', version: '0.0.0' });
        await client.connect(b);
        return client;
    };
}

const base = { app: 'indesign', server: 'fake@0.0.0', os: 'macOS test', status: async (call) => { const s = await call('fake_status'); return s.running ? s.version : null; } };

test('records validated, smoke, failed, skipped and not run, and writes atlas records', async () => {
    const atlasDir = mkdtempSync(join(tmpdir(), 'live-'));
    const report = await runLive({
        ...base, atlasDir, connect: fakeApp(),
        scenarios: [
            ['create and read back', async (t) => {
                await t.call('create_item', { name: 'box' });
                const items = await t.call('list_items');
                t.check('create_item', items.some((i) => i.name === 'box'), 'list_items includes the new item "box"');
            }],
            ['delete something missing', async (t) => { await t.call('delete_item', { name: 'ghost' }); }],
            ['tool error', async (t) => { await t.call('broken'); }],
            ['skip', async (t) => { t.skip('never_called', 'needs a printer'); }],
        ],
    });
    assert.equal(report.appVersion, '22.0.0.104');
    const by = Object.fromEntries(report.rows.map((r) => [r.tool, r]));
    assert.equal(by.create_item.outcome, 'validated');
    assert.equal(by.create_item.check, 'list_items includes the new item "box"');
    assert.equal(by.list_items.outcome, 'smoke');
    assert.equal(by.delete_item.outcome, 'failed');
    assert.match(by.delete_item.note, /not found/);
    assert.equal(by.broken.outcome, 'failed');
    assert.equal(by.never_called.outcome, 'skipped');
    assert.deepEqual(report.notRun, ['fake_status']);
    assert.equal(report.errors.length, 2);

    const file = join(atlasDir, 'corpus', 'indesign', 'validation', `${report.rows[0].run_at.slice(0, 10)}.json`);
    const written = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(written.length, 5);
    assert.match(written[0].id, /^indesign\.validation\.\d{4}-\d{2}-\d{2}\.[a-z_]+$/);
});

test('a failed check is recorded as failed, and a later success in the run does not hide it', async () => {
    const report = await runLive({
        ...base, connect: fakeApp(),
        scenarios: [['twice', async (t) => {
            await t.call('create_item', { name: 'a' });
            t.check('create_item', false, 'item has the wrong name');
            await t.call('create_item', { name: 'b' });
            t.check('create_item', true, 'item exists');
        }]],
    });
    const row = report.rows.find((r) => r.tool === 'create_item');
    assert.equal(row.outcome, 'failed');
    assert.match(row.note, /wrong name/);
});

test('nothing runs when the application is not running', async () => {
    await assert.rejects(
        runLive({ ...base, connect: fakeApp({ running: false }), scenarios: [['x', async (t) => { await t.call('create_item', { name: 'a' }); }]] }),
        /isn't running/,
    );
});
