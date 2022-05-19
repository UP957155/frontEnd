// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchQuizQuestions } from '../fetchMethods/fetchQuizQuestions';
import QuestionSummary from './QuestionSummary';

// create QuestionList component with properties: user, quizID, questionIDs, setQuestionIDs, setEditing
const QuestionList = ({user, quizID, questionIDs, setQuestionIDs, setEditing}) => {

    const [questions, setQuestions] = useState([]) // useState for an array of questions
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [error, setError] = useState(null) // useState for an error object

    // useEffect to get array of questions
    useEffect(() => {
        setLoading(true)
        // define async function to get array of questions
        const getQuestions = async() => {
    
            const data = await fetchQuizQuestions(quizID, user) // send request to get array of questions with ID of given quiz

            if(!data.error){ // if fetching successful then: 
                setQuestions(data) // update array of questions
                const newIDs = data.map((q, index) => q.id) // update array of question IDs
                setQuestionIDs(newIDs)
                setLoading(false)
            }else{ // if error occur then:
                setLoading(false)
                setError(data) // present error message
            }
        }

        if(user){ // if user exists then start interval to get actual array of questions
            const interval = setInterval(() => {
                getQuestions() // call the function
            }, 1000)
            return () => clearInterval(interval)
        }else{
            setQuestions([]) // if not user clear array of questions
        }

    }, [user, quizID, setQuestionIDs]) // set up useEffect dependencies

    // component HTML body ... present list of questions to user
    return (
        <div>
            { (questions.length > 0) ? // if at least one question then present it to user
                <ol className='question-list'>
                    { // ordered list
                        questions.map((q, index) => {
                            return <QuestionSummary key={index} user={user} questions={questions} setQuestions={setQuestions} ID={q.id} index={index} setEditing={setEditing}
                            questionIDs={questionIDs} setQuestionIDs={setQuestionIDs} />
                        })
                    }
                </ol>
                :
                (loading) ? <p>Searching for questions ...</p> : (!error) ? <p>No question was added</p> : <p><strong>{error.message}</strong></p> // If not any question then present this fact to user or present error message
            }
        </div>
    )
}

export default QuestionList; // export component