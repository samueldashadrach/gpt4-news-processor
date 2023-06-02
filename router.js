const express = require('express');
const router = express.Router();

const { initDB, initServer, main } = require("./main");


// responds to HTTP GET request on path "/" with text string
router.get('/', (req, res) => {
    console.log("HTTP GET received at root");
    res.send('HTTP GET received at root');
});

router.get('/init-db', (req, res) => {
    initDB(); // async
    console.log("initDB called");
    res.send("initDB called");
})

router.get('/main', (req, res) => {
	main(); // note this is an async function
    console.log("main called");
    res.send("main called");
});



module.exports = router;