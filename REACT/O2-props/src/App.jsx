import './App.css'
import Users from './components/Users'
import  { useState, useEffect } from 'react';


function App() {
  const [usersData, setUsersData] = useState([])
    const fetchUsers = async ()=>{try {
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      
      // DummyJSON stores the array under the 'users' property
      setUsersData(data.users); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    }
    useEffect(() => {
      fetchUsers();
    }, [])
  return (
    <>
      <Users data={usersData}/>
    </>
  )
}

export default App
