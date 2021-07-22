const express = require('express');
const firebase = require('firebase');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra')

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

    if(req.session.username !=snap.val().Username || !req.session.isLoggedIn){
       res.statusCode = 401;
        res.send('<strong>Unauthorized Request Please click here <a href="/" title=""><button> Home</button></a></strong>');      

    }

     if(req.session.username ==snap.val().Username && req.session.isLoggedIn==true){
      next();
        }
    });
  };

    
//APPLY COOKIE SESSION MIDDLEWARE  End
router.get('/', ifNotLoggedin, (req, res) => {
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
})



router.get('/ecellhome', ifNotLoggedin, (req, res, next) => {
    const db = firebase.database().ref();
    const query = db.child('users').child(req.session.username).on('value', snap => {
        res.render('ecellhome', {
            name: snap.val().Name,
            email: snap.val().Email
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        message: ''
    })
});

router.get('/index', (req, res) => {
    res.render('index')
});
router.get('/login-register', (req, res) => {
    res.render('login-register', {
        message: ''
    })
});

router.get('/forgetpass', (req, res) => {
    res.render('forgetpass',{message: ''})
});



router.get('/incubateehome', ifNotLoggedin, (req, res, next) => {
    const db = firebase.database().ref();
    const query = db.child('users').child(req.session.username).on('value', snap => {
        res.render('incubateehome', {
            name: snap.val().Name,
            email: snap.val().Email
        });
    });
});
router.get('/incubateehome',(req, res) => {
    
    res.render('incubateehome', {
    })
});
router.get('/ecellhome',(req, res) => {
    res.render('ecellhome', {
        
    }) 
});

router.get('/joinIncubatee',(req,res)=>{
      const db = firebase.database().ref();
      db.child('users').child(req.session.username).update({'Role':'Incubiator' })
      res.redirect('/personal')
})

//personal Route
router.get('/personal', ifNotLoggedin, (req, res) => {
      const db = firebase.database().ref();
                db.child('users').child(req.session.username).on('value', function(snap) {
                    dirPath = `./uploads/upload_forms/` + snap.val().Username;

                    fs.access(dirPath, (err) => {
                        if (err) {
                            // Create directory if directory does not exist.
                            fs.mkdir(dirPath, { recursive: true }, (err) => {
                                if (err) console.log(`Error creating directory: ${err}`)
                                else {


                                    console.log('Directory created successfully.')
                                }
                            })
                        }
                        
                    })
                })
    const query = db.child('users').child(req.session.username).on('value', snap => {
        res.render('personal', {
            name: snap.val().Name,
            email: snap.val().Email,
            Mobile: snap.val().Mobile,
            Role: snap.val().Role,
            Username: snap.val().Username
        });
    });
});



//Basic route
router.get('/startup', ifNotLoggedin, (req, res) => {
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

//team Route
router.get('/team', ifNotLoggedin, (req, res) => {
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
//Businessmodel route
router.get('/Businessmodel', ifNotLoggedin, (req, res) => {
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
});
//finance route
router.get('/finance', ifNotLoggedin, (req, res) => {
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
//ip_form route
router.get('/ip_form', ifNotLoggedin, (req, res) => {
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

//upload form route
router.get('/Upload_form', ifNotLoggedin, (req, res) => {


res.render('Upload_form', {
        Username: req.session.username
    })
});


//profile route
router.get('/profile', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('userdetails').child(req.session.username).on('value', snapshot => {
        const query = db.child('users').child(req.session.username).on('value', snap => {
            res.render('profile', {
                Name: snap.val().Name,
                Email: snap.val().Email,
                Mobile: snap.val().Mobile,
                Username: snap.val().Username,
                Role: snap.val().Role,
            })
        });
    });
});

//edit  profile route
router.get('/profile2', ifNotLoggedin, (req, res) => {
    const db = firebase.database().ref();
    const query = db.child('users').child(req.session.username).on('value', snap => {
        res.render('profile2', {
            Name: snap.val().Name,
            Username: snap.val().Username,
        })

    });
});


router.get('/admin_incubatee',requireLogin, (req, res) => {
    const db = firebase.database().ref();
    db.child('finance').on('value', function(snap1) {
        db.child('Basic').on('value', function(snap2) {
            db.child('Businessmodel').on('value', function(snap3) {
                db.child('Team').on('value', function(snap4) {
                    db.child('IpForm').on('value', function(snap5) {
                    db.child('users').orderByChild('Email').on('value', function(snap6) {
                      
                       res.render('./admin/admin_incubatee', {
                            data: snap6,
                            Basic: snap2,
                            Businessmodel: snap3,
                            Team:snap4,
                            IpForm: snap5 , 
                            finance: snap1 
                            
                        })
                    });
                });
            })
        });
    });
    })
})

router.get('/admin_selective',requireLogin, (req, res) => {
    const db = firebase.database().ref();
    db.child('finance').on('value', function(snap1) {
        db.child('Basic').on('value', function(snap2) {
            db.child('Businessmodel').on('value', function(snap3) {
                db.child('Team').on('value', function(snap4) {
                    db.child('IpForm').on('value', function(snap5) {
                    db.child('users').orderByChild('Email').on('value', function(snap6) {
                      
                       res.render('./admin/admin_selective', {
                            data: snap6,
                            Basic: snap2,
                            Businessmodel: snap3,
                            Team:snap4,
                            IpForm: snap5 , 
                            finance: snap1 
                            
                        })
                    });
                });
            })
        });
    });
    })
})

router.get('/admin_ecell',requireLogin, (req, res) => {
    const db = firebase.database().ref();
    db.child('finance').on('value', function(snap) {
        db.child('users').orderByChild('Email').on('value', function(snapshot) {
            data = snapshot;
            result = snap
            res.render('./admin/admin_ecell', {
                data: data,
                result: result
            })
        });
    });
})

router.get('/admin',requireLogin,(req, res)=>{
  var children = firebase.database().ref('users').orderByChild('Role').equalTo('Incubiator').once("value", (snapshot) => {
      const count = snapshot.numChildren();
      console.log("count" + count);

       var children1 = firebase.database().ref('users').orderByChild('Role').equalTo('E-CellMember').once("value", (snapshot1) => {
         const count1 = snapshot1.numChildren();
         console.log("count1" + count1);
         firebase.database().ref('users').orderByChild('Role').once("value", (snapshot2) => {
                                     
       
 })
                                var d = new Date()
                                var n = d.getFullYear()
                                var ctr =0
                                var ctr1  =0
                                var ctr2 =0
                                var ctr3 =0
                                var n1=n-1
                                var n2=n-2
                                var n3=n-3
                               snapshot.forEach(function(snapshot){
                               if(snapshot.val().Date== n){
                                 ctr= ctr+1 }
                               if(snapshot.val().Date== n1){
                                ctr1= ctr1+1 }
                                if(snapshot.val().Date== n2){
                                ctr2= ctr2+1 }
                               if(snapshot.val().Date== n3){
                               ctr3= ctr3+1 }
                               })
                              
                              console.log(ctr)
                               console.log(ctr1)
                                console.log(ctr2)
                               console.log(ctr3)

                               var dn = new Date()
                                var y = dn.getFullYear()
                                var co =0
                                var co1  =0
                                var co2 =0
                                var co3 =0
                                var y1=y-1
                                var y2=y-2
                                var y3=y-3
                               snapshot1.forEach(function(snapshot1){
                               if(snapshot1.val().Date== y){
                                 co= co+1 }
                               if(snapshot.val().Date== y1){
                                co1= co1+1 }
                                if(snapshot.val().Date== y2){
                                co2= co2+1 }
                               if(snapshot.val().Date== y3){
                               co3= co3+1 }
                               })
                              
                                console.log(co)
                                console.log(co1)
                                console.log(co2)
                                console.log(co3)
                               res.render('./admin/admin',{count:count,count1:count1,ctr2:ctr2,ctr:ctr,ctr3:ctr3,ctr1:ctr1,n:n,n1:n1,n2:n2,n3:n3,y:y,y1:y1,y2:y2,y3:y3,co:co,co1:co1,co2:co2,co3:co3});
     })
})

});




router.get('/getfile',(req,res)=>{

       res.download('./uploads/Docs.zip', function(error) {
            if (error) {
                console.log(error);
            }else{


            } 
        })

})

module.exports = router;