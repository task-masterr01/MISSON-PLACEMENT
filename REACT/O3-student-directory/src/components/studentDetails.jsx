import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentDetails = () => {
     const params = useParams();
     const [student , setStudent] = useState(null)
  const studentId = params.id;

  useEffect(() => {
        fetch(`http://localhost:5000/api/students/${studentId}`)
            .then(res => res.json())
            .then(data => setStudent(data))
            .catch(err => console.error(err));
    }, [studentId]); // re-runs if ID changes
    
    if (!student) return <h3>Loading...</h3>;

  const handleSave = ()=>{
    const savedData = localStorage.getItem('savedStudents');
    let savedIds = savedData ? JSON.parse(savedData) : [];

    if (!savedIds.includes(student.id)){
      savedIds.push(student.id);
      localStorage.setItem('savedStudents' , JSON.stringify(savedIds)) ;
      alert("student saved successfully");

    }else{
      alert("this student is aleady saved");
    }
  } ;


  
  
    return (
        <div className='h-8/10 w-full flex justify-center mt-4'>
            <div className='h-full w-3/10 bg-[#c14a23] px-10 py-3 rounded-3xl'>
                <h3>STUDENT NAME: {student.name}</h3>
                <h3>STUDENT Roll: {student.id}</h3>
                <h3>STUDENT CGPA: {student.cgpa}</h3>
                <h3>STUDENT SESSION: {student.session}</h3>
                <h3>STUDENT YEAR: {student.year}</h3>
                <h3>SKILLS: {student.skills}</h3>
                <button onClick={handleSave}
                    className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'>
                    Save Profile
                </button>
            </div>
        </div>
    );
}

export default StudentDetails