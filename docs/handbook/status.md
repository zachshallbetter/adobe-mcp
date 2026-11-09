# Status (8 November 2026)

| App | Package | On npm | On `main` | Tools | Atlas features | Scriptable | Claimed by tools |
|---|---|---|---|---:|---:|---:|---:|
| InDesign | adobe-mcp-indesign | 2.5.0 | 2.5.0 | 423 | 2,742 | 2,609 | 2,524 (92%) |
| Illustrator | adobe-mcp-illustrator | 0.9.1 | 0.9.0 | 308 | 2,540 | 1,951 | 1,562 (61%) |
| Photoshop | adobe-mcp-photoshop | 0.1.0 | 0.1.0 | 207 | 2,609 | 1,720 | 1,413 (54%) |
| After Effects | adobe-mcp-aftereffects | 0.1.0 | 0.1.0 | 164 | 3,198 | 2,595 | 2,555 (80%) |
| Premiere Pro | adobe-mcp-premiere | 0.1.0 | 0.1.0 | 96 | 925 | 494 | 413 (45%) |
| Suite | adobe-mcp-suite | 0.3.0 | 0.2.1 | 1,200 | — | — | — |
| Core | adobe-mcp-core | 0.2.0 | 0.2.0 | | | | |

Every app server and suite 0.3.0 are in the MCP Registry. Homebrew
(`zachshallbetter/tap/adobe-mcp`) installs suite 0.3.0.

## Release in progress: suite 0.3.1 ([#433](https://github.com/zachshallbetter/adobe-mcp/issues/433))

`main` and the published packages have diverged:

- Suite 0.3.0 was tagged on `release/adobe-mcp-suite-0.3.0` (c3c3900). That branch
  is not merged into `main`, and it also adds a 315-line generic `AGENTS.md`
  bootstrap contract. Merging it is the owner's decision.
- `release/adobe-mcp-suite-0.3.1` (17c7e94) builds on it, with the status-tool fix
  (#432) cherry-picked, Photoshop 0.1.1, Illustrator 0.9.1, After Effects 0.1.1 and
  suite 0.3.1 pinning them.
- Illustrator 0.9.1 published through the release workflow. The Photoshop and
  After Effects runs failed with `E404` on `npm publish`, because npm trusted
  publishing isn't set up for those two packages.

To finish, the owner sets up trusted publishing on npmjs.com (repository
`zachshallbetter/adobe-mcp`, workflow `release.yml`) for `adobe-mcp-photoshop` and
`adobe-mcp-aftereffects` and re-runs their two Release runs. Then push the
`adobe-mcp-suite@0.3.1` tag on 17c7e94 and move the tap formula to the 0.3.1 tarball.

"Scriptable" counts features whose atlas route is the object model, a menu command,
the Action Manager, the UXP API (Premiere Pro) or a recorded Action. Most of the gap between scriptable and
claimed is now features recorded as findings (no unattended route) plus the
deliberately unticketed items below. Every claimed feature is **statically tested**
(the audit checks each script against the object model); **none is validated**
against the real applications yet, because none was installed on the machine these
were built on.

## Planned work

Closed (label `epic` plus the app label):

- Illustrator: 19 epics, issues #19–#128.
- InDesign: 18 epics, 72 tickets, issues #152–#241.
- After Effects: 10 epics, 31 tickets, issues #266–#306.
- Photoshop: 10 epics, 30 tickets, issues #319–#358; round 2 epics #400 (painting
  and retouching) and #403 (filters, Camera Raw, adjustments).
- Premiere Pro (UXP round): 4 epics, 16 tickets, issues #372–#391.

## Deliberately not ticketed

- **Illustrator**: panel-opening menu items, swatch-library menu entries (the generic
  `execute_menu_command` runs them), tool-picker features with no scripted
  equivalent, help and account menus, cloud integrations.
- **Photoshop**: 433 features are still route `unknown` (down from 710); 3D features
  are route `none` (removed from Photoshop). About 300 newly routed features (mostly
  Action Manager) have no tool yet: material for the next round. The research leads
  and unreached ids were in the October work folder, which no longer exists; start
  again from the atlas's `unknown` routes.
- **After Effects**: 191 `unknown` (down from 331), mostly preferences without a
  documented key, aerender options, parametric meshes (26.3, not yet in the typings)
  and colour. The October research notes are gone with that work folder.
- **Premiere Pro**: every feature the UXP API reaches is claimed; the rest are
  ExtendScript/QE-only (route `dom`, with a "Not reachable through UXP" note), `none`
  or `unknown` (246).

## Unverified, to check first on a machine with the applications

Each PR lists what its author was unsure of; the biggest groups:

- **Photoshop Action Manager descriptors** taken from community recordings or
  memory: Camera Raw filter version keys (recorded from Camera Raw 18.2.2), Render
  Video (its dialog may still appear on 2023+), gradient and pattern fill keys,
  artboard background codes, stack modes, Blur Gallery, Neural Filters output.
- **InDesign menu-action ids** from the CS5-era list (panel commands especially).
- **After Effects** control names from help-page labels, Layer Styles group name,
  shape-operator menu values, render-setting names, Team Projects availability.
- **Premiere Pro UXP** semantics: `createMoveAction` offsets, `Keyframe.position`
  reference, `exportSequenceFrame` arguments, whether `lockedAccess` is synchronous.
- **Illustrator** PDF bleed side order (only uniform bleed is exposed).

## Open

- **Photoshop round 2, epic #407** (interface, type, transformations and the other
  domains): 19 tickets, #408–#426, all open, 107 features.
- **Premiere Pro plugin installer**, draft PR #434: installs the UXP plugin without
  the UXP Developer Tool. Unverified; needs Premiere Pro to test.

## Next

1. Finish the suite 0.3.1 release above.
2. Validation passes on real installs, starting with the lists above; the atlas has
   a `validated` state per feature for recording the results. Photoshop 2026 is
   installed on the owner's Mac; the other apps are not.
3. Photoshop round 2 (#407).
4. Finish researching the remaining `unknown` routes (Photoshop, After Effects,
   Premiere Pro preferences).
