fetch('http://localhost:5002/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "hemant@test.com",
        password: "mysecretpassword123" // Try changing this to a wrong password later!
    })
})
.then(res => res.json())
.then(data => console.log("Server Response:", data))
.catch(err => console.error("Error:", err));