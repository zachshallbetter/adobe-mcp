/**
 * InDesign scenarios for layers, transforms, character and paragraph formatting, and tables.
 * Effects are read back from the document model with execute_indesign_code, which reads
 * in millimetres and changes nothing.
 */
const text = (r) => (typeof r === 'string' ? r : typeof r?.result === 'string' ? r.result : JSON.stringify(r?.result ?? r));
const close = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

/** ExtendScript has no JSON: a small encoder for plain values (toSource leaves \r unescaped). */
const JSON_JSX = `function __json(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return '"' + v.replace(/[\\\\"]/g, function (c) { return "\\\\" + c; }).replace(/[\\u0000-\\u001f]/g, function (c) { return "\\\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4); }) + '"';
  if (v instanceof Array) { var a = []; for (var i = 0; i < v.length; i++) a.push(__json(v[i])); return "[" + a.join(",") + "]"; }
  var o = []; for (var k in v) if (v.hasOwnProperty(k)) o.push(__json(k) + ":" + __json(v[k])); return "{" + o.join(",") + "}";
}`;

/** Run read-only ExtendScript in mm and return its value: `code` is a function body that returns it. */
async function dom(t, code) {
    const wrapped = [
        JSON_JSX,
        'var __u = app.scriptPreferences.measurementUnit;',
        'app.scriptPreferences.measurementUnit = MeasurementUnits.MILLIMETERS;',
        'var __out;',
        `try { __out = (function () { var doc = app.activeDocument; ${code} })(); } finally { app.scriptPreferences.measurementUnit = __u; }`,
        '__json(__out);',
    ].join('\n');
    return JSON.parse(text(await t.call('execute_indesign_code', { code: wrapped })));
}

/** The id of the newest page item of a type on page 1. */
async function newestId(t, type) {
    const listing = text(await t.call('list_page_items', { pageIndex: 0 }));
    return Number([...listing.matchAll(/Type: (\w+)[\s\S]*?ID: (\d+)/g)].find((m) => m[1] === type)?.[2]);
}

