// import dependencies
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckQuiz from './admin/CheckQuiz';
import Quizzes from './admin/Quizzes';

// create Admin component with properties: user
const Admin = ({user}) => {

    const [status, setStatus] = useState('checking') // useState for a status string
    const [checkingQuiz, setCheckingQuiz] = useState({ // useState for checking quiz object
        id: null,
        inProgress: false
    })
    const navigate = useNavigate() // save useNavigate hook to global variable

    // useEffect to check if user is admin
    useEffect(() => {
        if(!user || !user.user.admin){
            return navigate('/')
        }
    }, [user, navigate]) // set up useEffect dependencies

    // component HTML body ... present main admin section to admin
    return (
        <div className='admin-section'>
           <div>
               {
                   // Button to switch to the list of quizzes with 'waiting' status
               }
               <button
               className='choice-btn larger-btn'
               onClick={() => {
                   setStatus('checking')
                   setCheckingQuiz({
                       id: null,
                       inProgress: false
                   })
               }}
               >
                   Quizzes to Check
               </button>
               {
                   // Button to switch to the list of quizzes with 'rejected' status
               }
               <button
               className='choice-btn larger-btn'
               onClick={() => {
                setStatus('rejected')
                setCheckingQuiz({
                    id: null,
                    inProgress: false
                })
            }}
               >
                   Rejected Quizzes
               </button>
               {
                   // Button to switch to the list of quizzes with 'approved' status
               }
               <button
               className='choice-btn larger-btn'
               onClick={() => {
                setStatus('approved')
                setCheckingQuiz({
                    id: null,
                    inProgress: false
                })
            }}
               >
                   Approved Quizzes
               </button>
           </div>
           {
               (!checkingQuiz.inProgress) ? // Show list of quizzes or quiz details based on the checking quiz progress value

                <Quizzes user={user} status={status} setCheckingQuiz={setCheckingQuiz} />
                :
                <CheckQuiz user={user} checkingQuiz={checkingQuiz} setCheckingQuiz={setCheckingQuiz} />
                
                
           }
        </div>
    )
}

export default Admin; // export component