const express =require('express');
const mysql =require('mysql')
const router = express.Router();



const db = mysql.createConnection({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root',        // MYSQL USERNAME
    password : '',    // MYSQL PASSWORD
    database : 'test' ,     // MYSQL DB NAME
    port :  3360

});

router.get('/register',(req,res) =>{
    res.render('register')
});

router.get('/startup',(req,res) =>{
    res.render('startup')
});


router.get('/team',(req,res) =>{
    res.render('team')
});

router.get('/index',(req,res) =>{
    res.render('index')
});

router.get('/login-register',(req,res) =>{
    res.render('login-register')
});

router.get('/main3',(req,res) =>{
    res.render('main3')
});






//fetching data from tables 
router.get('/user-list',(req,res) =>{

        console.log('send')
        db.query("SELECT email,stratup_name,state,district,city FROM personal" ,function (err, result1){
            if (err) throw err;
            // if there is no error, you have the result
            
    
            res.render('user-list',{
                result1
            })
    
        });

           
    
});


module.exports =router;
