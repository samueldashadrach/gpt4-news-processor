const { Pool } = require('pg');
var types = require('pg').types


const initPG = () => {

    // return BIGINT in SQL as number in JS (not string)
    types.setTypeParser(20, (stringVal) => {
        return Number(stringVal);
    })
    console.log("DB type parser set");
}



const newsPool = new Pool({
    connectionString: process.env.DBConnLink,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = { initPG, newsPool };
