/**
 * Live scenarios for InDesign: node scripts/live.mjs indesign (from the repository root).
 *
 * Each scenario works in a new document it creates, checks every result by reading it
 * back through another tool, and closes only that document, without saving unless a
 * step saves to the scratch folder. Documents already open in InDesign are not touched.
 */
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readScenario } from './read.js';
import { fileScenarios } from './files.js';

/** The text a tool returned: InDesign handlers wrap their script's string in { success, result }. */
const text = (r) => (typeof r === 'string' ? r : typeof r?.result === 'string' ? r.result : JSON.stringify(r));
const field = (s, label) => s.match(new RegExp(`${label}:\\s*([^\\n]+)`))?.[1]?.trim();

/** Running only if the app is already open: probe:true would start it. */
export async function status(call) {
    const state = async (args) => { const r = await call('indesign_status', args); return (r?.result ?? r)?.indesign; };
    if (!(await state({}))?.running) return null;
    return (await state({ probe: true }))?.version ?? null;
}

/** InDesign's document count and active document name, read without starting it. */
async function documents(t) {
    const s = (await t.call('indesign_status', { probe: true }))?.result?.indesign ?? {};
    return { count: s.documentCount ?? 0, active: s.activeDocument ?? null };
}

/**
 * Create a scratch document, run steps in it, then close every document the steps left
 * open, even when a step fails. Only documents this scenario made are closed: the new
 * document under its first name or the name it was saved as (live-…indd), and never
 * more than were opened.
 */
async function inNewDocument(t, steps) {
    const before = await documents(t);
    const created = text(await t.call('create_document', { width: 210, height: 297, pages: 2, marginTop: 15, marginBottom: 15, marginLeft: 15, marginRight: 15 }));
    const name = created.match(/Document name: (.+)/)?.[1]?.trim();
    const info = text(await t.call('get_document_info'));
    t.check('create_document', field(info, 'Name') === name && field(info, 'Pages') === '2' && Number(field(info, 'Document Width')) === 210 && Number(field(info, 'Margin Top')) === 15,
        'get_document_info reports the new document by name with 2 pages, width 210 mm and top margin 15 mm');
    t.check('get_document_info', field(info, 'Name') === name, 'its Name matches the document create_document reported');
    try {
        await steps(name);
    } finally {
        await closeScratch(t, before.count, name);
    }
}

/** Close the active document while it is one of ours and more are open than `count`. */
async function closeScratch(t, count, name = null) {
    const ours = (n) => n === name || /^live-[\w-]+\.indd$/.test(n ?? '');
    for (let now = await documents(t); now.count > count && ours(now.active); now = await documents(t)) {
        await t.call('close_document');
    }
}

