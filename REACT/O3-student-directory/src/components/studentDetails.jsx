import React from 'react'
import { useParams } from 'react-router-dom';
import students from '../data/students';

const StudentDetails = () => {
     const params = useParams();
  const studentId = params.id;

  const student = students.find((s)=> s.id === parseInt(studentId));

  if(!student) return  <h3>Student not found</h3>  ;
  return (
    <div className='h-8/10 w-full flex justify-center mt-4'>
          <div className=' h-full w-3/10 bg-[#c14a23] px-10 py-3 rounded-3xl'>
            <h3>STUDENT NAME : {student.name}</h3>
          <h3>STUDENT Roll number  : {student.id}</h3>
          <h3>STUDENT CGPA : {student.cgpa}</h3>
          <h3>STUDENT SESSION : {student.session}</h3>
          <h3>STUDENT YEAR : {student.year}</h3>
          <ul> 
            <h3>student skill set</h3>
            {student.skills.map((skill, index) =>(
              <li key={index}>
                    <p> {skill.name}</p>    
              </li>
            ))}
          </ul>
          </div>
    </div>
  );
}

export default StudentDetails