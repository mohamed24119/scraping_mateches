const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function scrape_matches(targetDate = new Date(), outputFileName = 'today.json') {
    const browser = await puppeteer.launch({ 
        headless: true,
        timeout: 90000
    });
    const page = await browser.newPage();

    function formatDate(date) {
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const y = date.getFullYear();
        return `${m}/${d}/${y}`;
    }

    const URL = `https://www.yallakora.com/match-center/?date=${formatDate(targetDate)}`;
    const DATA_FILE = path.join(__dirname, '..', 'data', outputFileName);

    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 0 });

    await page.waitForSelector('.mtchCntrContainer', { timeout: 60000 }).catch(() => {
        console.error("No items found (.mtchCntrContainer)");
    });

    const matches = await page.evaluate(() => {
        const result = [];
        const cards = document.querySelectorAll('.matchCard');
        cards.forEach(card => {
            const league_name = card.querySelector('.tourTitle h2')?.textContent.trim();
            const league_logo = card.querySelector('.tourTitle .imgCntnr img')?.src.trim();
            const matches_cards = card.querySelectorAll('.liItem');

            matches_cards.forEach(match_card => {
                const scores = match_card.querySelectorAll('.MResult .score');

                const home_name = match_card.querySelector('.teamsData .teamA p')?.textContent.trim();
                const away_name = match_card.querySelector('.teamsData .teamB p')?.textContent.trim();
                const home_score = scores[0]?.textContent.trim();

                const home_logo = match_card.querySelector('.teamsData .teamA img')?.src.trim();
                const away_logo = match_card.querySelector('.teamsData .teamB img')?.src.trim();
                const away_score = scores[1]?.textContent.trim();

                const time = match_card.querySelector('.MResult .time')?.textContent.trim();
                const round = match_card.querySelector('.topData .date')?.textContent.trim();
                const status = match_card.querySelector('.topData .matchStatus span')?.textContent.trim();
                const channel = match_card.querySelector('.channel')?.textContent.trim();

                const ex_id = match_card.querySelector('.liItem>a')?.href.trim();
                const id = ex_id?.split("/match/")[1]?.split("/")[0];

                result.push({
                    id,
                    home_name,
                    home_logo,
                    home_score,
                    away_name,
                    away_logo,
                    away_score,
                    league_name,
                    league_logo,
                    time,
                    round,
                    status,
                    channel
                });
            });
        });
        return result;
    });

    await browser.close();

    await fs.outputJson(DATA_FILE, {
        date: new Date().toISOString(),
        matches
    }, { spaces: 2 });

    console.log(`✅ [${formatDate(targetDate)}] Extracted ${matches.length} Match to: ${outputFileName}`);
}
module.exports = scrape_matches;