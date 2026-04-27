import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  // Also dump the body innerHTML just to see if it's rendered anything
  const body = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY LENGTH:', body.length);
  
  await browser.close();
})();
