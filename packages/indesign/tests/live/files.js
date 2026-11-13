/**
 * InDesign scenarios that work with files: placed images and links, text import, XML with
 * a DTD, exports and books. The files come from scripts/live-fixtures.mjs
 * (~/Documents/adobe-mcp-validation/fixtures); they are only read, never changed. Anything
 * a scenario writes goes to the run's out folder under a live- name.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const FIXTURES = join(homedir(), 'Documents', 'adobe-mcp-validation', 'fixtures');
const fx = (...p) => join(FIXTURES, ...p);
const text = (r) => (typeof r === 'string' ? r : typeof r?.result === 'string' ? r.result : JSON.stringify(r?.result ?? r));
const has = (s, ...parts) => parts.every((p) => (p instanceof RegExp ? p.test(s) : s.includes(p)));
const sized = (path, min) => existsSync(path) && statSync(path).size > min;
const stamp = () => `${Date.now()}`;

/** The id of the newest page item of a type on page 1, from list_page_items. */
async function newestId(t, type) {
    const listing = text(await t.call('list_page_items', { pageIndex: 0 }));
    return Number([...listing.matchAll(/Type: (\w+)[\s\S]*?ID: (\d+)/g)].find((m) => m[1] === type)?.[2]);
}

export function fileScenarios(inNewDocument, out, { documents, closeScratch }) {
    if (!existsSync(fx('images', 'gradient-rgb.jpg'))) {
        return [['files (fixtures missing)', async (t) => { t.skip('place_image', 'run node scripts/live-fixtures.mjs first'); }]];
    }
    return [
        ['placed images and links', (t) => inNewDocument(t, async () => {
            await t.call('place_image', { filePath: fx('images', 'gradient-rgb.jpg'), pageIndex: 0, x: 20, y: 20, width: 90, height: 60, linkImage: true, fitMode: 'PROPORTIONALLY' });
            let links = text(await t.call('list_document_links', {}));
            t.check('place_image', has(links, '"total":1', 'gradient-rgb.jpg'), 'list_document_links shows one link, to gradient-rgb.jpg');
            const image = text(await t.call('get_image_info', { pageIndex: 0, itemIndex: 0 }));
            t.check('get_image_info', has(image, 'gradient-rgb.jpg'), 'names the placed file');

            await t.call('place_graphic_with_options', { filePath: fx('images', 'gradient.pdf'), pageIndex: 0, x: 120, y: 20 });
            links = text(await t.call('list_document_links', {}));
            t.check('place_graphic_with_options', has(links, '"total":2', 'gradient.pdf'), 'list_document_links adds the PDF');
            t.check('list_document_links', has(links, '"total":2', 'gradient-rgb.jpg', 'gradient.pdf'), 'lists both links by name');

            const pdfId = await newestId(t, 'Rectangle');
            const options = text(await t.call('get_placed_graphic_options', { target: { ids: [pdfId] } }));
            t.check('get_placed_graphic_options', has(options, `"id":${pdfId}`, 'gradient.pdf'), 'reports the frame holding the placed PDF');

            await t.call('relink_document_links', { links: { names: ['gradient-rgb.jpg'] }, mode: 'file', filePath: fx('images', 'gradient-cmyk.jpg') });
            links = text(await t.call('list_document_links', {}));
            t.check('relink_document_links', has(links, 'gradient-cmyk.jpg') && !has(links, 'gradient-rgb.jpg'), 'the JPEG link now points at gradient-cmyk.jpg');

            await t.call('run_document_link_action', { action: 'embed', links: { names: ['gradient.pdf'] } });
            links = text(await t.call('list_document_links', {}));
            t.check('run_document_link_action', /gradient\.pdf[\s\S]{0,400}EMBEDDED|EMBEDDED[\s\S]{0,400}gradient\.pdf/i.test(links), 'list_document_links reports gradient.pdf as embedded');

            await t.call('place_file_on_page', { pageIndex: 1, filePath: fx('images', 'gradient-rgba.png'), x: 20, y: 20 });
            const page2 = text(await t.call('get_page_content_summary', { pageIndex: 1 }));
            t.check('place_file_on_page', has(page2, /Placed Graphics: 1/), 'page 2 now holds one placed graphic');
        })],

        ['text import', (t) => inNewDocument(t, async () => {
            await t.call('place_file_on_page', { pageIndex: 0, filePath: fx('text', 'story.txt'), x: 20, y: 20 });
            let stories = text(await t.call('get_document_stories', {}));
            t.check('get_document_stories', has(stories, 'Fixture story'), 'lists the placed story by its text');

            await t.call('place_with_import_options', { filePath: fx('text', 'story.docx'), pageIndex: 1, x: 20, y: 20, word: { useTypographersQuotes: true } });
            stories = text(await t.call('get_document_stories', {}));
            t.check('place_with_import_options', (stories.match(/Fixture story/g) ?? []).length >= 2, 'a second story with the Word file\'s text');

            const frameId = await newestId(t, 'TextFrame');
            await t.call('fill_with_placeholder_text', { target: { ids: [frameId] } });
            const stats = text(await t.call('get_story_statistics', { story: { frameId } }));
            t.check('fill_with_placeholder_text', /"words":(\d+)/.test(stats) && Number(stats.match(/"words":(\d+)/)[1]) > 0, 'the frame\'s story has words');
        })],

        ['xml', (t) => inNewDocument(t, async () => {
            await t.call('manage_xml_dtd', { action: 'load', filePath: fx('xml', 'catalog.dtd') });
            const dtd = text(await t.call('manage_xml_dtd', { action: 'view' }));
            t.check('manage_xml_dtd', has(dtd, 'catalog', 'product'), 'view shows the loaded DTD\'s catalog and product elements');
            await t.call('import_xml', { filePath: fx('xml', 'catalog.xml') });
            const tree = text(await t.call('list_xml_structure', {}));
            t.check('import_xml', has(tree, 'product', 'Notebook'), 'list_xml_structure shows the imported products');
            const valid = text(await t.call('validate_xml_structure', {}));
            t.check('validate_xml_structure', has(valid, /"errors":\s*\[\]|"valid":true|no errors/i), 'the imported catalog is valid against its DTD');
            const xmlOut = join(out, `live-${stamp()}.xml`);
            await t.call('export_document_xml', { filePath: xmlOut });
            t.check('export_document_xml', sized(xmlOut, 50), `an XML file exists at ${xmlOut}`);
        })],

        ['exports', (t) => inNewDocument(t, async () => {
            await t.call('create_text_frame', { content: 'Export fixture text', pageIndex: 0, x: 20, y: 20, width: 120, height: 30 });
            await t.call('place_image', { filePath: fx('images', 'gradient-rgb.jpg'), pageIndex: 0, x: 20, y: 60, width: 90, height: 60 });
            const jpgDir = join(out, `live-${stamp()}-jpg`);
            await t.call('export_images', { outputPath: jpgDir, format: 'JPEG', resolution: 72, pages: '1' });
            t.check('export_images', existsSync(jpgDir) && readdirSync(jpgDir).some((f) => /\.jpe?g$/i.test(f)), `a JPEG of page 1 is in ${jpgDir}`);
            const png = join(out, `live-${stamp()}.png`);
            await t.call('export_image_file', { filePath: png, format: 'png', pages: '1' });
            t.check('export_image_file', sized(png, 1000), `a PNG of more than 1 KB exists at ${png}`);
            const epub = join(out, `live-${stamp()}.epub`);
            await t.call('export_epub', { filePath: epub, layout: 'REFLOWABLE' });
            t.check('export_epub', sized(epub, 1000), `an EPUB exists at ${epub}`);
            const indd = join(out, `live-${stamp()}.indd`);
            await t.call('save_document', { filePath: indd });
            const pkg = join(out, `live-${stamp()}-package`);
            await t.call('package_document', { outputPath: pkg, includeLinks: true, includeFonts: false, createReport: false });
            t.check('package_document', existsSync(pkg) && readdirSync(pkg).some((f) => f.endsWith('.indd')) && existsSync(join(pkg, 'Links')), `the package in ${pkg} has the document and a Links folder`);
        })],

        ['books', async (t) => {
            const before = (await documents(t)).count;
            try { await books(t); } finally { await closeScratch(t, before); }
        }],
    ];

    async function books(t) {
        const chapters = [];
        for (const n of [1, 2]) {
            await inNewDocument(t, async () => {
                await t.call('create_text_frame', { content: `Chapter ${n}`, pageIndex: 0, x: 20, y: 20, width: 100, height: 30 });
                const path = join(out, `live-${stamp()}-ch${n}.indd`);
                await t.call('save_document', { filePath: path });
                chapters.push(path);
            });
        }
        const book = join(out, `live-${stamp()}.indb`);
        await t.call('create_book', { filePath: book });
        t.check('create_book', existsSync(book), `the book file exists at ${book}`);
        for (const c of chapters) await t.call('add_document_to_book', { bookPath: book, documentPath: c });
        const info = text(await t.call('get_book_info', { bookPath: book }));
        t.check('add_document_to_book', has(info, 'ch1.indd', 'ch2.indd'), 'get_book_info lists both chapters');
        t.check('get_book_info', has(info, 'ch1.indd', 'ch2.indd'), 'lists the two chapters');
        const books = text(await t.call('list_books', {}));
        t.check('list_books', has(books, book.split('/').pop()), 'lists the open book');
        await t.call('repaginate_book', { bookPath: book });
        const after = text(await t.call('get_book_info', { bookPath: book }));
        t.check('repaginate_book', has(after, 'ch2.indd'), 'the book still lists both chapters after repagination');
        const pdf = join(out, `live-${stamp()}-book.pdf`);
        await t.call('export_book', { bookPath: book, format: 'PDF', outputPath: pdf });
        t.check('export_book', sized(pdf, 1000), `the book exported to a PDF at ${pdf}`);
        await t.call('manage_book_contents', { bookPath: book, action: 'close' });
        const closed = text(await t.call('list_books', {}));
        t.check('manage_book_contents', !has(closed, book.split('/').pop()), 'list_books no longer shows the book after close');
    }
}
