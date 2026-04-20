# 📘 Project Architecture & Guide: Fouad-GM-Assignment

This guide explains how the automation framework is structured, how the different layers interact, and the step-by-step flow of test execution.

---

## 🏗 High-Level Architecture

The project follows a **Layered Page Object Model (POM)** with a focus on decoupling test logic from browser interactions and data.

### The 4 Pillars of the Framework:
1.  **Framework Layer (`src/`)**: Contains the engine (BasePage, Page Objects, Components, Utils).
2.  **Configuration Layer (`root`)**: Controls the environment, environment variables, and Playwright settings.
3.  **Data Layer (`test-data/`)**: Keeps tests stateless by centralized management of inputs.
4.  **Test Layer (`e2e/`)**: Contains the executable scripts (specs).

---

## 📁 Step-by-Step Folder Walkthrough

### 1. Configuration Root
*   **`.env` & `.env.example`**: Stores secrets and environment-specific URLs.
*   **`playwright.config.ts`**: The "Brain" of the project. It defines browser projects (Chromium, Firefox), parallel workers, timeouts, and reporters.
*   **`tsconfig.json`**: Configures TypeScript and defines **Path Aliases** (e.g., `@pages/*`) to avoid long relative paths like `../../../../src/pages`.

### 2. `src/config/`
*   **`env.config.ts`**: A wrapper that reads `.env` variables and provides a type-safe `ENV` object. This ensures that if a variable is missing, the framework catches it early.

### 3. `src/utils/` (Cross-cutting Concerns)
*   **`logger.ts`**: Every action on the UI is logged with a timestamp. This is critical for debugging CI failures.
*   **`api-helper.ts`**: Simplifies working with Playwright's `APIRequestContext`. It handles token generation and Bearer authentication headers automatically.
*   **`schema-validator.ts`**: Uses the **AJV** library to compare API responses against expected JSON schemas, ensuring the backend contract hasn't changed.

### 4. `src/pages/` & `src/components/` (The Core POM)
*   **`base.page.ts`**: The parent of all pages. It contains common logic like `removeAdsAndFooter()` (essential for DemoQA due to overlaying ads) and screenshot captures.
*   **Specific Pages (e.g., `web-tables.page.ts`)**: These classes contain **Locators** and **Actions**. They *never* perform assertions; they only interact with the page.
*   **`navigation.component.ts`**: A reusable component used by multiple pages to handle the complex accordion menu on the left side of DemoQA.

### 5. `src/fixtures/` (The "Glue")
*   **`ui.fixture.ts`**: Instead of manually creating `new WebTablesPage(page)` in every test, Playwright **Fixtures** handle this. When a test asks for `webTablesPage`, the fixture automatically:
    1.  Navigates to the URL.
    2.  Removes ads.
    3.  Returns the instance.
*   **`api.fixture.ts`**: Automatically creates a fresh user and generates a token before an API test, and **deletes the user** immediately after (teardown).

### 6. `e2e/` (The Tests)
*   Tests are clean and readable. They focus on **Scenarios** and **Assertions**.
*   They use the data provided by `test-data/` files.

---

## 🔄 How the Project Works (The Execution Flow)

### Scenario: Running a UI Test (e.g., Web Tables)
1.  **Initialization**: Playwright reads `playwright.config.ts`.
2.  **Fixture Setup**: It sees the test requires `webTablesPage`. It goes to `src/fixtures/ui.fixture.ts`.
3.  **Execution**: 
    *   The fixture creates the `WebTablesPage` object.
    *   It calls `goto()` and `removeAdsAndFooter()` (from `BasePage`).
4.  **Test Run**: The test script calls `webTablesPage.addRecord(data)`.
5.  **Logging**: The `Logger` prints `[STEP] Clicking Add button` to the console.
6.  **Assertion**: The test performs `expect(cell).toBeVisible()`.
7.  **Teardown**: On failure, Playwright takes a screenshot and records a trace (configured in `playwright.config.ts`).

### Scenario: Running an API Test
1.  **Auth**: `api.fixture.ts` calls `apiPost` to create a user and `generateToken`.
2.  **Context**: It provides a `Bearer` token to the request headers.
3.  **Request**: The test sends a POST to `/BookStore/v1/Books`.
4.  **Validation**: The test uses `validateSchema` from `utils/schema-validator.ts` to check if the response structure is correct.
5.  **Cleanup**: The fixture automatically sends a DELETE request to remove the test user, keeping the DemoQA database clean.

---

## 🚀 Why this is "Production Ready"
*   **Scalability**: Adding a new page is as simple as extending `BasePage` and adding it to the fixture.
*   **Reliability**: Ad-cleaning logic ensures tests don't fail due to flaky UI elements.
*   **Maintainability**: If a locator changes, you update it in **one** file (the Page Object), and all tests are fixed.
*   **Visibility**: Detailed HTML reports and logs provide clear insights into why a test failed.
