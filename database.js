const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized:true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.post('/main',(request,response)=>{
    // redirect.js

document.addEventListener('DOMContentLoaded', function() {
    const redirectButton = document.getElementById('Insurance');
    
    redirectButton.addEventListener('click', function() {
        window.location.href = '/another-page';
    });
});

});