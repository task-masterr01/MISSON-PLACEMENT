import React from 'react'
import Header from '../components/Header'
import StudentCard from '../components/studentCard'
import students from '../data/students'

const Home = () => {
  return (
    <div>
        <Header />
        <h1 className='text-white'> this is home page</h1>
        <div className="mt-10 border-t border-white pt-5">
        <h2 className="text-xl mb-4 text-center">--- Students Data Global View ---</h2>
        
      </div>
        <StudentCard data={students} />
    </div>
  )
}

export default Home