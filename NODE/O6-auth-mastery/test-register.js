// This file acts exactly like
// a React frontend sending a request
fetch('http://localhost:5002/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Hemant",
        email: "hemant@test.com",
        password: "mysecretpassword123"
    })
})
.then(res => res.json())
.then(data => console.log("Server Response:", data))
.catch(err => console.error("Error:", err));