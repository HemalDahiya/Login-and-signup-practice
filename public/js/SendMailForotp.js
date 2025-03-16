function SendEmail() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value;
    console.log(emailValue);

    fetch('/SendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue }), // Send the email value in the request body
    })
    .then(response => {
        if (!response.ok) {
            // Check for HTTP errors
            return response.json().then(errorData => {
                const errorMessage = errorData.error || 'Failed to send email';
                if (response.status === 404) {
                    throw new Error(errorMessage);
                } else {
                    throw new Error(errorMessage);
                }
            });
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        console.log('Success:', data);
        alert('Email sent successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
}
