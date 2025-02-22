const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// IIFE - Immediately invoked function expression
(async () => {
    const browser = await puppeteer.launch({});

    const page = await browser.newPage();
    await page.goto("https://ta.yrdsb.ca/yrdsb/");
    await page.screenshot({ path: "image.png"});

    await page.waitForSelector('td input[name="username"]');
    await page.type('td input[name="username"]', 'ENTER USER NAME HERE');
    await page.type('td input[name="password"]', 'ENTER PASSWORD HERE');
    await page.click('td input[name="submit"]');

    // await page.waitForSelector('td a[href="viewReport.php?subject_id=639287&student_id=205662"]')
    // const period1 = await page.$('td a[href="viewReport.php?subject_id=639287&student_id=205662"]');
    // const period1Text = period1 ? await page.evaluate(el => el.innerText, period1) : null;
    // console.log(period1Text);

    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
     await page.waitForSelector('table');

    // Select all rows inside the table, skipping the header
    const rows = await page.$$('table tbody tr:not(:first-child)');

    for (const row of rows) {
        const columns = await row.$$('td');

        //Ensure the row has at least 3 columns
        if (columns.length < 3) continue;

        // Extract course name
        const courseName = await page.evaluate(el => el.innerText.trim(), columns[0]);

        // Extract date
        const date = await page.evaluate(el => el.innerText.trim(), columns[1]);

        // Extract mark (Check inside span, anchor, or fallback to plain text)
        const markElement = await columns[2].$('span, a') || columns[2]; // Fallback if <span> or <a> is missing

        //Ensure markElement exists before extracting text
        const mark = markElement
            ? await page.evaluate(el => el.innerText.trim(), markElement)
            : "No mark available";

        //Use backticks for template literals
        console.log(`Course: ${courseName}, Date: ${date}, Mark: ${mark}`);
    }

    await browser.close();
})();