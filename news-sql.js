const { newsPool } = require('./db-config');


const createTableNews = async () => {

    // Note: Timestamps are being stored as BIGINT in milliseconds (not seconds) since 1970
    // PostgreSQL native timestamp formats not being used because node library pg-postgres struggles to convert datatypes between SQL and JS natively

    try {
        const newNewsTable = await newsPool.query(
            "\nCREATE TABLE news ("
            + "\nnews_id SERIAL PRIMARY KEY,"
            + "\npage_url VARCHAR(2048) UNIQUE,"
            + "\nlast_modified BIGINT,"
            + "\nchange_freq VARCHAR(2048),"
            + "\npage_title VARCHAR(2048),"
            + "\npage_body VARCHAR(65536),"
            + "\nlast_retrieved BIGINT,"
            + "\nnotes VARCHAR(65536),"
            + "\ncategory VARCHAR(2048)"
            + ")"
        );
        console.log(newNewsTable);
    }
    catch(err) {
        console.log("CREATE TABLE news failed");
        console.log(err);
    }
}


const updateFromSelectNews_HT = async (urlObjects, overwrite = false) => {
    for (const urlObject of urlObjects) {
        try {
            const selectNews = await newsPool.query(
                "\nSELECT page_url, change_freq, page_title, page_body, notes, category,"
                + "\nlast_modified, last_retrieved"
                + "\nFROM news"
                + "\nWHERE page_url = $1",
                [urlObject.pageUrl]
            );

            // since we are selecting using unique column page_url, rowCount must be 0 or 1
            if(selectNews.rowCount > 0) {
                
                console.log("eeee", selectNews.rows[0]);

                if (!Object.hasOwn(urlObject, "pageUrl") || overwrite)
                {
                    urlObject.pageUrl = selectNews.rows[0].page_url;
                }
                if (!Object.hasOwn(urlObject, "lastModified") || overwrite)
                {
                    urlObject.lastModified = selectNews.rows[0].last_modified;
                }
                if (!Object.hasOwn(urlObject, "changeFreq") || overwrite)
                {
                    urlObject.changeFreq = selectNews.rows[0].change_freq;
                }
                if (!Object.hasOwn(urlObject, "pageTitle") || overwrite)
                {
                    urlObject.pageTitle = selectNews.rows[0].page_title;
                }
                if (!Object.hasOwn(urlObject, "pageBody") || overwrite)
                {
                    urlObject.pageBody = selectNews.rows[0].page_body;
                }
                if (!Object.hasOwn(urlObject, "lastRetrieved") || overwrite)
                {
                    urlObject.lastRetrieved = selectNews.rows[0].last_retrieved;
                }
                if (!Object.hasOwn(urlObject, "notes") || overwrite)
                {
                    urlObject.notes = selectNews.rows[0].notes;
                }
                if (!Object.hasOwn(urlObject, "category") || overwrite)
                {
                    urlObject.category = selectNews.rows[0].category;
                }

            }
            else {
                // if urlObject not found in DB, and overwrite is true, then delete all properties of urlObject
                // this case not tested
                if(overwrite){
                    for (var member in urlObject) {
                        delete urlObject[member];
                    }
                }
            }
        }
        catch(err) {
            console.log("SELECT news failed");
            console.log(err);
        }
    }
}



const insertIntoNews_HT = async (urlObjects) => {

    for (const urlObject of urlObjects) {
        try {
            const newNews = await newsPool.query(
                "\nINSERT INTO news(page_url, last_modified, change_freq, page_title, page_body, last_retrieved, notes, category)"
                + "\nVALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
                + "\nRETURNING *",
                [urlObject.pageUrl, urlObject.lastModified, urlObject.changeFreq, urlObject.pageTitle, urlObject.pageBody, urlObject.lastRetrieved, urlObject.notes, urlObject.category]
            );
            console.log(newNews.rows);
        }
        catch(err) {
            console.log("INSERT INTO news failed");
            console.log(err);
        }
    }
}

module.exports = {createTableNews, updateFromSelectNews_HT, insertIntoNews_HT};