export function formatScenarios(inNewDocument) {
    return [
        ['layers', (t) => inNewDocument(t, async () => {
            await t.call('create_layer', { name: 'Live Layer', color: 'GREEN' });
            let layer = await dom(t, 'var l = doc.layers.itemByName("Live Layer"); return { ok: l.isValid, color: l.layerColor.toString() };');
            t.check('create_layer', layer.ok && layer.color === 'GREEN', 'the document has a layer "Live Layer" coloured GREEN');
            t.check('execute_indesign_code', layer.ok === true, 'runs a read-only script and returns its value');

            await t.call('set_layer_options', { layer: 'Live Layer', color: 'RED', options: { printable: false } });
            layer = await dom(t, 'var l = doc.layers.itemByName("Live Layer"); return { color: l.layerColor.toString(), printable: l.printable };');
            t.check('set_layer_options', layer.color === 'RED' && layer.printable === false, 'the layer is now RED and not printable');

            await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 20, width: 40, height: 20 });
            const rect = await newestId(t, 'Rectangle');
            await t.call('send_items_to_layer', { target: { ids: [rect] }, layer: 'Live Layer' });
            const on = await dom(t, `return { layer: doc.pageItems.itemByID(${rect}).itemLayer.name };`);
            t.check('send_items_to_layer', on.layer === 'Live Layer', 'the rectangle is on "Live Layer"');

            await t.call('set_active_layer', { layerName: 'Live Layer' });
            const active = await dom(t, 'return { name: doc.activeLayer.name };');
            t.check('set_active_layer', active.name === 'Live Layer', 'the active layer is "Live Layer"');
        })],

        ['transforms', (t) => inNewDocument(t, async () => {
            await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 20, width: 40, height: 20 });
            const a = await newestId(t, 'Rectangle');
            await t.call('transform_items', { target: { ids: [a] }, rotate: 30 });
            let s = await dom(t, `var i = doc.pageItems.itemByID(${a}); return { r: i.rotationAngle };`);
            t.check('transform_items', close(s.r, 30), 'the rectangle\'s rotation angle is 30°');

            await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 80, width: 40, height: 20 });
            const b = await newestId(t, 'Rectangle');
            await t.call('turn_items', { target: { ids: [b] }, operation: 'rotate_180' });
            s = await dom(t, `var i = doc.pageItems.itemByID(${b}); return { r: i.rotationAngle };`);
            t.check('turn_items', close(Math.abs(s.r), 180), 'the second rectangle is turned 180°');

            await t.call('create_rectangle', { pageIndex: 0, x: 100, y: 150, width: 30, height: 20 });
            const c = await newestId(t, 'Rectangle');
            const before = await dom(t, `return { x: doc.pageItems.itemByID(${c}).geometricBounds[1] };`);
            await t.call('nudge_items', { target: { ids: [c] }, action: 'nudge_right', step: 'normal', times: 2 });
            const after = await dom(t, `return { x: doc.pageItems.itemByID(${c}).geometricBounds[1] };`);
            t.check('nudge_items', after.x > before.x, `the third rectangle moved right (x ${before.x.toFixed(2)} → ${after.x.toFixed(2)} mm)`);

            await t.call('create_rectangle', { pageIndex: 0, x: 60, y: 200, width: 30, height: 20 });
            const d = await newestId(t, 'Rectangle');
            await t.call('align_items', { target: { ids: [c, d] }, align: 'left', alignTo: 'selection' });
            s = await dom(t, `return { c: doc.pageItems.itemByID(${c}).visibleBounds[1], d: doc.pageItems.itemByID(${d}).visibleBounds[1] };`);
            t.check('align_items', close(s.c, s.d), `both rectangles share the left edge (${s.c.toFixed(2)} and ${s.d.toFixed(2)} mm)`);
        })],

        ['character and paragraph formatting', (t) => inNewDocument(t, async () => {
            await t.call('create_text_frame', { content: 'Live formatting text\rSecond paragraph', pageIndex: 0, x: 20, y: 20, width: 120, height: 40 });
            const frame = await newestId(t, 'TextFrame');
            await t.call('set_character_attributes', { text: { ids: [frame], wholeStory: true }, character: { pointSize: 20 } });
            let s = await dom(t, `var st = doc.pageItems.itemByID(${frame}).parentStory; return { size: st.characters[0].pointSize };`);
            t.check('set_character_attributes', close(s.size, 20 * 25.4 / 72, 0.01) || s.size === 20, 'the story\'s text is 20 pt');

            await t.call('change_case', { text: { ids: [frame], wholeStory: true }, mode: 'UPPERCASE' });
            s = await dom(t, `return { text: String(doc.pageItems.itemByID(${frame}).parentStory.contents) };`);
            t.check('change_case', s.text.startsWith('LIVE FORMATTING TEXT'), 'the story reads "LIVE FORMATTING TEXT…"');

            await t.call('set_paragraph_formatting', { target: { frameIds: [frame], wholeStory: true }, indents: { left: 5, spaceAfter: 2 } });
            s = await dom(t, `var p = doc.pageItems.itemByID(${frame}).parentStory.paragraphs[0]; return { left: p.leftIndent, after: p.spaceAfter };`);
            t.check('set_paragraph_formatting', close(s.left, 5) && close(s.after, 2), 'the first paragraph has a 5 mm left indent and 2 mm space after');
        })],

        ['tables', (t) => inNewDocument(t, async () => {
            await t.call('create_table', { rows: 3, columns: 2, pageIndex: 0 });
            const info = JSON.parse(text(await t.call('get_table_info', {})));
            const table = { storyId: info.tables[0].storyId, index: 0 };
            const shape = async () => dom(t, `var tb = doc.stories.itemByID(${table.storyId}).tables[0]; return { rows: tb.rows.length, cols: tb.columns.length, header: tb.headerRowCount, footer: tb.footerRowCount };`);

            await t.call('set_table_options', { table, setup: { footerRows: 1 } });
            let s = await shape();
            t.check('set_table_options', s.footer === 1, 'the table has one footer row');

            await t.call('insert_table_rows_columns', { table, kind: 'rows', count: 2, reference: 1, position: 'after' });
            const grown = await shape();
            t.check('insert_table_rows_columns', grown.rows === s.rows + 2, `rows went from ${s.rows} to ${grown.rows}`);

            await t.call('delete_table_parts', { table, part: 'columns', cells: { columns: [1] } });
            s = await shape();
            t.check('delete_table_parts', s.cols === 1, 'one column is left');

            await t.call('convert_table_to_text', { table });
            const left = await dom(t, `return { tables: doc.stories.itemByID(${table.storyId}).tables.length };`);
            t.check('convert_table_to_text', left.tables === 0, 'the story has no table any more');

            await t.call('convert_text_to_table', { source: { storyId: table.storyId }, columnSeparator: 'tab', rowSeparator: 'paragraph' });
            const back = await dom(t, `return { tables: doc.stories.itemByID(${table.storyId}).tables.length };`);
            t.check('convert_text_to_table', back.tables === 1, 'the story holds a table again');
        })],
    ];
}
