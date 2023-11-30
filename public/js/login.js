const hideAlert = () => {

  // After 5 sec this div will be hidden
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);

};

// type is either 'sucess' or 'error'
const showAlert = (type , msg) => {

  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  // So, after 5 secs this div will be hide.
  window.setTimeout(hideAlert, 5000);
}

const loginBttn = document.querySelector('.form--login');

const login = async (email , password) => {

  try {
    
    const result = await axios({

      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      
      // Sending data 
      data : {
        email,
        password
      }
  });

  if (result.data.status === 'success') {


    showAlert ('success' , 'Logged in successfully!');
     
     window.setTimeout(() => {

        location.assign ('/')
     } , 1500)
  }

  } catch (err){
      
       showAlert ('error' , err.response.data.message);
  } 
}


if (loginBttn) {

  loginBttn.addEventListener('submit' , e => {

    e.preventDefault();
    const email = document.getElementById('email').value;
  
    const password = document.getElementById('password').value;
  
    login (email , password);
  
  });
  
}

// --------------------------- Logout Button Handling --------------------------

const logout = async () => {

    try {

      const result = await axios({

        method: 'GET',
        url: 'http://127.0.0.1:3000/api/v1/users/logout',
        
      });
      
      
      // So, after logging out it reloads the page.
      if (result.data.status === 'success') {
         
        console.log("hello reload");
         location.reload(true);
      
      }

    } catch (err) {
        
        showAlert ('error' , 'Error in logging out! try again.');
    }
}

const logoutBttn = document.querySelector('.nav__el--logout');

if (logoutBttn) {
  
  logoutBttn.addEventListener('click' , logout);

}


const sections = document.querySelectorAll('.animate__animated');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate__slideInDown');
      observer.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.5,
});

sections.forEach((section) => {
  observer.observe(section);
});

// -------------- SignIn with Google -----------------

function onSignIn(googleUser) {

  console.log("Hello")
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

