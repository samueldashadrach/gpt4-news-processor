const { getUrlsInTimeInterval_HT, addCategories_HT, getUrlsInCategories_HT, scrapeUrls_HT} = require("./page-scrape");
const { getUrlsFromSitemap_HT } = require("./sitemap-update");
const { generateNotes } = require("./notes-and-qa")
const { createTableNews, updateFromSelectNews_HT, insertIntoNews_HT } = require("./news-sql");
const { initPG, newsPool } = require("./db-config");


// to be called only once when starting new DB
const initDB = async() => {
    await createTableNews();
}



const main = async () => {

    SitemapUrl_HT = "https://www.hindustantimes.com/sitemap/may-2023.xml";
    urlObjects = await getUrlsFromSitemap_HT(SitemapUrl_HT);
    addCategories_HT(urlObjects);

    h_to_ms = 60 * 60 * 1000;

    // afterTime = 1685431760000;
    // beforeTime = 1685431780000;

    afterTime = Date.now() - 1 * h_to_ms;
    beforeTime = Date.now();

    urlObjectsLatest = getUrlsInTimeInterval_HT(urlObjects, afterTime, beforeTime);

    categories = ["cricket", "world-news"];

    urlObjectsDesired = getUrlsInCategories_HT(urlObjectsLatest, categories);

    console.log(urlObjectsDesired);
    
    await updateFromSelectNews_HT(urlObjectsDesired);

    console.log(urlObjectsDesired);

    await scrapeUrls_HT(urlObjectsDesired);

    console.log(urlObjectsDesired);

    console.log(urlObjectsDesired.length);

    await generateNotes(urlObjectsDesired);

    console.log(urlObjectsDesired);

    await insertIntoNews_HT(urlObjectsDesired);

    console.log("main closed");

}

// slowest step: OpenAI API latency
// also SELECT and INSERT INTO queries run one at a time, which is slow for 100+ queries


module.exports = { initDB, main };

