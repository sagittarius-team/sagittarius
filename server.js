`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3030;
const app = express();
const methodOverride = require('method-override');

var path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

//app using
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine' ,'ejs')
/////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/about', aboutUsPage);
app.get('/mission', desideDate);
app.get('/show', pastMission);
app.get('/f_mission', fulureMission);
app.get('/book/:trip_id', booking);
app.delete('/delete/:trip_id', deleteTripDataBase);
app.get('/all_book', renderBookDataBase);
app.post('/add', addDataBase);
app.get('/', homePage);
app.get('/myProfile', myprofile);
app.get('/login', loginpage);
app.post('/', validLogIn);
app.get('/signup',signUpPage);
app.get('/logout',logutPage)
app.get('/load' ,loadFunc);


// Esraa 

function loadFunc(req,res){
    res.render('./layout/load');
}

// render profile page
function myprofile(req, res) {
    let SQL = 'SELECT * FROM signin;';
    return client.query(SQL)
        .then(result => {
            if(result.rows[0]){
                res.render('profile', { taskResult: result.rows[0] })
            }
            else {
                res.render('./layout/login');
            }
        });
}
function signUpPage(req,res){
    res.render('./layout/signup');
}

function homePage(req, res) {
    let today = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    let SQL2 = 'SELECT * FROM today WHERE date=$1;';
    let safeValues2 = [today];
    client.query(SQL2,safeValues2)
    .then(result =>{
        if(result.rows[0]){
            console.log('t database');
    //         let SQL8 = 'SELECT * FROM signIn;';
    // client.query(SQL8)
    // .then(check =>{
    //     console.log('ch ',check.rows);
    //     res.render('index',{data: result.rows[0], check: check.rows});
    // });
    res.render('index',{data: result.rows[0]});    
        }
        else{
            console.log('t API');
            let key = process.env.NASA_KEY;
            let url = `https://api.nasa.gov/planetary/apod?api_key=${key}`;
            superagent.get(url)
            .then(result =>{
                let data = new TodayImage(result.body);
                let SQL = 'INSERT INTO today (image,title,description,date) VALUES ($1,$2,$3,$4);';
                let safeValues = [data.image,data.title,data.description,data.date];
                client.query(SQL,safeValues);
    //             let SQL8 = 'SELECT * FROM signIn;';
    // client.query(SQL8)
    // .then(check =>{
    //     console.log('ch ',check.rows);
        // res.render('index',{data: result.rows[0], check: check.rows});
            // });

            res.render('index',{data: data});
        }
    );
}});
}
//this route for post my data i hada insert it in sign page into my data pase
function addDataBase(req, res) {
    // console.log(req.body);
    let { username, email, password, day, month, year, gender, isagree, criedt } = req.body;
    let SQL3 = 'SELECT (username,email) FROM signup WHERE username=$1 AND email=$2;';
    let safeValues2 = [username, email];
    client.query(SQL3, safeValues2)
        .then(result => {

            if (result.rows[0]) {
                console.log('validation if the user esist');
                let vaildData = {text:'This Account Already Exsist' }
                res.render('valid',{data: vaildData.text});
            }
            else {

                let SQL = 'INSERT INTO signup (username,password,email,day,month,year,gender,isAgree,criedt) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);';
                let safeValues = [username, password, email, day, month, year, gender, isagree, criedt];
                client.query(SQL, safeValues)
                    .then(() => {
                        let SQL2 = 'SELECT * FROM signup WHERE username=$1;';
                        let safeValues3 = [username];
                        client.query(SQL2, safeValues3)
                            .then(() => {
                                // let vaildData = {text: 1}
                                // res.render('header_abdallah',{data: vaildData.text});
                                res.redirect('/');
                            });
                    });
            }

        });
}
function loginpage(req, res) {
    res.render('./layout/login');
}

function validLogIn(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let SQL = 'SELECT * FROM signup WHERE username=$1 AND email=$2;';
    let safeValues = [username, email];
    client.query(SQL, safeValues)
        .then(result => {
            if (result.rows[0]) {
                    let object = result.rows[0];
                    console.log('ddddddddddd   ',object);
                    let SQL2 = 'INSERT INTO signIn (username,password,email,day,month,year,gender,isAgree,criedt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);';
                    let safeValues2 = [object.username, object.password, object.email, object.day, object.month, object.year, object.gender, object.isagree, object.criedt];
                    client.query(SQL2,safeValues2);
                    myprofile(req, res);
                }
             else {
                 let vaildData = {text:'Your Password or Email uncorrect' }
                res.render('valid',{data: vaildData.text});
            }
        });
}
function logutPage(req,res){
    let SQL = 'TRUNCATE TABLE signIn;';
    client.query(SQL);
    res.redirect('/');
}

//Yousef
//////////////////to render mission page
function desideDate(request, response) {
    response.render('./mission/mission');
}

