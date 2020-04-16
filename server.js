'use strict';

require('dotenv').config();

//dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

//PORT
const PORT = process.env.PORT || 3000;

//the App
const app =  express();

//app using
app.use(express.static('./public'));
app.use(express.join());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//app sets
app.set('view engine','ejs');

//client
const client = new pg.Client(process.env.DATABASE_URL);

/////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\








////////////////////////errors and listen\\\\\\\\\\\\\\\\\\\\\\\
app.get('*', (request, response) => {
    response.status(404).send('NOT FOUND');
})

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        })
    })
