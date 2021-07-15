const express = require('express');
const firebase = require('firebase');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const path = require('path');
const fs = require('fs')
// APPLY COOKIE SESSION MIDDLEWARE starts
router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 3600 * 1000 // 1hr
}));
// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('index');
    }
    next();
}
const ifLoggedin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        console.log(req.session.isLoggedIn)
          const db = firebase.database().ref();
     const query = db.child('users').child(req.session.username).get().then((snap) => {
        if(snap.val().Role == 'Incubiator')
        {
         res.redirect('/incubateehome')   
        }
        else if(snap.val().Role == 'Admin'){
                    res.redirect('/admin');
                }
        else{
            res.redirect('/ecellhome')
        }
    
    });
    }
    next();
}

 function requireLogin (req, res, next) {
    const db = firebase.database().ref();
    db.child('Admin').once('value', function(snap) {

    if (req.session.username ==snap.val().Username) {
      next();
    }else if (!req.session.isLoggedIn) {
        res.redirect('/login-register')
    }
    else {  
     res.statusCode = 401;
        res.send('<strong>Unauthorized Request Please click here <a href="/home" title=""><button> Home</button></a></strong>');      

    }
    });
  };



//view basic form rpute
router.get('/viewbasic', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('Basic').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            res.render('./viewforms/viewbasic', {
                Username: req.session.username,
                product_name: snap.val().product_name,
                startup_name: snap.val().startup_name,
                Website: snap.val().Website,
                Firm_date: snap.val().Firm_date,
                Register_place: snap.val().Register_place,
                Company_Address: snap.val().Company_Address,
                State: snap.val().State,
                district: snap.val().district,
                city: snap.val().city,
                Businessmodel: snap.val().Businessmodel,
                firm_type: snap.val().firm_type,
                Registration_no: snap.val().Registration_no,
                startup_sector: snap.val().startup_sector,
                technology: snap.val().technology,
                startup_descrption: snap.val().startup_descrption,
                other: snap.val().other,
                team_size: snap.val().team_size,
                startup_awards: snap.val().startup_awards,
                Social: snap.val().Social,
                Incubator_name: snap.val().Incubator_name,
                accont_name: snap.val().accont_name,
                accont_no: snap.val().accont_no,
                bank_name: snap.val().bank_name,
                IFSC: snap.val().IFSC,
                Branch: snap.val().Branch
            })
        } else {
            res.render('startup', {
                Username: req.session.username
            })
        }
    });
});

//view Business model form
router.get('/viewbusiness', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('Businessmodel').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            res.render('./viewforms/viewbusiness', {
                Username: req.session.username,
                stp_curr_stage: snap.val().stp_curr_stage,
                uniqueness_factor: snap.val().uniqueness_factor,
                key_partners: snap.val().key_partners,
                cost_structure: snap.val().cost_structure,
                Revenue_inflow: snap.val().Revenue_inflow,
                Customer_Segment: snap.val().Customer_Segment,
                Key_Matrix: snap.val().Key_Matrix,
                Channels: snap.val().Channels,
                Unique_Value: snap.val().Unique_Value
            });
        } else {
            res.render('Businessmodel', {
                Username: req.session.username
            })
        }
    });
})
// view Finanace Form
router.get('/viewfinance', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('finance').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            console.log(snap.val())
            res.render('./viewforms/viewfinance', {
                MaxTurnover: snap.val().MaxTurnover,
                currentFunding: snap.val().currentFunding,
                TotalFund: snap.val().TotalFund,
                FinancialYear: snap.val().FinancialYear,
                AuditedFn: snap.val().AuditedFn
            })
        } else {
            res.render('finance', {
                Username: req.session.username
            })
        }
    });
});
// view IP Form
router.get('/viewip', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('IpForm').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            res.render('./viewforms/viewip', {
                Username: req.session.username,
                Product_name: snap.val().Product_name,
                IP_Description: snap.val().IP_Description,
                IP_No: snap.val().IP_No,
                country: snap.val().country,
                IP_validity: snap.val().IP_validity,
            })
        } else {
            res.render('ip_form', {
                Username: req.session.username
            })
        }
    });
});
//view team form
router.get('/viewteam', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('Team').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            res.render('./viewforms/viewteam', {
                Username: req.session.username,
                NamesOfMembers: snap.val().NamesOfMembers,
                Designation: snap.val().Designation,
                Adhar_No: snap.val().Adhar_No,
                Profile_info: snap.val().Profile_info,
                Relevant_Work_Experience: snap.val().Relevant_Work_Experience,
                Qualification: snap.val().Qualification,
                founderName: snap.val().founderName,
                founderDesignation: snap.val().founderDesignation,
                DIN_Number: snap.val().DIN_Number,
                founderContact: snap.val().founderContact,
                founderEmail: snap.val().founderEmail,
                founderLinkedin: snap.val().founderLinkedin
            })
        } else {
            res.render('team', {
                Username: req.session.username
            })
        }
    });
});
router.get('/viewpersonal', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('users').child(req.session.username).on('value', snap => {
        res.render('./viewforms/viewpersonal', {
            Username: req.session.username,
            name: snap.val().Name,
            email: snap.val().Email,
            Mobile: snap.val().Mobile,
            Role: snap.val().Role,
            Username: snap.val().Username
        });
    });
});


router.get('/viewuploads',(req, res) => {
    const db = firebase.database().ref();
    const query = db.child('UploadDocDeatils').child(req.session.username).on('value', snap => {
        if (snap.exists()) {
            res.render('./viewforms/viewuploads', {
                Username: req.session.username,
                
                cmpid:snap.val().CompanyRegID,
                adhar:snap.val().UdyogAdhar,
                pan:snap.val().PancardNo,
                gst:snap.val().companyGSTIN
            });
        } else {
            res.render('Upload_form', {
                Username: req.session.username
            })
        }
    });
});

module.exports = router;