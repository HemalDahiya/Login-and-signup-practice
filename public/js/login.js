
  const inputField = document.getElementById('password');
  const image = document.getElementById('image');

  inputField.addEventListener('focus', function() {
    // image.src = "../public/images/eyes covered emoji.jpg"; // Change to focused image
    image.src = "../images/eyes covered emoji.jpg"; // Change to focused image
  });

  inputField.addEventListener('blur', function() {
    image.src = '../images/smiling emoji.jpg'; // Change back to default image
  });

  inputField.addEventListener('input', function() {
    image.style.transform = 'scale(1.2)'; // Example: scaling the image on input
  });

  inputField.addEventListener('change', function() {
    image.style.transform = 'scale(1)'; // Reset transform when input is changed
  });


  function Signin()
  {
    let password= document.getElementById('password').value;
    let email= document.getElementById('email').value;
    
    if(password.trim()==="" || email.trim()==="")
    {
      alert("Both password and email must be present");
    }
    else{
      const credentials={
        Password:password.trim(),
        Email:email.trim()
      }
      
      fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // or 'application/x-www-form-urlencoded', depending on backend expectations
        },
        body: JSON.stringify(credentials), // convert formData to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //return response.json();
        return response.text(); // assu
    }) 
    .then(html => {
        //console.log('Success:', data);
        alert("Data succesfully handled by backend and gave success response.");
        console.log(html);
        document.open();
       document.write(html);
       document.close();
    })
    .catch((error) => {
        
        alert("error occored");
        console.log(error);
    });
    }

  }
