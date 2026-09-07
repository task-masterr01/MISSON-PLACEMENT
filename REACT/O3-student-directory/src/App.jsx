import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
// import StudentCard from './components/studentCard';
import students from './data/students';
import StudentCard from './components/studentCard';

const App = () => {
  let x =20;
  return (
    <div className='bg-black text-white min-h-screen'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='*' element={<div>Page Not Found (404)</div>} />
        <Route path="/About/:id" element={<About />} />
      </Routes>
      
      
    </div>
  )
}

export default App