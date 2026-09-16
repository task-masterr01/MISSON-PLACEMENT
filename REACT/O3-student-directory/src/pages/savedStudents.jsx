import React, { useState , useEffect } from 'react'
import students from '../data/students'
import StudentCard from '../components/studentCard'
const SavedStudents = () => {
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('savedStudents');
    const savedIds = savedData ? JSON.parse(savedData) : [];

    const filteredStudents = students.filter(student => savedIds.includes(student.id));

    setSavedList(filteredStudents);
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