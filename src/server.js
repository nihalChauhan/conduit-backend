const fs = require('fs');
const dotenv = require('dotenv');
let envConfig;
envConfig = dotenv.parse(fs.readFileSync(__dirname + "/../.env"));
for (let k in envConfig) {
  process.env[k] = envConfig[k]
}

/*
 Import model connection just to establish model connection
 */
const { db } = require('./database/dbconfig')

// import related modules
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.disable('x-powered-by');

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
 - Define the base route.
 - Set the base routes to /api/ path
 */
let baseRoute = require('./routes/routeBase');
app.use(process.env.API_VERSION, baseRoute);
console.log("info", "Base API is: " + process.env.API_VERSION);

db.sync()
    .then(() => {
        console.log('info', 'Database In Sync')
        app.listen(process.env.NODE_SERVER_PORT, () => {
            console.log("info", "Server is running at port " + process.env.NODE_SERVER_PORT);
        })
    })
    .catch(err => console.log('error', err))