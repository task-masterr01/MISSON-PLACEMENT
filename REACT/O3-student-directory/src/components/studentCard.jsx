import React from 'react'
import { Link } from 'react-router-dom'

const StudentCard = (props) => {
 
  return (
    <div>
        <ul className='grid grid-cols-4 gap-4'>
            {
              props.data?.map((student) => (
                    <li key={student.id} className='h-60 w-50 h-max-auto w-max-auto  rounded-2xl border ml-3'>
                        <header className='flex justify-between mt-2 mx-1.5'>
                          <h4 className='ml-0 mr-3 px-1 py-1.5 '>{student.name}</h4>
                          <button className='ml-1 mt-1 py-0.5 px-1 mr-1.5 text-sm  rounded '>Year : {student.year}</button>
                        </header>
                        <div className="  my-4 px-2  text-xs align-text-top w-full text-wrap"> {student.about}</div>
                        <div className="flex flex-col gap-5 items-start "> 
                           <ul className='h-2/10 w-full flex gap-3 flex-wrap ml-2 mt-2'>
                            {student.skills?.split(',').map((skill, index) => (
                              <li key={index}>
                                <button className='px-2 py-1 bg-[#5a5959] rounded-2xl text-xs px-2'>
                                  {skill.trim()}
                                </button>
                              </li>
                            ))}
                           </ul>
                            <li >
                              <Link to={`/student/${student.id}`} className='px-2 py-1 bg-[#3462e2] rounded-xl ml-2 '>View Profile</Link>
                            </li>
                            
                        </div>
                    </li>
              ))  
            }
        </ul>
    </div>
  )
}

export default StudentCard

                           