const express = require('express');
const bodyParser = require("body-parser");
const mysql =require('mysql');
const path = require('path');
const cookieParser =require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');





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




// APPLY COOKIE SESSION MIDDLEWARE
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
        return res.redirect('/home');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE

// ROOT PAGE
app.get('/', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` ,email FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('home',{
            name:rows[0].name,
            email:rows[0].email
        });
        
    });
    
});// END OF ROOT PAGE


// REGISTER PAGE
app.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('login-register',{
            register_error:allErrors,
            old_data:req.body
        });
      
        
    }
});// END OF REGISTER PAGE






// LOGIN PAGE
app.post('/login-register', ifLoggedin, [
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            // console.log(rows[0].password);
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/');
                }
                else{
                    res.render('login-register',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('login-register',{
            login_errors:allErrors
        });
    }
});
// END OF LOGIN PAGE

const db = mysql.createConnection({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root',        // MYSQL USERNAME
    password : '',    // MYSQL PASSWORD
    database : 'test' ,     // MYSQL DB NAME
    port :  3360

});



app.post('/startup', function(req, res) {
    console.log('req.body');
    console.log(req.body);
     const {stratup_name,product_name,startup_web,fr_date,flexRadioDefault,comp_address,state,district,city,businesss_model,firm_type,startup_sector,
        technology,startup_desc,other,team_size,awards,hear_about_us,flexRadioDefault1,acc_name,acc_no,bank_name,IFSC,branch} = req.body;

      dbConnection.execute("SELECT email FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        global.fetched_email;
            fetched_email =rows[0].email
           // console.log(fetched_email);
        

     
    db.query('INSERT INTO personal SET ?', { email:fetched_email, stratup_name:stratup_name,product_name:product_name,startup_web:startup_web,fr_date:fr_date,flexRadioDefault:flexRadioDefault,comp_address:comp_address,state,district:state,district,city:city,businesss_model:businesss_model,firm_type:firm_type,startup_sector:startup_sector,
        technology:technology,startup_desc:startup_desc,other:other,team_size:team_size,awards:awards,hear_about_us:hear_about_us,flexRadioDefault1:flexRadioDefault1,acc_name:acc_name,acc_no:acc_no,bank_name:bank_name,IFSC:IFSC,branch:branch},function(err, result)      
    {                                                         
  if (err)

     throw err;
    });
   
    });


}); 




app.post('/team', function(request,response) {
    console.log('req.body');
    console.log(request.body);
     const {name,Designation,rw_experience,Qualification,found_name,found_designation,found_contact,found_email,found_linkedin} = request.body;

    dbConnection.execute("SELECT email FROM `users` WHERE `id`=?",[request.session.userID])
    .then(([rows]) => {
        global.fetched_email;
            fetched_email =rows[0].email
           // console.log(fetched_email);
        

     
    db.query('INSERT INTO team SET ?', {email :fetched_email,name:name,Designation:Designation,rw_experience:rw_experience,Qualification:Qualification,found_name:found_name,found_designation:found_designation,found_contact:found_contact,found_email:found_email,found_linkedin:found_linkedin},function(err, result)      
    {                                                         
  if (err)

     throw err;
    });
   
    });


}); 










// LOGOUT
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});

// END OF LOGOUT
app.use('/', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});



app.listen(3021, () => console.log("Server is Running..."));