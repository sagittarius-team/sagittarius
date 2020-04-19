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
app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

//app sets
app.set('view engine', 'ejs');

/////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/signup' , (req,res) =>{
    res.render('/');
});

app.post('/add',addDataBase);//this route for post my data i hada insert it in sign page into my data pase
function  addDataBase(req,res){
// console.log(req.body);
let {username,email,password,day,month,year,gender,isagree,criedt}=req.body;
let SQL3 = 'SELECT (username,email) FROM signup WHERE username=$1 AND email=$2;';
let safeValues2 = [username,email];
client.query(SQL3,safeValues2)
.then(result=>{
    
    if (result.rows[0]){
        res.render('valid');
    }
    else {
        let SQL='INSERT INTO signup (username,password,email,day,month,year,gender,isAgree,criedt) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);';
        let safeValues=[username,password,email,day,month,year,gender,isagree,criedt];
        client.query(SQL ,safeValues)
        .then(()=>{
            let SQL2= 'SELECT * FROM signup WHERE username=$1;';
            let safeValues3 = [username];
        client.query(SQL2,safeValues3)
        .then(result =>{
            console.log(result.rows);
            res.render('profile',{taskResult:result.rows[0]});
        });
        });
    }

});}


app.get('/about',aboutUsPage);
app.get('/mission', desideDate);
app.get('/show', pastMission);
app.get('/f_mission', fulureMission);
app.get('/book/:trip_id',booking);
app.delete('/delete/:trip_id',deleteTripDataBase);

function aboutUsPage(req,res){
    res.render('aboutus');
}






 app.get('/', renderProfile);

app.get('/myProfile/:task_id' ,myprofile);


function myprofile(req,res){
    let SQL= 'SELECT * FROM signup ;';
    return client.query(SQL)
    .then(result=>{

       res.render('profile',{taskResult:result.rows[0]})
    })

}

 function  renderProfile(req,res){
     let SQL= 'SELECT * FROM signup;';
     return client.query(SQL)
     .then(result=>{

        res.render('index',{taskResult:result.rows})
     })
    }
    

app.get('/login',loginpage);



function loginpage(req,res){

res.render('login');


}
app.post('/',validLogIn);
function validLogIn(req,res){
    let username = req.body.username;
    let email = req.body.email;
    let SQL = 'SELECT * FROM signup WHERE username=$1 AND email=$2;';
    let safeValues =[username ,email];
    client.query(SQL,safeValues)
    .then(result=>{
if (result.rows[0]){
   
    res.render('profile',{taskResult:result.rows[0]});
}else{
    res.render('valid');
}
    })
}






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
                // console.log(results)
                // console.log(results.rows)
                response.render('./mission/show', { theJournies: results.rows })
            }
            else {
                // if the date not in data base render it from API
                console.log('from API')
                let url = `https://launchlibrary.net/1.3/launch/${theDate}`;
                // console.log(url);
                superagent.get(url)
                    .then(data => {
                        let pastData = data.body.launches.map(val => {
                            let journy = new PastJourny(val);
                            let safeValues = [year, journy.date, journy.description, journy.name, journy.vidURL, journy.img];
                            let SQL2 = 'INSERT INTO mission (year,date,description,name,vidURL,img) VALUES ($1,$2,$3,$4,$5,$6);';

                            client.query(SQL2,safeValues);

                            return journy
                        })
                        response.render('./mission/show', { theJournies: pastData });

                    })
            }
        })
}

// fulure mission function 
let allfultue;
function fulureMission(req, res) {
    let sql = 'SELECT * FROM outlook';
client.query(sql)  
.then(data =>{
    if(data.rows.length > 0 )
    {
        res.render('./fu_mission/f_mission',{all_future_moission:data.rows}); 
    }
    else 
    { allfultue = [];
        let url = `https://launchlibrary.net/1.3/launch/next/10`;
    superagent.get(url)
        .then(data => {

         allfultue = data.body.launches.map(val => {
                let future = new Fulure(val);
                let SQL = 'INSERT INTO outlook (name,net,image,description) VALUES ($1,$2,$3,$4);';
                let safeValues = [future.name,future.net,future.image,future.description];
                client.query(SQL,safeValues);
                return future ;
            });
            res.render('./fu_mission/f_mission',{all_future_moission:allfultue}); 
        });
    }
});
}

/// booking function
function booking(req,res){
    let idBook = req.params.trip_id;    

    let name = allfultue[idBook].name;
    
    let net = allfultue[idBook].net;
    let image = allfultue[idBook].image;
    let description = allfultue[idBook].description;
    let SQL = 'INSERT INTO booking (name,net,image,description) VALUES ($1,$2,$3,$4);';
    let safeValues = [name,net,image,description];
    client.query(SQL,safeValues);
    renderBookDataBase(res);
    
}
function renderBookDataBase(res) {
    let SQL2 = 'SELECT * FROM booking;';
    client.query(SQL2)
        .then(result => {
            res.render('./fu_mission/show', { data: result.rows });
        });
}

// delete from dataBase
function deleteTripDataBase(req,res){
    console.log('hhhhhhhh hh ',req.params.trip_id);
    let idBook = req.params.trip_id;
    let SQL = 'DELETE FROM booking WHERE id = $1;';
    let safeValues = [idBook];
    client.query(SQL,safeValues)
    .then(() =>{
       renderBookDataBase(res); 
    }
    );
}



//////////////////constructor for past journies
function PastJourny(dataForOneJourny) {
    this.date = dataForOneJourny.net;
    this.description = (dataForOneJourny.missions[0] && dataForOneJourny.missions[0].description) || 'there is no descriptions ';
    this.name = dataForOneJourny.location.pads[0].name;
    this.vidURL = dataForOneJourny.vidURL;
    this.img = dataForOneJourny.rocket.imageURL || 'https://launchlibrary1.nyc3.digitaloceanspaces.com/RocketImages/placeholder_1920.png';
}
/////////////// constructor for  Fulure
function Fulure(val) {
    this.name = val.name;
    this.net=val.net;
    this.image=val.rocket.imageURL;
    console.log(val.pads[0].agencies[0].name);
    this.agencies=val.pads[0].agencies[0].name;
    

    this.description=(val.missions[0] && val.missions[0].description)||'There is no description';

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

