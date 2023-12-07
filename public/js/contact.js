const Contact = async (messageDetails) => {
  
    try {

      const result = await axios({
  
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/contact',
        
        // Sending data 
        data : {

          name : messageDetails.name,   
          email : messageDetails.email,
          message : messageDetails.message,

        }
    });
  
    if (result.data.status === 'success') {

      showAlert ('success' , 'Message Sent Successfully!');
       
       window.setTimeout(() => {
  
          location.assign ('/')
       } , 1500)
    }

  
    } catch (err){
        
         showAlert ('error' , err.response.data.message);
    } 
  }




document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
  
    // Just a sample output for demonstration purposes (won't actually send an email)
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
  
    // Show success message (replace this with actual submission logic)
    document.getElementById('successMessage').classList.remove('hidden');
    // Reset the form
    document.getElementById('contactForm').reset();

    Contact ({name , email , message});

  });
  