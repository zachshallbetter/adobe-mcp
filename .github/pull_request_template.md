## What and why

<!-- The tool(s) affected and why. -->

## How it was verified

- [ ] `npm run check` passes
- [ ] `npm test` passes (unit, protocol, script audit, path confinement, tool reference check)
- [ ] New or changed tools follow the package's CONTRIBUTING.md (InDesign: definition, handler, entry in `TOOL_HANDLERS`, and annotations in `src/types/annotations.js`)
- [ ] `npm run docs:tools` run if any tool definition changed
- [ ] Tested against the running application (InDesign: `npm run test:integration -w packages/indesign`, or by hand): app and version ______ on ______
- [ ] The package's changelog updated

## Notes

<!-- Trade-offs, follow-ups, anything reviewers should know. -->
