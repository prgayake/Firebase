const express =require('express');
const router = express.Router();




router.get('/register',(req,res) =>{
    res.render('register',{message:''})
});

router.get('/home',(req,res) =>{
    res.render('home')
});




router.get('/index',(req,res) =>{
    res.render('index')
});

router.get('/login-register',(req,res) =>{
    res.render('login-register',{sucess:''})
});





module.exports =router;
