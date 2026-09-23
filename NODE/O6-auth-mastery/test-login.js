fetch('http://localhost:5002/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "hemant@test.com",
        password: "mysecretpassword123" 
    })
})
.then(res => res.json())
.then(data => console.log("Server Response:", data))
.catch(err => console.error("Error:", err));