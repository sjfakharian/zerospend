const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("Navigating to dashboard...");
    await page.goto('http://127.0.0.1:20131');
    await page.waitForLoadState('networkidle');

    console.log("Setting demo mode...");
    // The console starts in "LOADING" then goes to "demo/live". Wait for it.
    await page.waitForSelector('#mode');

    // Check if it's already in demo mode
    const modeText = await page.innerText('#mode');
    if (!modeText.includes('DEMO')) {
      await page.click('#mode');
      await page.waitForTimeout(500); // Give it a moment to fetch demo data
    }

    console.log("Navigating to Models & Routing page...");
    await page.goto('http://127.0.0.1:20131/#models');
    await page.waitForSelector('.sortable-th');

    console.log("Checking sortable-th elements...");
    const thElements = await page.locator('.sortable-th').all();
    console.log(`Found ${thElements.length} sortable headers.`);

    if (thElements.length > 0) {
      const tabindex = await thElements[0].getAttribute('tabindex');
      const role = await thElements[0].getAttribute('role');
      console.log(`First TH - tabindex: ${tabindex}, role: ${role}`);

      // Press tab to focus the first element (may need to click body first to set initial focus)
      await page.click('body');
      await page.keyboard.press('Tab');
      // Tab a few times to get into the table
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      console.log("Taking screenshot...");
      fs.mkdirSync('/home/jules/verification', { recursive: true });
      await page.screenshot({ path: '/home/jules/verification/a11y_verification.png', fullPage: true });
      console.log("Screenshot saved.");
    } else {
      console.log("No sortable headers found.");
    }
  } catch (err) {
    console.error("Playwright test failed:", err);
  } finally {
    await browser.close();
  }
})();
