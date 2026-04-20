# Fouad-GM-Assignment: Playwright + TypeScript Automation Framework

## Overview
Production-ready QA automation project targeting https://demoqa.com/ using Playwright with TypeScript, Page Object Model, covering both UI and API tests.

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Playwright Test
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
- **Reporting**: Playwright HTML Reporter + Custom logging
- **API Testing**: Playwright APIRequestContext

## Proposed Project Structure

```
Fouad-GM-Assignment/
├── playwright.config.ts          # Main Playwright configuration
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies & scripts
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── README.md                     # Professional documentation
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # Base page with common methods
│   │   ├── web-tables.page.ts    # Web Tables page (TC01)
│   │   ├── broken-images.page.ts # Broken Images page (TC02)
│   │   ├── practice-form.page.ts # Practice Form page (TC03)
│   │   ├── progress-bar.page.ts  # Progress Bar page (TC04)
│   │   ├── tool-tips.page.ts     # Tooltips page (TC05)
│   │   └── droppable.page.ts     # Drag & Drop page (TC06)
│   │
│   ├── components/               # Reusable UI components
│   │   ├── navigation.component.ts
│   │   └── modal.component.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.ts             # Logging utility
│   │   ├── api-helper.ts         # API request helpers
│   │   ├── file-helper.ts        # File upload helpers
│   │   └── schema-validator.ts   # JSON schema validation
│   │
│   ├── fixtures/                 # Custom Playwright fixtures
│   │   ├── ui.fixture.ts         # UI test fixtures
│   │   └── api.fixture.ts        # API test fixtures
│   │
│   └── config/                   # Configuration management
│       └── env.config.ts         # Environment-based config
│
├── e2e/
│   ├── ui/                       # UI test specs
│   │   ├── web-tables.spec.ts    # TC01 A & B
│   │   ├── broken-images.spec.ts # TC02
│   │   ├── practice-form.spec.ts # TC03
│   │   ├── progress-bar.spec.ts  # TC04
│   │   ├── tool-tips.spec.ts     # TC05
│   │   └── drag-and-drop.spec.ts # TC06
│   │
│   └── api/                      # API test specs
│       ├── create-user.spec.ts   # Create user tests
│       ├── books.spec.ts         # Add/Delete book tests
│       └── e2e-flow.spec.ts      # Full happy path flow
│
├── test-data/                    # Test data files
│   ├── ui/
│   │   ├── web-tables.data.ts
│   │   ├── practice-form.data.ts
│   │   └── upload-sample.txt
│   └── api/
│       └── api-test.data.ts
│
└── reports/                      # Test reports output (gitignored)
```

## UI Test Cases

| TC   | Scenario | Target Page | Key Actions |
|------|----------|-------------|-------------|
| TC01A | Add Web Table Record | /webtables | Add row, verify in table |
| TC01B | Edit Web Table Record | /webtables | Edit Aldren row → Gerimedica BV, verify |
| TC02 | Broken Image Validation | /broken | Check image HTTP status codes |
| TC03 | Practice Form | /automation-practice-form | Fill all fields + file upload, verify modal |
| TC04 | Progress Bar | /progress-bar | Start, wait 100%, assert |
| TC05 | Tooltip | /tool-tips | Hover, verify tooltip text |
| TC06 | Drag and Drop | /droppable | Drag to target, verify text |

## API Test Cases

| Endpoint | Happy Path | Negative Path |
|----------|-----------|---------------|
| POST /Account/v1/User | Create user successfully | Duplicate user / weak password |
| POST /BookStore/v1/Books | Add books with valid token | Add with invalid ISBN |
| DELETE /BookStore/v1/Book | Delete book successfully | Delete non-existent book |

## Verification Plan

### Automated Tests
- `npx playwright test --project=ui` — Run all UI tests
- `npx playwright test --project=api` — Run all API tests
- `npx playwright test` — Run everything

### Manual Verification
- Verify HTML report generation in `reports/` directory
- Verify parallel execution works correctly
