// import puppeteer

const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  //   open a new tab
  const page = await browser.newPage();

  //   go to the site to be tested

  await page.goto("https://mycar-collection-f21.web.app/index_.html");

  //   click on the sign-in button
  await page.click("#signinbtn");

  // provide email and password to sign in ... type(HTML_ID, value)

  await page.type("#email_", "test1234555@gmail.com");
  await page.type("#password_", "test1234555@gmail.com");

  // click the submit button
  await page.click("#signin_form > div:nth-child(3) > div > button");

  //   take a screenshot
  await page.screenshot({
    path: "mysite.jpg",
    fullPage: true,
  });

  //   force a 1 second delay
  await new Promise((r) => setTimeout(r, 1000));

  //   search for a specific car

  await page.type("#search_bar", "Random Car");

  await page.click("#search_button");

  //   close the browser after 10 seconds
  await new Promise((r) => setTimeout(r, 10000));

  browser.close();
}

// call the function
go();
