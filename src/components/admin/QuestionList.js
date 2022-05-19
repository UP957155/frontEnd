// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchQuizQuestions } from '../fetchMethods/fetchQuizQuestions';
import QuestionSummary from './QuestionSummary';

// create QuestionList component with properties: user, quizID, setQuestionIDs, setChecking
const QuestionList = ({user, quizID, setQuestionIDs, setChecking}) => {

    const [questions, setQuestions] = useState([]) // useState for a list of questions
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [error, setError] = useState(null) // useState for an error

    // useEffect to get an array of questions corresponding to a quiz
    useEffect(() => {
        setLoading(true)
        // define async function to get a quiz's questions
        const getQuestions = async() => {

            const data = await fetchQuizQuestions(quizID, user) // send a fetch request with quiz ID of the questions

            if(!data.error){ // if fetching successful then set up global variable with list of questions and updated question IDs
                setQuestions(data)
                const newIDs = data.map((q, index) => q.id)
                setQuestionIDs(newIDs)
                setLoading(false)
            }else{ // if error while fetching then show the error message
                setLoading(false)
                setError(data)
            }
        }

        if(user){ // if user exists start interval to keep questions list actual
            const interval = setInterval(() => {
                getQuestions() // call the function
            }, 1000)
            return () => clearInterval(interval)
        }else{ // if not user clear a list of questions
            setQuestions([])
        }

    }, [user, quizID, setQuestionIDs]) // set up useEffect dependencies

    // component HTML body ... present a list of questions to admin
    return (
        <div>
            { (questions.length > 0) ? // if there is at least one question then present the ordered list
                <ol className='question-list'>
                    {
                        questions.map((q, index) => {
                            return (
                                <QuestionSummary key={index} user={user} ID={q.id} index={index} setChecking={setChecking} />
                            )
                        })
                    }
                </ol>
                :
                (loading) ? <p>Searching for questions ...</p> : (!error) ? <p>No question was added</p> : <p><strong>{error.message}</strong></p> // otherwise inform admin that there are not any questions or present error message
            }
        </div>
    )
}

export default QuestionList; // export component