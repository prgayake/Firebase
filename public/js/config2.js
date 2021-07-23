 var  username = document.getElementById('username').textContent;
    
                   var firebaseConfig = {
                projectId: "ecellweb-5bc04",
                storageBucket: "ecellweb-5bc04.appspot.com"
              }; 

              firebase.initializeApp(firebaseConfig);
      
            var db = firebase.database().ref();
      db.child('finance').child(username).on('value',snap1 => {
        db.child('Basic').child(username).on('value',snap2 => {
            db.child('Businessmodel').child(username).on('value',snap3 => {
                db.child('Team').child(username).on('value',snap4 => {
                    db.child('IpForm').child(username).on('value',snap5 => {
                        db.child('UploadDocDeatils').child(username).on('value',snap6 =>{
                           if(snap2.exists() && snap1.exists() && snap3.exists() && snap4.exists() && snap5.exists() && snap6.exists()){
                            
                            document.getElementById('getform').href ='/viewform'
                            }
          
                 
                        })
                      })
                    })
                })
            })
        })