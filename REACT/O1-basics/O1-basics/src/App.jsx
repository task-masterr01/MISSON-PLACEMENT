import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

function App() {
  const [usersData, setUsersData] = useState([])
  useEffect(() => {
    getUsersData();
  }, [])
  
  async function getUsersData(){
    const url = "https://dummyjson.com/users";
     let res = await fetch(url);
     res = await res.json();
     setUsersData(res.users);
  }
  
  
  return (
    <div>
       <h1>hello users data hear</h1>
       {
        usersData.map((users)=>(
          <ul>
            <li>{users.firstName}</li>
          </ul>
        ))
       }
    </div>
  )
}

export default App
