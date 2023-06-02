const { chromium } = require('playwright');


const getUrlsInTimeInterval_HT = (urlObjects, afterTime, beforeTime) => {

    // afterTime and beforeTime are in milliseconds since 1970

    urlObjectsSpliced = [];

    for (var urlObject of urlObjects) {

        if (urlObject.lastModified > afterTime && urlObject.lastModified < beforeTime ){
            
            urlObjectsSpliced.push(urlObject);
        }
    }
    return urlObjectsSpliced;
}

const addCategories_HT = (urlObjects, overwrite = false) => {
    for (var urlObject of urlObjects) {
        // if overwrite is true or (overwrite is false and) category is not defined
        if (!Object.hasOwn(urlObject, "category") || overwrite) {
            const regex_HT = /.*hindustantimes\.com\/([^\/]*)\/.*/g;

            const matchesArray = [...urlObject.pageUrl.matchAll(regex_HT)];

            urlObject.category = matchesArray[0][1]; // [0] indicates first match, [1] indicates first capturing group inside this match
        }
    }
}


const getUrlsInCategories_HT = (urlObjects, categories) => {
    // assumes categories already assigned

    // splice out objects that are in desired categories
    urlObjectsSpliced = [];
    for (const urlObject of urlObjects) {
        if (categories.includes(urlObject.category) ){
            urlObjectsSpliced.push(urlObject);
        }
    }
    return urlObjectsSpliced;

}



const scrapeUrls_HT = async (urlObjects, overwrite = false) => { 
    const browser = await chromium.launch({ headless: true }); 
    const context = await browser.newContext(); 
    const page = await context.newPage(); 
    
    for (var urlObject of urlObjects) {

        // if overwrite is true, or (overwrite is false and) pageBody is not defined
        if ( !Object.hasOwn(urlObject, "pageBody") || overwrite) {

            await page.goto(urlObject.pageUrl);     
            urlObject.pageTitle = await page.title(); 
            
            // ARIA selectors recommended over CSS or xpath
            // use Chrome devTools > Accessibility to get ARIA selectors
            const paras = await page.getByRole('paragraph');
            console.log(await paras.count());

            var pageBody = "";
            for (const para of await paras.all())
                pageBody += await para.textContent();

            urlObject.pageBody = pageBody;

            urlObject.lastRetrieved = Date.now();
        }
    }

    await browser.close(); 
}



// time testing - takes 74 seconds for 100 webpages = 0.74 s/page

module.exports = { getUrlsInTimeInterval_HT, addCategories_HT, getUrlsInCategories_HT, scrapeUrls_HT };

