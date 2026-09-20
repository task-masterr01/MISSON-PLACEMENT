import React, { useState , useEffect } from 'react'
import StudentCard from '../components/studentCard'
const SavedStudents = () => {
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('savedStudents');
    const savedIds = savedData ? JSON.parse(savedData) : [];

    fetch('http://localhost:5000/api/students')
    .then(res => res.json())
    .then(data =>{
      const filtered = data.filter(s => savedIds.includes(s.id));
      setSavedList(filtered);
    });
    }, []);

    

   return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mb-8">Saved Students</h1>
      
      {savedList.length === 0 ? (
        <p className="text-center">No students saved yet!</p>
      ) : (
        <StudentCard data={savedList} />
      )}
    </div>
  )

}

export default SavedStudents