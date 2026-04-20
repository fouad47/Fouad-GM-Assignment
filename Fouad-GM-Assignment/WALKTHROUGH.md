# Walkthrough: Fouad-GM-Assignment

## Summary

Built a complete, production-ready Playwright + TypeScript automation framework at `d:\Work_Assignments\Fouad-GM-Assignment\` targeting [DemoQA](https://demoqa.com/) with both UI and API test coverage.

## What Was Built

### Architecture
```
Page Object Model (POM) with clean layered architecture:
  BasePage → Page Objects → Components → Utilities → Fixtures → Tests
```

### Files Created (28 total)

#### Configuration (5 files)
| File | Purpose |
|------|---------|
| `package.json` | Dependencies & 8 npm scripts |
| `tsconfig.json` | TypeScript strict mode + DOM libs + path aliases |
| `playwright.config.ts` | 3 projects (ui-chromium, ui-firefox, api), parallel, HTML+JSON reporters |
| `.env.example` / `.env` | Environment-based configuration |
| `.gitignore` | Ignores node_modules, reports, .env |

#### Source Framework (11 files)
| File | Purpose |
|------|---------|
| `src/pages/base.page.ts` | Abstract base with navigation, ad removal, scrolling |
| `src/pages/web-tables.page.ts` | CRUD operations for Web Tables |
| `src/pages/broken-images.page.ts` | HTTP status-based image validation |
| `src/pages/practice-form.page.ts` | Full form filling + file upload + modal validation |
| `src/pages/progress-bar.page.ts` | Start/stop/wait with polling |
| `src/pages/tool-tips.page.ts` | Hover + tooltip text extraction |
| `src/pages/droppable.page.ts` | Drag-and-drop actions |
| `src/components/navigation.component.ts` | Left sidebar menu navigation |
| `src/components/modal.component.ts` | Modal dialog lifecycle |
| `src/fixtures/ui.fixture.ts` | 6 auto-navigating page object fixtures |
| `src/fixtures/api.fixture.ts` | Authenticated request with auto-cleanup |

#### Utilities (4 files)
| File | Purpose |
|------|---------|
| `src/utils/logger.ts` | Timestamped, leveled, contextual logging |
| `src/utils/api-helper.ts` | GET/POST/DELETE wrappers + token generation |
| `src/utils/file-helper.ts` | Test data paths + temp file management |
| `src/utils/schema-validator.ts` | AJV-based JSON schema validation |
| `src/config/env.config.ts` | Centralized environment config loader |

#### Test Specs (9 files → 35 tests)
| File | Tests | Coverage |
|------|-------|----------|
| `e2e/ui/web-tables.spec.ts` | 2 | TC01-A: Add record, TC01-B: Edit Alden → Gerimedica BV |
| `e2e/ui/broken-images.spec.ts` | 2 | TC02: Broken image HTTP status, valid image check |
| `e2e/ui/practice-form.spec.ts` | 2 | TC03: Full form + file upload, file name validation |
| `e2e/ui/progress-bar.spec.ts` | 2 | TC04: 100% completion, reset validation |
| `e2e/ui/tool-tips.spec.ts` | 3 | TC05: Button tooltip, text field tooltip, disappearance |
| `e2e/ui/drag-and-drop.spec.ts` | 2 | TC06: Drag success text, drag source text |
| `e2e/api/create-user.spec.ts` | 3 | Happy: 201, Negative: duplicate 406, weak password 400 |
| `e2e/api/books.spec.ts` | 5 | Add book 201, invalid ISBN 400, no auth 401, delete 204, delete non-existent 400 |
| `e2e/api/e2e-flow.spec.ts` | 1 | Full lifecycle: create→token→add→verify→delete→cleanup |

#### Test Data (4 files)
| File | Purpose |
|------|---------|
| `test-data/ui/web-tables.data.ts` | Records for add/edit tests |
| `test-data/ui/practice-form.data.ts` | Form data + expected modal values |
| `test-data/ui/upload-sample.txt` | Sample file for upload tests |
| `test-data/api/api-test.data.ts` | Endpoints, ISBNs, payloads, error messages |

#### Documentation (1 file)
| File | Purpose |
|------|---------|
| `README.md` | Full docs: setup, commands, structure, strategy, reporting |

## Verification Results

### TypeScript Compilation
```
✅ npx tsc --noEmit → 0 errors
```

### Test Discovery
```
✅ npx playwright test --list → 35 tests in 9 files
   - 13 UI tests × 2 browsers (Chromium + Firefox) = 26 UI runs
   - 9 API tests
```

### Run Commands
```bash
npm test              # All tests
npm run test:ui       # UI tests (Chromium)
npm run test:api      # API tests
npm run test:headed   # UI tests with visible browser
npm run report        # Open HTML report
```

## Key Design Decisions

1. **Fixtures over setup/teardown hooks** — Page objects auto-navigate via Playwright fixtures, keeping tests clean
2. **Ad removal in BasePage** — DemoQA has overlay ads that block element clicks; removed automatically on every page navigation
3. **API user lifecycle in fixture** — Each API test gets a fresh user (created in fixture setup, deleted in teardown) for complete test isolation
4. **Polling for progress bar** — Uses Playwright's `expect().toPass()` with 500ms intervals instead of fragile `waitForTimeout`
5. **Schema validation via AJV** — API response shapes validated against pre-defined JSON schemas for contract testing
