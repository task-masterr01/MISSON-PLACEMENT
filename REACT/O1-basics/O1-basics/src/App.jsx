import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

function App() {
  
  return (
    <div>
        <h2 className='font-bold '>Fetch users data</h2>
        {
          usersData.map((users)=>(
            <ul className='flex justify-evenly py-4'>
              <li className=' p-2 py-3' >name:  {users.firstName}</li>
              <li className='size-4 p-2 py-3' >surname:{users.lastName}</li>
              <li className='size-4 p-2 py-3' >age:{users.age}</li>
            </ul>
          ))
        }
    </div>
  )
}

export default App
