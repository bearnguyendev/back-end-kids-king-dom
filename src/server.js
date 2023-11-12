import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initApiRoutes from "./route/api";
import connectDB from "./config/connectDB";
import { configLoginWithGoogle } from "./controllers/social/GoogleController"
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//import cors from "cors";
require("dotenv").config();

let app = express();

//app.use(cors({ origin: true }));

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

viewEngine(app);
app.use(passport.initialize());
configLoginWithGoogle(app);
initApiRoutes(app);

connectDB();

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Backend Nodejs is running on the port: " + PORT);
});
