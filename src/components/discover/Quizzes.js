// import dependencies
import React, { useState, useEffect } from 'react';
import { fetchDiscoverQuizzes } from '../fetchMethods/fetchDiscoverQuizzes';
import Quiz from './Quiz';


// create component Quizzes with properties: difficulty, topic, name, id, loading, setLoading
const Quizzes = ({difficulty, topic, name, id, loading, setLoading}) => {

    const [quizzes, setQuizzes] = useState([]) // useState for an array of quizzes
    const [error, setError] = useState(null) // useState for an error object


    // useEffect to get approved quizzes
    useEffect(() => {
        setLoading(true)
        // define async function to get a list of quizzes with quiz status as attribute
        const getQuizzes = async() => {
            
            const data = await fetchDiscoverQuizzes(difficulty, topic, name, id) // send request for an array of quizzes filtered by difficulty, topic name or id if applied
    
            if(!data.error){ // if fetching successful then set up global variable with list of quizzes
                setQuizzes(data)
                setLoading(false)
            }else{ // if error while fetching then show the error message
                setError(data)
                setLoading(false)
            }
    
        }

        const interval = setInterval(() => {
            getQuizzes() // call the function
        }, 1000)
        return () => clearInterval(interval)
    }, [difficulty, topic, name, id, setLoading]) // set up useEffect dependencies

    return (
        <div className='quiz-list'>
               {
               (quizzes.length > 0) ? // if at least one quiz then present it to admin
                   <ul className='quizzes-list'>
                      { 
                            quizzes.map((q, index) => {
                                return (
                                <Quiz key={index} q={q} index={index} />
                                )
                            })
                    }
                   </ul>
                   :
                   (!error) ? <p>Not any quizzes</p> : <p><strong>{error.message}</strong></p> // otherwise inform user that there are not any quizzes or present error message                  
                   }
               </div>
    )
}

export default Quizzes; // export component