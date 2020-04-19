`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3030;
const app = express();
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
var path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(bodyParser());
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/layout/')
]);
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

});


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
