import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='flex justify-evenly '>
        <p className='text-white'>Welcome to mine project </p>
        <header>
            <ul className='flex justify-between'>
                <li className='mx-2'>
                    <Link to={'/'}>Home</Link>
                </li>
                <li className='mx-2'>
                    <Link to={'/About'}>About</Link>
                </li>
                <li className='mx-2'>
                    <Link to={'/Contact'}>Contact</Link>
                </li>
            </ul>
        </header>
    </div>
  )
}

export default Header