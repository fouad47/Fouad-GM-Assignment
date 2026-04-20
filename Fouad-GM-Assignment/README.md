# 🚀 Fouad-GM-Assignment

**Production-Ready Playwright + TypeScript Automation Framework**

A comprehensive end-to-end test automation framework targeting [DemoQA](https://demoqa.com/), built with Playwright and TypeScript using the Page Object Model (POM) design pattern. Covers both **UI** and **API** testing in a single, scalable repository.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup Steps](#-setup-steps)
- [Project Structure](#-project-structure)
- [Test Strategy](#-test-strategy)
- [Running Tests](#-running-tests)
- [Reporting](#-reporting)
- [Configuration](#-configuration)
- [Best Practices](#-best-practices)

---

## 🎯 Project Overview

This framework automates both UI and API testing for [DemoQA](https://demoqa.com/):

**UI Tests (6 Test Suites)**
| TC | Feature | Description |
|----|---------|-------------|
| TC01-A | Web Tables | Add new record and validate in table |
| TC01-B | Web Tables | Edit Alden row → Gerimedica BV |
| TC02 | Broken Images | Validate broken images via HTTP status |
| TC03 | Practice Form | Full form submission with file upload |
| TC04 | Progress Bar | Start and wait for 100% completion |
| TC05 | Tooltips | Hover and validate tooltip text |
| TC06 | Drag & Drop | Drag to target and validate success |

**API Tests (3 Test Suites)**
| Suite | Endpoints | Coverage |
|-------|-----------|----------|
| Create User | POST /Account/v1/User | Happy + Negative (duplicate, weak password) |
| Books | POST/DELETE /BookStore/v1/Books | Happy + Negative (invalid ISBN, unauthorized) |
| E2E Flow | Full lifecycle | Create → Token → Add Books → Delete → Cleanup |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | Browser automation & API testing |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [AJV](https://ajv.js.org/) | JSON schema validation |
| [dotenv](https://github.com/motdotla/dotenv) | Environment configuration |

---

## 📦 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git** (optional, for version control)

---

## ⚙ Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Fouad-GM-Assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium firefox
```

### 4. Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your settings (optional — defaults work out of the box)
```

### 5. Verify Setup

```bash
# Type-check the project
npm run lint
```

---

## 📁 Project Structure

```
Fouad-GM-Assignment/
├── playwright.config.ts          # Playwright configuration (3 projects)
├── tsconfig.json                 # TypeScript configuration with path aliases
├── package.json                  # Dependencies & npm scripts
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
│
├── src/                          # Source code (framework layer)
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # Abstract base page with shared methods
│   │   ├── web-tables.page.ts    # Web Tables — CRUD operations
│   │   ├── broken-images.page.ts # Broken Images — HTTP image validation
│   │   ├── practice-form.page.ts # Practice Form — full form interaction
│   │   ├── progress-bar.page.ts  # Progress Bar — start/stop/wait
│   │   ├── tool-tips.page.ts     # Tooltips — hover & validate
│   │   └── droppable.page.ts     # Drag & Drop — drag to target
│   │
│   ├── components/               # Reusable UI components
│   │   ├── navigation.component.ts  # Left sidebar menu navigation
│   │   └── modal.component.ts       # Modal dialog interactions
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.ts             # Structured logging with levels
│   │   ├── api-helper.ts         # API request wrappers + auth
│   │   ├── file-helper.ts        # File operations for uploads
│   │   └── schema-validator.ts   # JSON schema validation (AJV)
│   │
│   ├── fixtures/                 # Custom Playwright test fixtures
│   │   ├── ui.fixture.ts         # UI fixtures — auto-navigating page objects
│   │   └── api.fixture.ts        # API fixtures — user creation + auth token
│   │
│   └── config/                   # Configuration management
│       └── env.config.ts         # Environment-based config loader
│
├── e2e/                          # Test specifications
│   ├── ui/                       # UI test specs
│   │   ├── web-tables.spec.ts    # TC01 A & B
│   │   ├── broken-images.spec.ts # TC02
│   │   ├── practice-form.spec.ts # TC03
│   │   ├── progress-bar.spec.ts  # TC04
│   │   ├── tool-tips.spec.ts     # TC05
│   │   └── drag-and-drop.spec.ts # TC06
│   │
│   └── api/                      # API test specs
│       ├── create-user.spec.ts   # Create user (happy + negative)
│       ├── books.spec.ts         # Add/Delete books (happy + negative)
│       └── e2e-flow.spec.ts      # Full API lifecycle test
│
├── test-data/                    # Test data management
│   ├── ui/
│   │   ├── web-tables.data.ts    # Web tables test records
│   │   ├── practice-form.data.ts # Form data + expected values
│   │   └── upload-sample.txt     # File for upload tests
│   └── api/
│       └── api-test.data.ts      # API endpoints, payloads, schemas
│
└── reports/                      # Test reports (gitignored)
    ├── html/                     # Playwright HTML report
    └── results.json              # JSON report
```

---

## 🧪 Test Strategy

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Page Object Model** | Each page has a dedicated class with encapsulated locators and methods |
| **Fixtures** | Custom Playwright fixtures for automatic setup/teardown |
| **Data-Driven** | Test data separated from test logic in `test-data/` |
| **Clean Architecture** | Base page → Page objects → Components → Utils |
| **Parallel Execution** | Tests run in parallel across workers |
| **Environment Config** | All settings in `.env` — no hardcoded values |
| **Schema Validation** | API responses validated against JSON schemas |
| **Automatic Cleanup** | API fixtures clean up test users after each test |

### Test Isolation
- Each UI test gets a fresh browser context
- Each API test creates and cleans up its own user
- No shared state between tests

---

## ▶ Running Tests

### Run All Tests (UI + API)
```bash
npm test
```

### Run UI Tests Only
```bash
# Chromium (default)
npm run test:ui

# Firefox
npm run test:ui:firefox

# Headed mode (watch the browser)
npm run test:headed
```

### Run API Tests Only
```bash
npm run test:api
```

### Run a Specific Test File
```bash
npx playwright test e2e/ui/web-tables.spec.ts
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run with Specific Tags
```bash
npx playwright test --grep "TC01"
```

---

## 📊 Reporting

### HTML Report
After test execution, open the interactive HTML report:
```bash
npm run report
```
Report is saved to `reports/html/index.html`.

### JSON Report
Machine-readable results are saved to `reports/results.json`.

### Artifacts on Failure
- **Screenshots**: Captured automatically on test failure
- **Videos**: Recorded on first retry
- **Traces**: Playwright traces captured on first retry

View a trace:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://demoqa.com` | Application base URL |
| `API_BASE_URL` | `https://demoqa.com` | API base URL |
| `HEADLESS` | `true` | Run browsers in headless mode |
| `DEFAULT_TIMEOUT` | `30000` | Default test timeout (ms) |
| `EXPECT_TIMEOUT` | `10000` | Assertion timeout (ms) |
| `RETRY_COUNT` | `1` | Number of retry attempts |
| `WORKERS` | `4` | Parallel worker count |
| `API_USERNAME` | auto-generated | API test username |
| `API_PASSWORD` | `Test@12345678` | API test password |

### Playwright Projects

| Project | Description | Browser |
|---------|-------------|---------|
| `ui-chromium` | UI tests on Chromium | Desktop Chrome |
| `ui-firefox` | UI tests on Firefox | Desktop Firefox |
| `api` | API tests | No browser needed |

---

## ✅ Best Practices

- **No hardcoded values** — All data in test-data files and .env
- **Structured logging** — Every action is logged with timestamps
- **Automatic ad removal** — DemoQA ads/overlays removed before interactions
- **Schema validation** — API responses validated against defined schemas
- **Test isolation** — Each test is independent with its own setup/teardown
- **Retry logic** — Configurable retries with trace capture
- **Clean naming** — Descriptive test names following `TC##: Should...` pattern
- **TypeScript strict mode** — Full type safety across the codebase

---

## 👤 Author

**Fouad** — QA Automation Engineer

---

## 📄 License

MIT
