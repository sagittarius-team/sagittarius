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
path.join(__dirname, 'views/mission/')
]);
/////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/signup' , (req,res) =>{
    res.render('signup');
});
// app.get('/' ,(req,res)=>{
//     res.render('index');
// });

// app.post('/sign',signInfo);

// function signInfo(req ,res){
// let {username ,password,email,day,month,year,gender}=req.body;
// let SQL ='INSERT INTO signup (username ,password,email,day,month,year,gender) VALUES ($1,$2,$3,$4,$5,$6,$7);';
// let safeValues =[username ,password,email,day,month,year,gender];
// return client.query(SQL ,safeValues)
// .then(()=>{
//     res.redirect('/')
// })
// }
app.post('/add',addDataBase);//this route for post my data i hada insert it in sign page into my data pase
function  addDataBase(req,res){
console.log(req.body);
let {username,email,password,day,month,year,gender}=req.body;
let SQL='INSERT INTO signup (username,password,email,day,month,year,gender) VALUES($1,$2,$3,$4,$5,$6,$7);';
let safeValues=[username,password,email,day,month,year,gender];
return client.query(SQL ,safeValues)
.then(()=>{
    res.redirect('/');
})
}






 app.get('/', renderProfile);
//  app.get('/addprofile',addprofile);

app.get('/myProfile' ,myprofile);

// function addprofile(req,res){

// }

function myprofile(req,res){
    let SQL= 'SELECT * FROM signup;';

    return client.query(SQL)
    .then(result=>{

       res.render('profile',{taskResult:result.rows})
    })

}

 function  renderProfile(req,res){
     let SQL= 'SELECT * FROM signup;';
     return client.query(SQL)
     .then(result=>{

        res.render('index',{taskResult:result.rows})
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
