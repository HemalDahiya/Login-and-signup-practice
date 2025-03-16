function CreateUser()
{
    // Assuming you have form data in JavaScript variables
const formData = {
    email: document.getElementById('email').value,
    name: document.getElementById('name').value,
    password: document.getElementById('password').value,
    address: document.getElementById('address').value,
    salary: document.getElementById('salary').value,

    // Add other form fields here
};


if((formData.password === (document.getElementById('confirm-password').value)) && (formData.email!="") && (formData.password!="") &&(formData.name!="") )
{
    // Example of using fetch to make a POST request
fetch('/submit-user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // or 'application/x-www-form-urlencoded', depending on backend expectations
    },
    body: JSON.stringify(formData), // convert formData to JSON string
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); // assu
}) // assuming the server returns JSON
.then(data => {
    //console.log('Success:', data);
    alert("Data succesfully handled by backend and gave success response.");
    window.location.href = '/';//redirect to login page
    // Handle the response data here
})
.catch((error) => {
    console.log('Error:', error);
    // Handle errors here
});
}
else
{
    alert("Both the passwords need to be the same!! and the email, password and name cannot be empty.");
}

}