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

//   await page.goto("http://127.0.0.1:5500/public/index.html");

//   //   click on the sign-in button
//   await page.click("#signinbtn");

//   // provide email and password to sign in ... type(HTML_ID, value)

//   await page.type("#sign_in_email", "admin2@gmail.com");
//   await page.type("#sign_in_pass", "admin2");

//   // click the submit button
//   await page.click("#sign_in_form button[type='submit']");

//   //   take a screenshot
//   await page.screenshot({
//     path: "kasper_after_login.jpg",
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

// KDC Puppeteer Script to Test Admin Features

// const puppeteer = require("puppeteer");

// async function go() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//   });

//   const page = await browser.newPage();

//   // Go to Kasper Dance Crew site
//   await page.goto("http://127.0.0.1:5500/public/index.html", {
//     waitUntil: "networkidle2",
//   });

//   // Click sign in button (opens modal)
//   await page.click("#signinbtn");

//   // Type email & password
//   await page.type("#sign_in_email", "admin2@gmail.com");
//   await page.type("#sign_in_pass", "admin2");

//   // Submit the form
//   await page.click("#sign_in_form button[type='submit']");

//   // Wait for authentication to finish
//   await page.waitForTimeout(2500);

//   // Screenshot after login
//   await page.screenshot({
//     path: "kasper_after_login.jpg",
//     fullPage: true,
//   });

//   //
//   // OPTIONAL: Add a performance (if you want Puppeteer to test admin features)
//   //
//   // Navigate to About page
//   await page.goto("http://127.0.0.1:5500/public/about.html", {
//     waitUntil: "networkidle2",
//   });

//   // Wait for admin panel
//   await page.waitForSelector("#adminPanelAbout", { visible: true });

//   // Fill performance form
//   await page.type("#perf_title", "Puppeteer Test Performance");
//   await page.type("#perf_date", "2025-12-25");
//   await page.type("#perf_time", "7:00 PM");
//   await page.type("#perf_location", "KDC Studio");
//   await page.type("#perf_desc", "Automated test event created by Puppeteer.");

//   // Submit performance
//   await page.click("#add_performance_form button[type='submit']");

//   // Wait for Firestore write to complete
//   await page.waitForTimeout(2000);

//   // Screenshot after adding performance
//   await page.screenshot({
//     path: "kasper_after_add_performance.jpg",
//     fullPage: true,
//   });

//   // Close browser after 5 seconds
//   await page.waitForTimeout(5000);
//   await browser.close();
// }

// go();

const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,

    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  // 1) Go to home page
  await page.goto("http://127.0.0.1:5500/public/index.html", {
    waitUntil: "networkidle2",
  });

  // Click sign in button (opens modal)
  await page.waitForSelector("#signinbtn", { visible: true });
  await page.click("#signinbtn");

  // Wait for sign-in form to show
  await page.waitForSelector("#sign_in_form", { visible: true });

  // Type email & password
  await page.type("#sign_in_email", "admin2@gmail.com");
  await page.type("#sign_in_pass", "admin2");

  // Click the submit INPUT inside the form
  await page.waitForSelector("#sign_in_form input[type='submit']", {
    visible: true,
  });
  await page.click("#sign_in_form input[type='submit']");

  // 7) Screenshot after login
  await page.screenshot({
    path: "kasper_after_login.jpg",
    fullPage: true,
  });

  // 8) Go to About page (admin panel is here)
  await page.goto("http://127.0.0.1:5500/public/about.html", {
    waitUntil: "networkidle2",
  });

  // 9) Wait for admin panel to become visible

  await page.waitForSelector("#adminPanelAbout", {
    visible: true,
    timeout: 10000,
  });

  // 10) Fill performance form
  await page.waitForSelector("#add_performance_form", { visible: true });
  await page.type("#perf_title", "Puppeteer Test Performance");
  await page.type("#perf_date", "2025-12-25");
  await page.type("#perf_time", "7:00 PM");
  await page.type("#perf_location", "KDC Studio");
  await page.type("#perf_desc", "Automated test event created by Puppeteer.");

  // 11) Click "Add Performance" button
  await page.waitForSelector("#add_performance_form button[type='submit']", {
    visible: true,
  });
  await page.click("#add_performance_form button[type='submit']");

  // 13) Screenshot after adding performance
  await page.screenshot({
    path: "kasper_after_add_performance.jpg",
    fullPage: true,
  });

  // 14) Close browser

  await browser.close();
}

go().catch((err) => {
  console.error("Puppeteer error:", err);
});
