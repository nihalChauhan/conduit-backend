//Import express and router
const express = require('express');
const route = express.Router();

//Import route files
const routeUser = require('./routeUser');
const routeProfile = require('./routeProfile');
const routeArticle = require('./routeArticle');

// Add routes
route.use('/user', routeUser);
route.use('/profile', routeProfile);
route.use('/article', routeArticle)

// export related route
module.exports = route;