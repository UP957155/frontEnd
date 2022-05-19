// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchUserQuizzes } from '../fetchMethods/fetchUserQuizzes';
import Quiz from './Quiz';

// create Quizzes component with properties: user, setEditQuiz
const Quizzes = ({user, setEditQuiz}) => {

    const [quizzes, setQuizzes] = useState([]) // useSate for an array of quizzes
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [error, setError] = useState(null) // useState for an error

    // useEffect to get a list of a quizzes
    useEffect(() => {
        setLoading(true)
        // define async function to get a list of quizzes
        const getQuizzes = async() => {

            const data = await fetchUserQuizzes(user) // send request for an array of quizzes

            if(!data.error){ // if fetching successful then set up global variable with list of quizzes
                setLoading(false)
                setQuizzes(data)
            }else{  // if error while fetching then show the error message
                setLoading(false)
                setError(data)
            }
        }
        // if user exists then start interval to keep list of user quizzes up to date
        if(user){
            const interval = setInterval(() => {
                getQuizzes() // call the function
              }, 1000)
              return () => clearInterval(interval)
        }else{
            setQuizzes([]) // if not any user then clear quizzes array
            setLoading(false)
        }
    }, [user]) // set up useEffect dependencies


    // component HTML body ... present a list of quizzes to user
    return (
        <div className='quiz-list'>
            {
                (quizzes.length > 0 && user) ? // if at least one quiz then present it to user
                <ul className='quizzes-list'>
                    {
                        quizzes.map((q, index) => {
                            return <Quiz user={user} q={q} index={index} setEditQuiz={setEditQuiz} key={index} />
                        })
                    }
                </ul>
                :
                (loading) ? <p>Searching for quizzes ...</p>
                :
                (!error) ?
                <p>Not any quizzes</p>
                :
                <strong>{error.message}</strong>
                // present loading or error message
            }
        </div>
    )
}

export default Quizzes; // export component