const express =require('express');
const firebase = require('firebase');
const cookieParser =require('cookie-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const path = require('path');
    const fs = require('fs')




// APPLY COOKIE SESSION MIDDLEWARE starts
    router.use(cookieSession({
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


    router.get('/',ifNotLoggedin,(req,res) =>{
        res.redirect('/home')
    });

    router.get('/forgetpass',(req,res) =>{
    res.render('forgetpass')
    });




      router.get('/home', ifNotLoggedin, (req,res,next) => 
              {   const db = firebase.database().ref();

                  const query = db.child('users').child(req.session.username).on('value',snap =>{
                  res.render('home',{
                  name:snap.val().Name, 
                  email:snap.val().Email

                     });
                  }); 
              });
//Get Routes(restricted Pages) end

router.get('/register',(req,res) =>{
    res.render('register',{message:''})
});

router.get('/upload',(req,res,next) =>{
        const db = firebase.database().ref();
        db.child('finance').on('value',function(snap){
        db.child('users').orderByChild('Email').on('value',function(snapshot){
            data =snapshot;
            result =snap
              res.render('upload',{data:data,result:result})
        });

});

});





router.get('/index',(req,res) =>{
    res.render('index')
});

router.get('/login-register',(req,res) =>{
    res.render('login-register',{message:''})
});



      //Basic route
      router.get('/startup',ifNotLoggedin,(req,res) =>{
                   res.render('startup')
            });

          //view basic form rpute
          router.get('/viewbasic',ifNotLoggedin,(req,res) =>{
                  const db = firebase.database().ref();
                 const query = db.child('Basic').child(req.session.username).on('value',snap =>{
                   if (snap.exists()) {
                    res.render('./viewforms/viewbasic',{
                   product_name:snap.val().product_name,startup_name:snap.val().startup_name,Website:snap.val().Website , Firm_date  :snap.val().Firm_date  ,Register_place :snap.val().Register_place ,Company_Address :snap.val().Company_Address,  
                    State  :snap.val().State,district :snap.val().district ,  city :snap.val().city ,  Businessmodel:snap.val().Businessmodel,  firm_type  :snap.val().firm_type  ,Registration_no :snap.val().Registration_no , startup_sector :snap.val().startup_sector,  
                    technology :snap.val().technology ,  startup_descrption : snap.val().startup_descrption,  other :snap.val().other ,   team_size  : snap.val().team_size , startup_awards :snap.val().startup_awards ,   Social :snap.val().Social   ,  
                      Incubator_name :snap.val().Incubator_name ,accont_name :snap.val().accont_name  , accont_no :snap.val().accont_no , bank_name  :snap.val().bank_name  ,IFSC   :snap.val().IFSC   ,Branch :snap.val(). Branch                    })
                  }else{
                    res.render('startup')
                  }
                  
                  });
                
              });

          //view Business model form

      router.get('/viewbusiness',ifNotLoggedin,(req,res) =>{
                  const db = firebase.database().ref();
                 const query = db.child('Businessmodel').child(req.session.username).on('value',snap =>{
                  if (snap.exists()) {
                    res.render('./viewforms/viewbusiness',{
                    stp_curr_stage:snap.val().stp_curr_stage,uniqueness_factor:snap.val().uniqueness_factor,   key_partners:snap.val().key_partners  ,cost_structure:snap.val().cost_structure,  
                    Revenue_inflow:snap.val().Revenue_inflow,Customer_Segment :snap.val().Customer_Segment,  Key_Matrix:snap.val().Key_Matrix,  
                    Channels  :snap.val().Channels,Unique_Value :snap.val().Unique_Value  

                  });
                  }else{
                    res.render('Businessmodel')
                  }
                  
                
                });
              })


           // view Finanace Form
                     router.get('/viewfinance',ifNotLoggedin,(req,res) =>{
                  const db = firebase.database().ref();
                 const query = db.child('finance').child(req.session.username).on('value',snap =>{

                   if (snap.exists()) {
                    console.log(snap.val())
                    res.render('./viewforms/viewfinance',{
                      MaxTurnover: snap.val().MaxTurnover,currentFunding :snap.val().currentFunding,TotalFund:snap.val().TotalFund,
                      FinancialYear: snap.val().FinancialYear,AuditedFn:snap.val().AuditedFn
                  
                  })
                  }else{
                    res.render('finance')
                  }
                  
                  });
                
              });

          // view IP Form
                     router.get('/viewip',ifNotLoggedin,(req,res) =>{
                  const db = firebase.database().ref();
                 const query = db.child('IpFrom').child(req.session.username).on('value',snap =>{

                   if (snap.exists()) {  
                    res.render('./viewforms/viewip',{
                                Product_name:snap.val().Product_name,
                                  IP_Description:snap.val().IP_Description,
                                  IP_No:snap.val().IP_No,
                                  country:snap.val().country,
                                  IP_validity:snap.val().IP_validity,

                     
                  })
                  }else{
                    res.render('finance')
                  }
                  
                  });
                
              });

                     //view team form
            router.get('/viewteam',ifNotLoggedin,(req,res) =>{
                 const db = firebase.database().ref();
                 const query = db.child('Team').child(req.session.username).on('value',snap =>{

                   if (snap.exists()) {  
                    res.render('./viewforms/viewteam',{
                       NamesOfMembers:snap.val().NamesOfMembers,Designation: snap.val().Designation,Adhar_No: snap.val().Adhar_No,Profile_info:snap.val().Profile_info,
                        Relevant_Work_Experience:snap.val().Relevant_Work_Experience,Qualification: snap.val().Qualification, founderName: snap.val().founderName,founderDesignation:snap.val().founderDesignation,
                        DIN_Number: snap.val().DIN_Number,founderContact:snap.val().founderContact,founderEmail:snap.val().founderEmail,founderLinkedin:snap.val().founderLinkedin
                          })
                  }else{
                    res.render('finance')
                  }
                  
                  });
                
              });
    

        //personal Route
      router.get('/personal',ifNotLoggedin,(req,res) =>{
            const db = firebase.database().ref();
            const query = db.child('users').child(req.session.username).on('value',snap =>{
                          res.render('personal',{
                          name:snap.val().Name, 
                          email:snap.val().Email,
                          Mobile:snap.val().Mobile,
                          Role:snap.val().Role,
                          Username:snap.val().Username

                          });
                
                        }); 
            });
         
               router.get('/viewpersonal',ifNotLoggedin,(req,res) =>{
            const db = firebase.database().ref();
            const query = db.child('users').child(req.session.username).on('value',snap =>{
                          res.render('./viewforms/viewpersonal',{
                          name:snap.val().Name, 
                          email:snap.val().Email,
                          Mobile:snap.val().Mobile,
                          Role:snap.val().Role,
                          Username:snap.val().Username

                          });
                
                        }); 
            });
         
        //team Route
      router.get('/team',ifNotLoggedin,(req,res) =>{
                  res.render('team')
              });
                
                //edit  profile route
      router.get('/profile2',ifNotLoggedin,(req,res) =>{
            const db = firebase.database().ref();
            
            const query = db.child('users').child(req.session.username).on('value',snap =>{
              res.render('profile2',{
                Name:snap.val().Name,
                 Username:snap.val().Username,
                  })

              });
        });

        //upload form route

      router.get('/Upload_form',ifNotLoggedin,(req,res) =>{
            res.render('Upload_form')
              });

        //Businessmodel route
      router.get('/Businessmodel',ifNotLoggedin,(req,res) =>{
            res.render('Businessmodel')
              });
        //finance route
      router.get('/finance',ifNotLoggedin,(req,res) =>{
          res.render('finance')
              });

          //ip_form route
      router.get('/ip_form',ifNotLoggedin,(req,res) =>{
            res.render('ip_form')
              });

          //profile route
      router.get('/profile',ifNotLoggedin,(req,res) =>{
            const db = firebase.database().ref();
            const query = db.child('userdetails').child(req.session.username).on('value',snapshot =>{
            const query = db.child('users').child(req.session.username).on('value',snap =>{
                  res.render('profile',{
                    Name:snap.val().Name,
                    Email:snap.val().Email,
                    Mobile:snap.val().Mobile,
                    Username:snap.val().Username,
                    Role:snap.val().Role,
                    
                    


                    })
                });
          });
          });



        router.get('/admin_incubatee',(req, res)=>{
            var children = firebase.database().ref('users').orderByChild('Role').equalTo('Incubiator').once("value", (snapshot) => {
                const count = snapshot.numChildren();
                console.log(count);

   
            res.render('./admin/admin_incubatee',{count:count});
        })

 })



module.exports =router;