////////////////to render show page but (show page not in the nav of header)
function pastMission(request, response) {
    let theDate = request.query.date;
    let year = theDate.slice(0, 4);
    console.log(year);
    // console.log(theDate);
    let SQL = 'SELECT * FROM mission WHERE year = $1;';
    let safeYear = [year];
    client.query(SQL, safeYear)
        .then(results => {
            //if the date in data base render it from there
            if (results.rows.length > 0) {
                console.log('in data base');
                response.render('./mission/show', { theJournies: results.rows })
            }
            else {
                // if the date not in data base render it from API
                console.log('from API')
                let url = `https://launchlibrary.net/1.3/launch/${theDate}`;
                superagent.get(url)
                    .then(data => {
                        let pastData = data.body.launches.map(val => {
                            let journy = new PastJourny(val);
                            let safeValues = [year, journy.date, journy.description, journy.name, journy.vidurl, journy.img];
                            let SQL2 = 'INSERT INTO mission (year,date,description,name,vidurl,img) VALUES ($1,$2,$3,$4,$5,$6);';

                            client.query(SQL2, safeValues);

                            return journy
                        });
                        response.render('./mission/show', { theJournies: pastData });

                    });
            }
        });
}

// Abdalluh
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// fulure mission function 
function fulureMission(req, res) {
    let sql = 'SELECT * FROM outlook';
    client.query(sql)
        .then(data => {
            if (data.rows.length > 0) {
                console.log('DataBase Future');
                res.render('./fu_mission/f_mission', { all_future_moission: data.rows });
            }
            else {
                console.log('API Future');
                let url = `https://launchlibrary.net/1.3/launch/next/9`;
                superagent.get(url)
                    .then(data => {
                        data.body.launches.forEach(val => {
                            let future = new Fulure(val);
                            let cost = getRandomInt(1000000, 6000000);
                            let SQL = 'INSERT INTO outlook (name,net,image,agencies,description,cost) VALUES ($1,$2,$3,$4,$5,$6);';
                            let safeValues = [future.name, future.net, future.image, future.agencies, future.description, cost];
                            client.query(SQL, safeValues);
                            return future;
                        });
                    });
                renderFutureMission(res);
            }
        });
}

function renderFutureMission(res) {
    let SQL = 'SELECT * FROM outlook;';
    client.query(SQL)
        .then(result => {
            res.render('./fu_mission/f_mission', { all_future_moission: result.rows });
        });
}

// Sondos
// about us page render
function aboutUsPage(req, res) {
    res.render('aboutus');
}
/// booking function
function booking(req, res) {
    let SQL2 = 'SELECT * FROM signIn;'
    client.query(SQL2)
    .then(result =>{
        if(result.rows[0]){
            let idBook = req.params.trip_id;
            let SQL2 = 'SELECT * FROM outlook WHERE id=$1;';
            let safeValues2 = [idBook];
            client.query(SQL2, safeValues2)
                .then(result => {
                    let selection = result.rows[0];
                    let SQL = 'INSERT INTO booking (name,net,image,agencies,description,cost) VALUES ($1,$2,$3,$4,$5,$6);';
                    let safeValues = [selection.name, selection.net, selection.image, selection.agencies, selection.description, selection.cost];
                    client.query(SQL, safeValues);
                    renderBookDataBase(req,res);
                });
        }
        else {
            renderBookDataBase(req,res);
            res.render('./layout/login');
        }
    })
  
}

function renderBookDataBase(req,res) {
    let SQL2 = 'SELECT * FROM booking;';
    client.query(SQL2)
        .then(result => {
            console.log('to book ', result.rows);
            res.render('./fu_mission/show', { data: result.rows });
        });
}


// delete from dataBase
function deleteTripDataBase(req, res) {
    let idBook = req.params.trip_id;
    let SQL = 'DELETE FROM booking WHERE id = $1;';
    let safeValues = [idBook];
    client.query(SQL, safeValues)
        .then(() => {
            renderBookDataBase(req,res);
        }
        );
}



//////////////////constructor for past journies
function PastJourny(dataForOneJourny) {
    this.date = dataForOneJourny.net;
    this.description = (dataForOneJourny.missions[0] && dataForOneJourny.missions[0].description) || 'there is no descriptions ';
    this.name = dataForOneJourny.location.pads[0].name;
    this.vidurl = dataForOneJourny.vidURLs[0];
    this.img = dataForOneJourny.rocket.imageURL || 'https://launchlibrary1.nyc3.digitaloceanspaces.com/RocketImages/placeholder_1920.png';
}
/////////////// constructor for  Fulure
function Fulure(val) {
    this.name = val.name;
    this.net = val.net;
    this.image = val.rocket.imageURL;
    this.agencies = val.location.pads[0].agencies&&val.location.pads[0].agencies[0].name || '';
    this.description = (val.missions[0] && val.missions[0].description) || 'There is no description';
}
/// costructur for img today
function TodayImage(data){
    this.image = data.url;
    this.title = data.title;
    this.description = data.explanation;
    this.date = data.date;
}






////////////////////////errors and listen\\\\\\\\\\\\\\\\\\\\\\\
app.get('*', (request, response) => {
    response.status(404).send('NOT FOUND');
})

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        });
    })

