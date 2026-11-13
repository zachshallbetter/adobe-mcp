/**
 * Read-only InDesign tools, each checked against a document whose contents the scenario
 * created: 2 pages, paragraph style "Read Style", swatch "Read Red", a text frame with a
 * five-word story grouped with a rectangle, an oval, and a 3 x 2 table on page 2.
 */
const text = (r) => (typeof r === 'string' ? r : typeof r?.result === 'string' ? r.result : JSON.stringify(r?.result ?? r));
const has = (s, ...parts) => parts.every((p) => (p instanceof RegExp ? p.test(s) : s.includes(p)));

/** Page items from list_page_items: [{ index, type, id }]. */
function items(listing) {
    return [...listing.matchAll(/Index: (\d+)\s+Type: (\w+)[\s\S]*?ID: (\d+)/g)].map((m) => ({ index: Number(m[1]), type: m[2], id: Number(m[3]) }));
}

export function readScenario(inNewDocument) {
    return ['read-only tools', (t) => inNewDocument(t, async (docName) => {
        await t.call('create_paragraph_style', { name: 'Read Style', fontSize: 14 });
        await t.call('create_color_swatch', { name: 'Read Red', colorType: 'PROCESS', colorSpace: 'RGB', red: 200, green: 0, blue: 0 });
        await t.call('create_text_frame', { content: 'Probe story with five words', pageIndex: 0, x: 20, y: 20, width: 120, height: 40 });
        await t.call('create_rectangle', { pageIndex: 0, x: 20, y: 80, width: 60, height: 30 });
        await t.call('create_ellipse', { pageIndex: 0, x: 100, y: 80, width: 40, height: 40 });
        await t.call('create_table', { rows: 3, columns: 2, pageIndex: 1 });
        const before = items(text(await t.call('list_page_items', { pageIndex: 0 })));
        const id = (type) => before.find((i) => i.type === type)?.id;
        const frameId = id('TextFrame'), ovalId = id('Oval');
        const toGroup = before.filter((i) => i.type !== 'Oval').map((i) => i.index);
        await t.call('create_group_from_items', { pageIndex: 0, itemIndices: toGroup });

        const read = async (tool, args = {}) => text(await t.call(tool, args));
        const expect = async (tool, args, ok, how) => t.check(tool, ok(await read(tool, args)), how);

        await expect('get_page_content_summary', { pageIndex: 0 }, (s) => has(s, 'Ovals: 1', 'Groups: 1'), 'page 1 has 1 oval and 1 group');
        await expect('help', {}, (s) => has(s, '423 tools'), 'reports all 423 tools');
        await expect('list_object_styles', {}, (s) => has(s, '[Basic Text Frame]', '[Basic Graphics Frame]'), 'lists the default object styles');
        await expect('get_document_elements', { elementType: 'all' }, (s) => has(s, 'Text Frames: 2', 'Rectangles: 1', 'Ovals: 1', 'Tables: 1', 'Groups: 1'), 'counts 2 text frames (one holds the table), 1 rectangle, 1 oval, 1 table, 1 group');
        await expect('get_document_styles', { styleType: 'PARAGRAPH' }, (s) => has(s, 'Read Style', '[Basic Paragraph]'), 'lists "Read Style" with the defaults');
        await expect('get_document_colors', { includeSwatches: true }, (s) => has(s, /Read Red \(PROCESS, RGB\)/), 'lists "Read Red" as a PROCESS RGB colour, by name');
        await expect('get_document_preferences', { preferenceType: 'ALL' }, (s) => has(s, 'pageWidth: 210', 'pageHeight: 297'), 'reports the 210 x 297 mm page size');
        await expect('get_document_layers', {}, (s) => has(s, 'Layer 1', 'Listed 1 of 1'), 'lists the one layer, Layer 1');
        await expect('get_document_hyperlinks', {}, (s) => has(s, 'Total Hyperlinks: 0'), 'reports no hyperlinks');
        await expect('get_document_sections', {}, (s) => has(s, 'Pages: 2', /Numbering: ARABIC/), 'one section of 2 pages, arabic numbering named');
        await expect('get_document_xml_structure', {}, (s) => has(s, '<Root>'), 'shows the Root element');
        await expect('get_document_grid_settings', {}, (s) => has(s, 'documentGridShown: false'), 'reports the grid hidden, as in a new document');
        await expect('get_document_layout_preferences', {}, (s) => has(s, 'enableAdjustLayout: false'), 'reports adjust layout off, as in a new document');
        await expect('validate_document', {}, (s) => has(s, 'Validation passed'), 'finds no issues in a document with no links, missing fonts or overset text');
        await expect('list_books', {}, (s) => has(s, /Total books: \d+/), 'reports the number of open books');
        await expect('view_document', {}, (s) => has(s, `Document: ${docName}`, 'Pages: 2', /Screen Mode: [A-Z_]+/), 'names the document, 2 pages, and the screen mode by name');
        await expect('get_session_info', {}, (s) => has(s, '"hasActiveDocument":true'), 'reports an active document');
        const groups = await read('list_groups', { pageIndex: 0 });
        t.check('list_groups', has(groups, 'Members: 2'), 'lists the group of 2 items');
        const groupIndex = Number(groups.match(/Group Index: (\d+)/)?.[1]);
        await expect('get_group_info', { pageIndex: 0, groupIndex }, (s) => has(s, 'TextFrame', 'Rectangle'), 'the group holds the text frame and the rectangle');
        await expect('list_master_spreads', {}, (s) => has(s, 'Name: A-Parent'), 'lists A-Parent');
        await expect('get_master_spread_info', { name: 'A-Parent' }, (s) => has(s, 'Name: A-Parent', /Page Color: [A-Z_]+/), 'describes A-Parent, page colour by name');
        await expect('list_spreads', {}, (s) => has(s, 'Total spreads: 2', 'Total pages: 2'), '2 spreads, 2 pages');
        await expect('get_spread_info', { spreadIndex: 0 }, (s) => has(s, 'Index: 0', /Page Transition: [A-Z_]+/, /side [A-Z_]+/), 'spread 0, page transition and page side by name');
        await expect('get_spread_content_summary', { spreadIndex: 0 }, (s) => has(s, 'Ovals: 1'), 'spread 0 holds the oval');
        await expect('list_layers', {}, (s) => has(s, 'Total layers: 1', /Color: [A-Z_]+/), 'one layer, its colour by name');
        await expect('get_transform_info', { target: { ids: [ovalId] } }, (s) => has(s, `${ovalId}`), 'reports the oval by id');
        await expect('get_text_frame_options', { target: { ids: [frameId] } }, (s) => has(s, `${frameId}`), 'reports the text frame by id');
        await expect('get_text_wrap', { target: { ids: [ovalId] } }, (s) => has(s, `"id":${ovalId}`, '"mode":"NONE"'), 'the oval has no text wrap');
        await expect('get_editorial_preferences', {}, (s) => has(s, '"userName"'), 'reports the user name and notes settings');
        await expect('get_story_statistics', { story: { frameId } }, (s) => has(s, /"words":5\b/), 'the story has 5 words');
        await expect('get_table_info', {}, (s) => has(s, '"count":1', '"rows":3', '"columns":2'), 'one table of 3 rows and 2 columns');
        await expect('get_path_info', { target: { ids: [ovalId] } }, (s) => has(s, '"x":100', '"width":40'), 'the oval at x 100 mm, 40 mm wide');
        await expect('get_item_effects', { target: { ids: [ovalId] } }, (s) => has(s, `"id":${ovalId}`), 'reports the oval by id');
        await expect('get_transparency_settings', {}, (s) => has(s, '"blendSpace"'), 'reports the blend space');
        await expect('list_xml_structure', {}, (s) => has(s, '"tag":"Root"'), 'the tree starts at Root');
        await expect('list_xml_tags', {}, (s) => has(s, '"name":"Root"'), 'lists the Root tag');
        await expect('get_long_document_info', {}, (s) => has(s, `"document":"${docName}"`), 'names the document');
        await expect('get_interactive_elements', {}, (s) => has(s, '"buttons":[]'), 'no buttons in the document');
        await expect('get_print_settings', {}, (s) => has(s, '"printer"'), 'reports the printer setting');
        await expect('get_trap_presets', {}, (s) => has(s, '[No Trap Preset]'), 'lists the default trap preset');
        await expect('get_preflight_info', {}, (s) => has(s, '[Basic]'), 'lists the [Basic] profile');
        await expect('get_inks', {}, (s) => has(s, 'Process Cyan', 'Process Black'), 'lists the process inks');
        await expect('get_package_report', {}, (s) => has(s, `"document":"${docName}"`, '"saved":false'), 'reports the unsaved document');
        await expect('get_color_settings', {}, (s) => has(s, '"enableColorManagement"'), 'reports colour management');
        await expect('get_object_options', { target: { ids: [ovalId] } }, (s) => has(s, `"id":${ovalId}`), 'reports the oval by id');
        await expect('get_flex_layout', { pageIndex: 0 }, (s) => has(s, '"containers":[]'), 'no flex containers');
        await expect('measure_between', { from: { pageIndex: 0, x: 0, y: 0 }, to: { pageIndex: 0, x: 30, y: 40 } }, (s) => has(s, '"distance":50'), 'a 30 x 40 mm offset measures 50 mm');
        await expect('list_document_links', {}, (s) => has(s, '"total":0'), 'no links');
        await expect('get_placed_graphic_options', { target: { ids: [ovalId] } }, (s) => has(s, `"id":${ovalId}`), 'reports the oval by id');
        await expect('get_indesign_preferences', { panes: ['units'] }, (s) => has(s, '"horizontalUnits"'), 'reports the ruler units');
        const metrics = await read('get_performance_metrics', { metrics: ['RESIDENT_MEMORY_SIZE'] });
        const rss = JSON.parse(metrics)?.metrics?.RESIDENT_MEMORY_SIZE?.value;
        t.check('get_performance_metrics', typeof rss === 'number' && rss > 1e8, 'resident memory is a single positive number above 100 MB');
        await expect('find_xml_rule_matches', { xpaths: ['//*'] }, (s) => has(s, '"total":1', '"tag":"Root"'), '//* matches the one Root element');

        t.skip('get_image_info', 'needs a placed image: the images scenario');
        t.skip('validate_xml_structure', 'needs a DTD loaded: the XML scenario');
        t.skip('preview_interactivity', 'opens the EPUB Interactivity Preview panel');
        t.skip('get_book_info', 'needs a book: the books scenario');
    })];
}
