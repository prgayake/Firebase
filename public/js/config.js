
  var  username = document.getElementById('username').textContent;
    
                 var firebaseConfig = {
                projectId: "ecellweb-5bc04",
                storageBucket: "ecellweb-5bc04.appspot.com"
              }; 

              firebase.initializeApp(firebaseConfig);
              var storageRef = firebase.storage().ref();
             
            storageRef.child('images/'+username).getDownloadURL()
            .then((url) => {
                console.log(url)
            
            document.getElementById('myImageID').src=url;
            });
            
            var db = firebase.database().ref();
            const query = db.child('userdetails').child(username).on('value',snap =>{
                console.log(snap.val())
                 document.getElementById('linkedin1').href =snap.val().Linkedin;
                 document.getElementById('fb').href =snap.val().Facebook;
                 document.getElementById('insta').href =snap.val().Instagram;
                 document.getElementById('Awards').textContent =snap.val().Awards;
                 document.getElementById('skill').textContent =snap.val().skill;   
                 document.getElementById('portfolio').textContent =snap.val().Portfolio;
                 document.getElementById('portfolio1').textContent =snap.val().Portfolio;

            })