export function scenarios(out) {
    return [
        ['pages', (t) => inNewDocument(t, async () => {
            await t.call('add_page', { position: 'AT_END' });
            let info = text(await t.call('get_document_info'));
            t.check('add_page', field(info, 'Pages') === '3', 'get_document_info goes from 2 to 3 pages');
            const page = text(await t.call('get_page_info', { pageIndex: 2 }));
            t.check('get_page_info', field(page, 'Size \\(mm\\)') === '210 x 297' && field(page, 'Index') === '2', 'page 3 reports index 2 and the document size, 210 x 297 mm');
            await t.call('delete_page', { pageIndex: 2 });
            info = text(await t.call('get_document_info'));
            t.check('delete_page', field(info, 'Pages') === '2', 'get_document_info goes back to 2 pages');
        })],

        ['frames and shapes', (t) => inNewDocument(t, async () => {
            await t.call('create_text_frame', { content: 'Live validation text', pageIndex: 0, x: 20, y: 20, width: 120, height: 40, fontSize: 18 });
            await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 80, width: 60, height: 30 });
            await t.call('create_ellipse', { pageIndex: 0, x: 100, y: 80, width: 40, height: 40 });
            const items = text(await t.call('list_page_items', { pageIndex: 0 }));
            t.check('list_page_items', /TextFrame/i.test(items) && /Rectangle/i.test(items) && /Oval/i.test(items), 'lists a text frame, a rectangle and an oval on page 1');
            const first = text(await t.call('get_document_stories', {}));
            t.check('create_text_frame', /TextFrame/i.test(items) && /Live validation text/.test(first), 'list_page_items shows a text frame and get_document_stories has its text');
            t.check('create_rectangle', /Rectangle/i.test(items), 'list_page_items shows the new rectangle');
            t.check('create_ellipse', /Oval/i.test(items), 'list_page_items shows the new oval');

            const before = text(await t.call('get_page_item_info', { pageIndex: 0, itemIndex: 1 }));
            await t.call('move_page_item', { pageIndex: 0, itemIndex: 1, x: 30, y: 150 });
            const after = text(await t.call('get_page_item_info', { pageIndex: 0, itemIndex: 1 }));
            t.check('get_page_item_info', before.length > 0 && /\d/.test(before), 'reports bounds for the item');
            t.check('move_page_item', after !== before && /150/.test(after), 'get_page_item_info shows the item at y 150 mm after the move');

            await t.call('edit_text_frame', { frameIndex: 0, pageIndex: 0, content: 'Edited by the live run' });
            const stories = text(await t.call('get_document_stories', {}));
            t.check('edit_text_frame', /Edited by the live run/.test(stories), 'get_document_stories contains the new text');
            t.check('get_document_stories', /Edited by the live run/.test(stories), 'lists the story with its text');

            await t.call('find_replace_text', { findText: 'Edited', replaceText: 'Changed' });
            const replaced = text(await t.call('get_document_stories', {}));
            t.check('find_replace_text', /Changed by the live run/.test(replaced) && !/Edited by/.test(replaced), 'get_document_stories shows "Changed" in place of "Edited"');

            const count = (s) => (s.match(/(TextFrame|Rectangle|Oval|Polygon|GraphicLine)/gi) ?? []).length;
            const n = count(text(await t.call('list_page_items', { pageIndex: 0 })));
            await t.call('delete_page_item', { pageIndex: 0, itemIndex: 2 });
            t.check('delete_page_item', count(text(await t.call('list_page_items', { pageIndex: 0 }))) === n - 1, 'list_page_items has one item fewer');
        })],

        ['styles and swatches', (t) => inNewDocument(t, async () => {
            await t.call('create_color_swatch', { name: 'Live Teal', colorType: 'PROCESS', colorSpace: 'RGB', red: 0, green: 128, blue: 128 });
            const swatches = text(await t.call('list_color_swatches'));
            t.check('create_color_swatch', /Live Teal/.test(swatches), 'list_color_swatches includes "Live Teal"');
            t.check('list_color_swatches', /Live Teal/.test(swatches) && /Black/.test(swatches), 'lists the default Black swatch and the new one');

            await t.call('create_paragraph_style', { name: 'Live Heading', fontSize: 24, spaceAfter: 4 });
            const styles = text(await t.call('list_styles', { styleType: 'PARAGRAPH' }));
            t.check('create_paragraph_style', /Live Heading/.test(styles), 'list_styles includes "Live Heading"');
            t.check('list_styles', /Live Heading/.test(styles), 'lists paragraph styles, the new one included');

            await t.call('create_text_frame', { content: 'Styled', pageIndex: 0, x: 20, y: 20, width: 100, height: 30 });
            await t.call('apply_paragraph_style', { styleName: 'Live Heading', frameIndex: 0, pageIndex: 0 });
            const frameId = Number(field(text(await t.call('get_page_item_info', { pageIndex: 0, itemIndex: 0 })), 'ID'));
            const formatting = JSON.stringify(await t.call('get_paragraph_formatting', { target: { frameIds: [frameId], wholeStory: true }, maxParagraphs: 5 }));
            t.check('apply_paragraph_style', /"style":"Live Heading"/.test(formatting), 'get_paragraph_formatting reports "Live Heading" as the frame\'s paragraph style');
            t.check('get_paragraph_formatting', /"style":"Live Heading"/.test(formatting) && /"text":"Styled/.test(formatting), 'reads the styled paragraph, its text and its style, by frame id');

            await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 80, width: 50, height: 50 });
            await t.call('apply_color', { itemIndex: 0, colorName: 'Live Teal', colorType: 'FILL', targetType: 'pageItem', pageIndex: 0 });
            const filled = text(await t.call('get_page_item_info', { pageIndex: 0, itemIndex: 0 }));
            t.check('apply_color', /Live Teal/.test(filled), 'get_page_item_info reports the "Live Teal" fill on the rectangle');
        })],

        ['save and export', (t) => inNewDocument(t, async () => {
            await t.call('create_text_frame', { content: 'Export check', pageIndex: 0, x: 20, y: 20, width: 100, height: 30 });
            const indd = join(out, `live-${Date.now()}.indd`);
            await t.call('save_document', { filePath: indd });
            t.check('save_document', existsSync(indd) && statSync(indd).size > 0 && field(text(await t.call('get_document_info')), 'Path') === indd,
                `the file exists at ${indd} and get_document_info reports it as the document's path`);
            const pdf = join(out, `live-${Date.now()}.pdf`);
            await t.call('export_pdf', { filePath: pdf, quality: 'SCREEN', pages: '1' });
            t.check('export_pdf', existsSync(pdf) && statSync(pdf).size > 1000, `a PDF of more than 1 KB exists at ${pdf}`);
        })],

        readScenario(inNewDocument),
        ...fileScenarios(inNewDocument, out, { documents, closeScratch }),

        ['close', async (t) => {
            // close_document is checked on its own document: its effect is that the document is gone.
            const created = text(await t.call('create_document', { pages: 1 }));
            const name = created.match(/Document name: (.+)/)?.[1]?.trim();
            await t.call('close_document');
            const s = (await t.call('indesign_status', { probe: true }))?.result;
            t.check('close_document', s?.indesign?.activeDocument !== name, `indesign_status no longer reports "${name}" as the active document`);
            t.check('indesign_status', s?.indesign?.reachable === true && /^\d+\.\d/.test(s?.indesign?.version ?? ''), 'probe: true reaches the running InDesign and reports its version');
        }],
    ];
}
