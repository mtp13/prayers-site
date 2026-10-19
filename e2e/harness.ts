import { test as base, expect } from '@playwright/test';

// Every test fails on any console.error, uncaught page error or Content Security Policy violation, as in
// tic-tac-toe's harness. A test that expects a console error (e.g. the 404 page's own status) lists a pattern for it
// with test.use({ expectedConsoleErrors: [...] }).
export const test = base.extend<{ expectedConsoleErrors: RegExp[]; harness: void }>({
  expectedConsoleErrors: [[], { option: true }],
  harness: [
    async ({ page, expectedConsoleErrors }, use) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error' && !expectedConsoleErrors.some((pattern) => pattern.test(msg.text()))) {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => pageErrors.push(err.message));

      await page.addInitScript(() => {
        const record = (e: SecurityPolicyViolationEvent) => {
          const violations: string[] = JSON.parse(sessionStorage.getItem('__cspViolations') ?? '[]');
          violations.push(`${e.violatedDirective}: ${e.blockedURI || 'inline'}`);
          sessionStorage.setItem('__cspViolations', JSON.stringify(violations));
        };
        document.addEventListener('securitypolicyviolation', record);
      });

      await use();

      // Violations are kept in sessionStorage so ones from pages the test navigated away from still count.
      const cspViolations: string[] = await page
        .evaluate(() => JSON.parse(sessionStorage.getItem('__cspViolations') ?? '[]'))
        .catch(() => []);

      expect(consoleErrors, 'Expected zero console.error messages').toEqual([]);
      expect(pageErrors, 'Expected zero uncaught page errors').toEqual([]);
      expect(cspViolations, 'Expected zero CSP violations').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
