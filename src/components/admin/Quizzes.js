// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchAdminQuizzes } from '../fetchMethods/fetchAdminQuizzes';
import { topics } from '../../topics';

// create Quizzes component with properties: user, status, setCheckingQuiz
const Quizzes = ({user, status, setCheckingQuiz}) => {

    const [quizzes, setQuizzes] = useState([]) // useSate for an array of quizzes
    const [loading, setLoading] = useState(false) // useSate for an array of quizzes
    const [error, setError] = useState(null) // useState for an error

    // useEffect to get a list of a quizzes
    useEffect(() => {
        setLoading(true)
        // define async function to get a list of quizzes with quiz status as attribute
        const getQuizzes = async(status) => {
            
            const data = await fetchAdminQuizzes(status, user) // send request for an array of quizzes with filtered by status
    
            if(!data.error){ // if fetching successful then set up global variable with list of quizzes
                setQuizzes(data)
                setLoading(false) // end loading event
            }else{ // if error while fetching then show the error message
                setError(data)
                setQuizzes([])
                setLoading(false) // end loading event
            }
    
        }
        if(user){ // if user exists start interval to keep questions list actual
            const interval = setInterval(() => {
                getQuizzes(status) // call the function
            }, 1000)
            return () => clearInterval(interval)
        }else{ // if not user clear a list of questions
            setQuizzes([])
        }
    }, [status, user]) // set up useEffect dependencies

    // component HTML body ... present a list of quizzes to admin
    return (
        <div className='quiz-list'>
            <div>
               {
                   (loading) ? <p>Searching for {status} quizzes ...</p> : <h3>{status.toUpperCase()} Quizzes</h3>
               }
           </div>
               {
               (quizzes.length > 0) ? // if at least one quiz then present it to admin
                   <ul className='quizzes-list'>
                      { 
                            quizzes.map((q, index) => {
                                return (
                                <div className='quiz-summary-section' key={index}>
                                    <h3 className='inside-quiz-section' >ID:{q.id} - {q.name.split('').filter((q, index) => index < 30).join('')}</h3>
                                    <div className='inside-quiz-section' >Topic: {topics.find(topic => parseInt(topic.id) === parseInt(q.topic)).value}</div>
                                    <div className='inside-quiz-section' >Number of Questions: {q.questionIDs.length}</div>
                                    <div className='inside-quiz-section' >Quiz Difficulty: {q.difficulty}/5</div>
                                    <div className='inside-quiz-section' >Status: {q.status}</div>
                                    <div className='inside-quiz-section' >{(status !== 'checking') ? status : 'Asked to check'} 
                                    : {(new Date(q.date).getHours() > 9) ? new Date(q.date).getHours() : `0${new Date(q.date).getHours()}`} 
                                    :{(new Date(q.date).getMinutes() > 9) ? new Date(q.date).getMinutes() : `0${new Date(q.date).getMinutes()}`} - {new Date(q.date).getMonth() + 1}/{new Date(q.date).getDate()}/{new Date(q.date).getFullYear()}</div><br/>
                                    <div className='inside-quiz-section' >
                                        {
                                            // Button to open quiz details
                                        }
                                        <button
                                        className='submit-btn'
                                        onClick={() => {
                                            setCheckingQuiz({
                                                id: q.id,
                                                inProgress: true
                                            })
                                        }}
                                        >See Details</button>
                                    </div>
                                </div>
                                )
                            })
                    }
                   </ul>
                   :
                   (!error) ? <p>Not any {status} quizzes</p> : <p><strong>{error.message}</strong></p> // otherwise inform admin that there are not any quizzes or present error message
                   }
               </div>
    )
}

export default Quizzes; // export component