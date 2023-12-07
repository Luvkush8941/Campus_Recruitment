const Contact = async (messageDetails) => {
  
    try {

      const result = await axios({
  
        method: 'POST',
        url: '/api/v1/users/contact',
        
        // Sending data 
        data : {

          name : messageDetails.name,   
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
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
  
  
    // Show success message (replace this with actual submission logic)
    document.getElementById('successMessage').classList.remove('hidden');
    // Reset the form
    document.getElementById('contactForm').reset();

    Contact ({name , message});

  });
  
