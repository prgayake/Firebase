const express =require('express');
const router = express.Router();


router.get('/register',(req,res) =>{
    res.render('register')
});

router.get('/startup',(req,res) =>{
    res.render('startup')
});



module.exports =router;