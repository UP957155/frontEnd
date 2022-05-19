// import dependencies
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './authentication/Login';
import Register from './authentication/Register';

// create Authentication component with properties: user, setUser
const Authentication = ({user, setUser}) => {

    const [registered, setRegistered] = useState(false) // useState for a boolean value to select register or login form
    const navigate = useNavigate() // save useNavigate hook to global variable

    // useEffect to check if user need to login or register
    useEffect(() => {
            if(user){
                navigate('/', {replace: true})
            }
    })

    // component HTML body ... present authentication section to user
    return (
        <div>
            <div className='navbar-switch'>
                {
                    // Button to switch to register section
                }
                <button className='choice-btn'
                onClick={() => {
                    setRegistered(false)
                }}
                >Register</button>
                {
                    // Button to switch to login section
                }
                <button className='choice-btn'
                onClick={() => {
                    setRegistered(true)
                }}
                >Log in</button>
            </div>
            {
                (!registered) ? // show either register form or login ... based of boolean value of registered variable
                <Register setRegistered={setRegistered} />
                :
                <Login setUser={setUser} />
            }
        </div>
    )
}

export default Authentication; // export component