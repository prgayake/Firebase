const express =require('express');
const firebase = require('firebase');
const cookieParser =require('cookie-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
    const archiver =  require('archiver');

const multer = require('multer');
    const fs = require('fs')



//Firebase Configuration Starts !!!
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTHDOMAIN,
      databaseURL: process.env.DBURL,
      projectId: process.env.PROJECT_ID,
      storageBucket:process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGESENDER,
      appId:process.env.APPID
    };

        
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();
    var user = firebase.auth().currentUser;

//Firebase Configuration Ends !!!

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



  





         //Login page Post Request
          router.post( '/login-register', ifLoggedin, (req, res) => {
                var username = req.body.username;
                var pass = req.body.user_pass;
               
                const db = firebase.database().ref();
                const query = db.child('users').child(username).get().then((snap) => {
              
                    if (snap.val().Username==username) 
                      {
                            firebase.auth().signInWithEmailAndPassword(snap.val().Email, pass).then(() => {

                                  req.session.isLoggedIn = true;
                                  req.session.username = snap.val().Username;
                                  console.log(snap.val().Role)
                                  

                          
                                 
                            }).then(function (usr) {
                                                      
                                              

                                                    }).catch(function (err) {
                                                             console.log("");
                                                 res.render('login-register',{message:'Invalid username or Password'});

                                                      });
                                                  }

                                   if (snap.emailVerified) {
                                    if(snap.val().Role =='Incubiator' ){


                                    res.redirect('/personal');

                                  }else{
                                    res.redirect('/');

                            
                                //end
                                  }
                                  
                                  // mkdir manully
                                       
                                  }
                                  else {
                                    user.sendEmailVerification().then(function(){
                                          console.log("email verification sent to user");
                                        });
                                    console.log('Email is not verified');
                                    res.render('login-register',{message:'Please Verify Email'})
                                  }
                              


                                  }).catch((error) => {
                                    console.error(error);
                                  });




                                  
                                    

                    
                     
                     
                 
            });


          // Resgister Page Post Request
          router.post('/register', ifLoggedin,(req,res,next) => {
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

                              
                            res.render('login-register',{message:'Account Created Successfully'})
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

          // Team Page Post Request
          router.post('/team', function(req,res) {
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
                              {  throw err;}
                            else{
                                res.redirect('/ip_form')
                              }
                            });

              }); 
         //-------------------------------------------------Basics-------Inserting Details---------------

          router.post('/startup', function(req,res) {
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
                              {
                              throw err;}
                              else{
                                res.redirect('/team')
                              }
                              });

            });

                  router.post('/Businessmodel', function(req,res) {
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
                                  if (err){
                                  throw err;}
                                   else{
                                res.redirect('/finance')
                              }

                                });

            }); 

				 router.post('/finance', function(req,res) {
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
                                  { if (err){
                                  throw err;}
                                   else{
                                res.redirect('/upload_forms')
                                   }
                                  });

          }); 


			          // IP Form Post Request
          
        router.post('/ip_form', function(req,res) {
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
                                      {  throw err;}
                                    else{
                                res.redirect('/Businessmodel')
                              }
                                  });

              }); 

			router.post('/profile2', function(req,res) {
	              console.log('req.body');
	  
	              const db = firebase.database().ref();

	                      firebase.database().ref('userdetails/'+req.session.username).set({
	                                  Linkedin: req.body.Linkedin,
	                                  Facebook : req.body.facebook,
	                                  Instagram :req.body.Instagram,
	                                  Portfolio:req.body.Portfolio,
	                                  Awards:req.body.Awards,
	                                  skill:req.body.skills 
	                                 
                                                                     
	                                }
                                  ,function(err, result)      
	                                  {                                                         
	                                    if (err){
	                                        throw err;
                                        }
                                        else{
                                          res.redirect('/profile')
                                        }
	                                  });
                                 

              }); 

			//upload forms 
			const storage =multer.diskStorage({
                  destination: (req,file,cb)=>{
                    cb(null,'uploads/upload_forms/'+req.session.username);
                  },
                  filename:(req,file,cb) =>{
                    cb(null,file.originalname)
                  }

                })
              

                const upload =multer({storage});
                router.post('/Upload_form', upload.array('media'),function(req,res) {  

                    var output = fs.createWriteStream('./uploads/'+req.session.username+'.zip');
                    var archive = archiver('zip');

                    output.on('close', function () {
                        console.log(archive.pointer() + ' total bytes');
                        console.log('archiver has been finalized and the output file descriptor has closed.');
                    });

                    archive.on('error', function(err){
                        throw err;
                    });

                   var temp= archive.pipe(output);

                    // append files from a sub-directory, putting its contents at the root of archive
                    archive.directory('./uploads/upload_forms/'+req.session.username, false);
                    archive.finalize();
                   
                   

              }); 


//forget Password
              router.post('/forgetpass', (req,res,next) => {
            
                var emailres = req.body.emailreset;

                if(emailres !="")
                {
                  firebase.auth().sendPasswordResetEmail(emailres)
                  .then(() => {
                    console.log("email sent")

                  })
                  .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                 

                     console.log(errorCode);
                     console.log(errorMessage);

                    console.log("Message :" + errorMessage)


                  });
                }
                else
                {
                  console.log("Please type email")
                }
              });



module.exports =router;
