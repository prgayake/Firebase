// Required Packages  !!!!    
    const express = require('express');
    const bodyParser = require("body-parser");
    const path = require('path');
    const cookieParser =require('cookie-parser');
    const cookieSession = require('cookie-session');
    const Swal = require('sweetalert2')
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

//pages and app configuration Ends Here!!


//Firebase Configuration Starts !!!
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTHDOMAIN,
      databaseURL: "https://ecellweb-5bc04-default-rtdb.firebaseio.com",
      projectId: process.env.PROJECT_ID,
      storageBucket: "ecellweb-5bc04.appspot.com",
      messagingSenderId: "964690264257",
      appId: "1:964690264257:web:173c9a962ca4f0c1cb1440"
    };

        
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();
    var user = firebase.auth().currentUser;

//Firebase Configuration Ends !!!



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

      //Basic route
      app.get('/startup',ifNotLoggedin,(req,res) =>{
                   res.render('startup')
            });

          //view basic form rpute
          app.get('/viewbasic',ifNotLoggedin,(req,res) =>{
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

      app.get('/viewbusiness',ifNotLoggedin,(req,res) =>{
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
                     app.get('/viewfinance',ifNotLoggedin,(req,res) =>{
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
                     app.get('/viewip',ifNotLoggedin,(req,res) =>{
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
            app.get('/viewteam',ifNotLoggedin,(req,res) =>{
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
      app.get('/personal',ifNotLoggedin,(req,res) =>{
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
         
               app.get('/viewpersonal',ifNotLoggedin,(req,res) =>{
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
      app.get('/team',ifNotLoggedin,(req,res) =>{
                  res.render('team')
              });
                
                //edit  profile route
      app.get('/profile2',ifNotLoggedin,(req,res) =>{
            const db = firebase.database().ref();
            
            const query = db.child('users').child(req.session.username).on('value',snap =>{
              res.render('profile2',{
                Name:snap.val().Name,
                 Username:snap.val().Username,
                  })

              });
        });

        //upload form route

      app.get('/Upload_form',ifNotLoggedin,(req,res) =>{
            res.render('Upload_form')
              });

        //Businessmodel route
      app.get('/Businessmodel',ifNotLoggedin,(req,res) =>{
            res.render('Businessmodel')
              });
        //finance route
      app.get('/finance',ifNotLoggedin,(req,res) =>{
          res.render('finance')
              });

          //ip_form route
      app.get('/ip_form',ifNotLoggedin,(req,res) =>{
            res.render('ip_form')
              });

          //profile route
      app.get('/profile',ifNotLoggedin,(req,res) =>{
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

      app.get('/', ifNotLoggedin, (req,res,next) => 
              {   const db = firebase.database().ref();

                  const query = db.child('users').child(req.session.username).on('value',snap =>{
                  res.render('home',{
                  name:snap.val().Name, 
                  email:snap.val().Email,
                  sucess:''
                     });
                  }); 
              });
//Get Routes(restricted Pages) end



//Post Pages starts

          // Resgister Page Post Request
          app.post('/register', ifLoggedin,(req,res,next) => {
              var name = req.body.user_name;
              var password = req.body.user_pass;
              var username =req.body.username;
              var email = req.body.user_email;
              var phone  = req.body.phone;
              var role = req.body.role;
              var password =req.body.user_pass;  
              var cpassword =req.body.cuser_pass;

              const db = firebase.database().ref();

              const query = db.child('users').child(username).get().then((snap) => {
                
                if (snap.exists()) {

                        console.log(snap.val());
                        console.log("Email And username Already in use !");
                         res.render('register',{message:'Email /username Already in use !'});
                        }

                else {

                        if(cpassword== password)
                          {      
                               firebase.database().ref('users/'+username).set({
                                  Name:name,
                                  Email: email,
                                  Username:username,
                                  Mobile: phone, 
                                  Role: role,
                                  Password:password
                                });

                           firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, userData){

                           });

                           console.log("data Added")
                         }
                          else{
                              console.log('wrong Pass')
                              res.render('register',{message:'Password and Confirm Password Does not Match'});
                            }

                      }
                      }).catch((error) => {
                        console.error(error);
                      });

            });

          //Login page Post Request
          app.post( '/login-register', ifLoggedin, (req, res) => {
                var username = req.body.username;
                var pass = req.body.user_pass;
               
                const db = firebase.database().ref();
                const query = db.child('users').child(username).get().then((snap) => {
              
                    if (snap.exists()) 
                      {
                            firebase.auth().signInWithEmailAndPassword(snap.val().Email, pass)
                                  req.session.isLoggedIn = true;
                                  req.session.username = snap.val().Username;
                                  if(snap.val().Role=='E-Cell Member'){
                                    res.redirect('/',);
                                  }else{
                                    res.redirect('/personal',);

                                    dirPath = `uploads/upload_forms/`+ snap.val().Username;

                                    fs.access(dirPath,(err)=>{
                                      if (err){
                                        // Create directory if directory does not exist.
                                        fs.mkdir(dirPath, {recursive:true}, (err)=>{
                                          if (err) console.log(`Error creating directory: ${err}`)
                                          else{ 


                                            console.log('Directory created successfully.')}
                                        })
                                      }
                                      // Directory now exists.
                                    })
                                //end
                                  }
                                  
                                  // mkdir manully
                                    

                      } 
                      else 
                      {
                            console.log("");
                             res.render('login-register',{sucess:'Invalid username or Password'});
                             return Promise.reject('Something Wrong!');

                      }
                      }).catch((error) => {
                        console.error(error);
                      });

                 
            });


         //------------------------------------Team -----------------------INserting Deatials--------//


          // Team Page Post Request
          app.post('/team', function(req,res) {
                console.log('req.body');
                console.log(req.body);
              
                const db = firebase.database().ref();

                    firebase.database().ref('Team/'+req.session.username).set({
                        NamesOfMembers:req.body.name,
                        Designation: req.body.Designation,
                       Adhar_No: req.body.Adhar_no,
                      Profile_info:req.body.profile,
                        Relevant_Work_Experience:req.body.rw_experience,
                        Qualification: req.body.Qualification, 
                        founderName: req.body.found_name,
                        founderDesignation:req.body.found_designation,
                        DIN_Number: req.body.found_DIN,
                        founderContact:req.body.found_contact,
                        founderEmail:req.body.found_email,
                        founderLinkedin:req.body.found_linkedin
                      },function(err, result)      
                        {                                                         
                          if (err)
                                throw err;
                            });

              }); 


         //-------------------------------------------------Basics-------Inserting Details---------------

          app.post('/startup', function(req,res) {
              console.log('req.body');
              console.log(req.body);
                const db = firebase.database().ref();
                firebase.database().ref('Basic/'+req.session.username).set({

                                   product_name :req.body.product_name ,
                                   startup_name:req.body.startup_name,
                                   Website:req.body.startup_web , 
                                   Firm_date  :req.body.fr_date ,
                                   Register_place   :req.body.flexRadioDefault   ,
                                   Company_Address :req.body.comp_address,  
                                   State  :req.body.state  ,
                                   district :req.body.district ,  
                                   city :req.body.city ,  
                                   Businessmodel:req.body.businesss_model,  
                                   firm_type  :req.body.firm_type ,
                                   Registration_no :req.body.Registration_no , 
                                   startup_sector :req.body.startup_sector,  
                                   technology :req.body.technology ,  
                                   startup_descrption : req.body.startup_desc,  
                                   other :req.body.other ,   
                                   team_size  : req.body.team_size , 
                                   startup_awards :req.body.awards ,   
                                   Social :req.body.hear_about_us   ,  
                                   Incubator_name :req.body.Incubator_name ,
                                   accont_name :req.body.acc_name  , 
                                   accont_no :req.body.acc_no , 
                                   bank_name  :req.body.bank_name  ,
                                   IFSC   :req.body.IFSC   ,
                                   Branch : req.body.branch  
                           
                          },function(err, result)      
                          {                                                         
                              if (err)

                              throw err;
                              });

            });
//Post Pages Continues  
        app.post('/Businessmodel', function(req,res) {
              console.log('req.body');
              console.log(req.body);

                  const db = firebase.database().ref();
                  firebase.database().ref('Businessmodel/'+req.session.username).set({
                          
                                stp_curr_stage:req.body.stp_curr_stage,
                                uniqueness_factor:req.body.uniqueness_factor,   
                                key_partners:req.body.key_partners  ,
                                cost_structure:req.body.cost_structure,  
                                Revenue_inflow:req.body.Revenue_inflow,
                                Customer_Segment :req.body.Customer_Segment,  
                                Key_Matrix:req.body.Key_Matrix,  
                                Channels  :req.body.Channels,
                                Unique_Value :req.body.Unique_Value  
                              },function(err, result)      
                                {                                                         
                                  if (err)

                                  throw err;
                                });

            }); 


         // Finace Post Request
        app.post('/finance', function(req,res) {
                console.log('req.body');
                console.log(req.body);
                
                const db = firebase.database().ref();
                    firebase.database().ref('finance/'+req.session.username).set({
                                  MaxTurnover: req.body.max_turnover,
                                  currentFunding :req.body.current_funding,
                                  TotalFund:req.body.total_funds,
                                  FinancialYear: req.body.Financial_year,
                                  AuditedFn: req.body.Audited_fn
                                },function(err, result)      
                                  {                                                         
                                    if (err)
                                      throw err;
                                  });

          }); 


          // IP Form Post Request
          
        app.post('/ip_form', function(req,res) {
              console.log('req.body');
              console.log(req.body);
              
                const db = firebase.database().ref();
                      firebase.database().ref('IpFrom/'+req.session.username).set({
                                        
                                  Product_name:req.body.Product_name,
                                  IP_Description:req.body.IP_Description,
                                  IP_No:req.body.IP_No,
                                  country:req.body.country,
                                  IP_validity:req.body.IP_validity,
                                },function(err, result)      
                                  {                                                         
                                    if (err)
                                        throw err;
                                  });

              }); 


        app.post('/profile2', function(req,res) {
              console.log('req.body');
  
              const db = firebase.database().ref();
                      firebase.database().ref('userdetails/'+req.session.username).set({
                                  Linkedin: req.body.Linkedin,
                                  Facebook : req.body.facebook,
                                  Instagram :req.body.Instagram,
                                  Portfolio:req.body.Portfolio,
                                  Awards:req.body.Awards,
                                  skill:req.body.skills  
                                 
                                },function(err, result)      
                                  {                                                         
                                    if (err)
                                        throw err;
                                  });
                                 

              }); 



                const storage =multer.diskStorage({
                  destination: (req,file,cb)=>{
                    cb(null,dirPath);
                  },
                  filename:(req,file,cb) =>{
                    cb(null,file.originalname)
                  }

                })
              

                const upload =multer({storage});
                app.post('/Upload_form', upload.array('media'),function(req,res) {  
                    return res.json({status:'ok'})
              }); 


//All Post Request Ends here !!!!!



//logout Request
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('index');
});

app.listen(3020, () => console.log("Server is Running...3020"));


