const puppeteer = require('puppeteer')

const scrape = async (url) => {
    //  :step 1:
    //  startup browser and goto url
    console.log("[TALK] Starting browser");
    const browser = await puppeteer.launch({headless: false})
    console.log("[TALK] Opening new page");
    const page = await browser.newPage()
    console.log("[TALK] Navigating to designated website");
    await page.goto(url)

    //  :step 2:
    //  query select and store all match rows
    const rows = await page.$$('.vrml_table_row.matches_team_row');

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        
        const home = await row.$eval('.home_team_cell', element => element.innerText)
        const away = await row.$eval('.away_team_cell', element => element.innerText)

        console.log('[home team]', home, '[away team]', away);

        await row.$eval('.score_cell', el => el.children[1].firstChild.click())
        
        await page.waitForTimeout(3000)
        
        await page.waitForSelector(".match-sets-wrapper")
        const score = await page.$eval('.match-sets-wrapper', element => element.innerText)
        console.log(score);
        await row.$eval('.score_cell', el => el.children[1].firstChild.click())
        await page.waitForTimeout(3000)

        // const scoreCellChildren = await row.$('.score_cell')
        // await scoreCellChildren.$('.match-set-wrapper', element => {element.click()})
        // await page.waitForTimeout(4000)
        // const score = await page.$eval('.match-sets-wrapper', element => element.innerText)
        // await scoreCellChildren.$('.match-set-wrapper', element => element.click())
        // await page.waitForTimeout(4000)
        // // await page.waitForSelector('.match-sets-wrapper', {hidden: true})
        // console.log(score);
    }

    // await page.evaluate(() => {
    //     let elements = document.querySelectorAll('.match-set-wrapper')
    //     elements.forEach(el => {
    //         el.click()
    //     })
    // })
    // page.$$eval('.match-set-wrapper', element => {
    //     element.click()
    //     page.waitForTimeout(4000)
    //     const score = page.$eval('.match-sets-wrapper', element => element.innerText)
    //     console.log(score);
    //     page.waitForTimeout(4000)
    // })

    //  :step 2:
    //  click each element and then query select for relative popup

    //  :step 3:
    //  store contents of each popup


    // working
    // console.log("[TALK] Finding element to click");
    // await page.evaluate(() => {
    //     document.querySelector('div.match-set-wrapper > a').click()
    // })

    // console.log("[TALK] Waiting for element to appear");
    // await page.waitForSelector("#BodyNode > div.container > main > div > div > div:nth-child(13) > table > tbody > tr:nth-child(1) > td.score_cell > div.match-sets-wrapper > div:nth-child(1)")
   
    // console.log("[TALK] Getting element");
    // const [el] = await page.$x('//*[@id="BodyNode"]/div[7]/main/div/div/div[12]/table/tbody/tr[1]/td[4]/div[2]')
    // if (!el) {
    //     browser.close()
    //     return;
    // }
    // console.log("[TALK] Getting element contents");
    // const txt = await el.getProperty('innerText')
    // const rawText = await txt.jsonValue()
    // console.log(rawText);

    browser.close()
}

scrape('https://vrmasterleague.com/Pavlov/Teams/ErbuozweC0N6yLgUZm4Www2')