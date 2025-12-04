// // import puppeteer

// const puppeteer = require("puppeteer");

// async function go() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//   });

//   //   open a new tab
//   const page = await browser.newPage();

//   //   go to the site to be tested

//   await page.goto("https://mycar-collection-f21.web.app/index_.html");

//   //   click on the sign-in button
//   await page.click("#signinbtn");

//   // provide email and password to sign in ... type(HTML_ID, value)

//   await page.type("#email_", "test1234555@gmail.com");
//   await page.type("#password_", "test1234555@gmail.com");

//   // click the submit button
//   await page.click("#signin_form > div:nth-child(3) > div > button");

//   //   take a screenshot
//   await page.screenshot({
//     path: "mysite.jpg",
//     fullPage: true,
//   });

//   //   force a 1 second delay
//   await new Promise((r) => setTimeout(r, 1000));

//   //   search for a specific car

//   await page.type("#search_bar", "Random Car");

//   await page.click("#search_button");

//   //   close the browser after 10 seconds
//   await new Promise((r) => setTimeout(r, 10000));

//   browser.close();
// }

// // call the function
// go();

const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();

  // Go to Kasper Dance Crew site
  await page.goto("https://YOUR-SITE.web.app", {
    waitUntil: "networkidle2",
  });

  // Click sign in button (opens modal)
  await page.click("#signinbtn");

  // Wait for sign-in modal to appear
  await page.waitForSelector("#sign_in_form", { visible: true });

  // Type email & password
  await page.type("#sign_in_email", "admin2@gmail.com");
  await page.type("#sign_in_pass", "admin2");

  // Submit the form
  await page.click("#sign_in_form button[type='submit']");

  // Wait for authentication to finish
  await page.waitForTimeout(2500);

  // Screenshot after login
  await page.screenshot({
    path: "kasper_after_login.jpg",
    fullPage: true,
  });

  //
  // OPTIONAL: Add a performance (if you want Puppeteer to test admin features)
  //
  // Navigate to About page
  await page.goto("https://YOUR-SITE.web.app/about.html", {
    waitUntil: "networkidle2",
  });

  // Wait for admin panel
  await page.waitForSelector("#adminPanelAbout", { visible: true });

  // Fill performance form
  await page.type("#perf_title", "Puppeteer Test Performance");
  await page.type("#perf_date", "2025-12-25");
  await page.type("#perf_time", "7:00 PM");
  await page.type("#perf_location", "KDC Studio");
  await page.type("#perf_desc", "Automated test event created by Puppeteer.");

  // Submit performance
  await page.click("#add_performance_form button[type='submit']");

  // Wait for Firestore write to complete
  await page.waitForTimeout(2000);

  // Screenshot after adding performance
  await page.screenshot({
    path: "kasper_after_add_performance.jpg",
    fullPage: true,
  });

  // Close browser after 5 seconds
  await page.waitForTimeout(5000);
  await browser.close();
}

go();
