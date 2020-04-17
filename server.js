`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3030;
const app = express();
// const methodOverride = require('method-override');

const bodyParser = require('body-parser');
var path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));

app.use(bodyParser());
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/pages/'),
path.join(__dirname, 'views/pages/searches/'),
path.join(__dirname, 'views/pages/books/')]);
/////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/' , (req,res) =>{
    res.render('index');
})






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
