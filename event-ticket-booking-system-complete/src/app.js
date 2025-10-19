const express = require('express');
const bodyParser = require('express').json;
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
app.use(bodyParser());
app.use(logger);
const globalLimiter = rateLimit({ 
    windowMs: 15*60*1000,
    max: 200,
    message: {
        error: {
            message: 'Too many requests, try again later.' 
        }
    }
});

app.use(globalLimiter); 
app.use('/api', routes); 
app.get('/', (req,res)=>res.send('Event ticket booking API (Afrobeat Live 2025)')); 
app.use(errorHandler); 
module.exports = app;
