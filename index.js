// Required Packages  !!!!    
    const express = require('express');
    const bodyParser = require("body-parser");
    const path = require('path');
    const cookieParser =require('cookie-parser');
    const cookieSession = require('cookie-session');
    const archiver =  require('archiver');
    const { body, validationResult } = require('express-validator');
    const firebase = require('firebase');
    require('dotenv').config({ path: './.env' })
    const multer = require('multer');
    const fs = require('fs')


//Required Packages  End here !!!!

  
//pages and app configuration!!!

    const app = express();
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    //setting Public directory

    const publicDirectory = path.join(__dirname,'./public');
    app.use(express.static(publicDirectory));
    // SET OUR VIEWS AND VIEW ENGINE
    
    app.set('views', path.join(__dirname,'views'));
    app.set('view engine','ejs');
    app.use(cookieParser());
    app.use('/',require('./routes/pages'));
    app.use('/',require('./routes/postreq'));

//pages and app configuration Ends Here!!

   

// APPLY COOKIE SESSION MIDDLEWARE starts
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge:  3600 * 1000 // 1hr
    }));



      // DECLARING CUSTOM MIDDLEWARE
    const ifNotLoggedin = (req, res, next) => {
        if(!req.session.isLoggedIn){
            return res.render('index');
          }
          
          next();
      }

    const ifLoggedin = (req,res,next) => {
        if(req.session.isLoggedIn){
             console.log(req.session.isLoggedIn) 
              return res.redirect('/home');
          }
          next();
      }
//APPLY COOKIE SESSION MIDDLEWARE  End


// Get Routes(restricted Pages)
      app.get('/download',ifNotLoggedin,(req,res) =>{
        
        res.download('./uploads/'+req.session.username+'.zip')

      });


//logout Request
app.get('/logout',(req,res)=>{
    firebase.auth().signOut().then(() => {
          console.log('signOut Successfully')
        }).catch((error) => {
          // An error happened.
        });
    req.session = null;
    res.redirect('index');
});

app.listen(3020, () => console.log("Server is Running...3020"));


