// A status check must not start Illustrator: probing a closed app is opt-in (probe: true).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executor } from '../src/executor.js';
import { tools } from '../src/tools/utility.js';

const statusTool = tools.find((t) => t.name === 'illustrator_status');

async function withStatus(running, fn) {
    const original = { status: executor.status, runStructured: executor.runStructured };
    let probed = 0;
    executor.status = async () => ({ platform: 'darwin', running, backend: { configured: 'extendscript', resolved: 'extendscript' } });
    executor.runStructured = async () => {
        probed += 1;
        return { ok: true, result: JSON.stringify({ version: '1.0', documents: 0 }) };
    };
    try {
        await fn(() => probed);
    } finally {
        Object.assign(executor, original);
    }
}

test('illustrator_status does not probe Illustrator when it is closed', async () => {
    await withStatus(false, async (probed) => {
        const res = await statusTool.handler({});
        assert.equal(probed(), 0);
        assert.match(res.result.note, /not running/);
        assert.equal(res.success, true);
    });
});

test('illustrator_status probes when Illustrator is running, or when asked to', async () => {
    await withStatus(true, async (probed) => {
        await statusTool.handler({});
        assert.equal(probed(), 1);
    });
    await withStatus(false, async (probed) => {
        await statusTool.handler({ probe: true });
        assert.equal(probed(), 1);
    });
});
