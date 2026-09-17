import React , {useState , useEffect} from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
// import StudentCard from './components/studentCard';
import students from './data/students';
import StudentCard from './components/studentCard';
import SavedStudents from './pages/savedStudents';
import StudentDetails from './components/studentDetails';

const App = () => {

  const [dbStudents, setDbStudents] = useState([]);
  // 2. Fetch the data from your Node server when the app loads
  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then((response) => response.json())
      .then((data) => {
        setDbStudents(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div className='bg-black text-white min-h-screen'>
      <Routes>
        <Route path='/' element={<Home data={dbStudents} />} />
        <Route path='/savedStudents' element={<SavedStudents />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='*' element={<div>Page Not Found (404)</div>} />
        <Route path="/student/:id" element={<StudentDetails />} />
      </Routes>
      
      
    </div>
  )
}

export default App