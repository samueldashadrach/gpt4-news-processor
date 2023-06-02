const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
dotenv.config();

const { initPG } = require("./db-config");


// makes all static files available
app.use(express.static(path.join(__dirname,'./public')));

// lots of middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// import router
const router = require("./router");

// use router (for all paths)
app.use(router);


// to be called only once when starting server afresh
// ensure DB has correct parsers etc set up
initPG();


// logs whenever https server port 3000 receives connection
server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
