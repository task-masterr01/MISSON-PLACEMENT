async function testAuthFlow() {
    console.log("1. Logging in...");
    
    // Hit the login route
    const loginRes = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: "hemant@test.com",
            password: "mysecretpassword123"
        })
    });
    
    const loginData = await loginRes.json();
    
    if (!loginData.token) {
        console.log("Login failed. No token received.");
        return;
    }
    
    const realToken = loginData.token;
    console.log("2. Got the real token:", realToken.substring(0, 20) + "...");

    console.log("3. Accessing Dashboard with real token...");
    
    // Hit the dashboard
    // route WITH the real token
    const dashRes = await fetch('http://localhost:5002/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${realToken}`
        }
    });
    
    const dashData = await dashRes.json();
    console.log("4. Dashboard Response:", dashData);
}

testAuthFlow();