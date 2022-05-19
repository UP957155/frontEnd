// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchQuestionDetails } from '../fetchMethods/fetchQuestionDetails';

// create QuestionSummary component with properties: user, ID, index, setChecking
const QuestionSummary = ({user, ID, index, setChecking}) => {

    const [q, setQ] = useState(null) // useState for a question object
    const [error, setError] = useState(null) // useState for an error object

    // useEffect to get a question summary
    useEffect(() => {
        // define async function to get a question summary
        const getSummary = async() => {
            const data = await fetchQuestionDetails(ID, user) // send request to get summary included a question ID

            if(!data.error){ // if fetching successful set up question object
                setQ(data)
            }else{ // if error while fetching then show the error message
                setError(data)
            }
        }

        if(user){ // if user exists start interval to keep question summary actual
            const interval = setInterval(() => {
                getSummary() // call the function
            }, 1000)
            return () => clearInterval(interval)
        }else{
            setQ(null) // if not user clear a question object
        }
        
    }, [user, ID]) // set up useEffect dependencies

    // component HTML body ... present a question summary to admin
    return (
        <div className='question-summary-section'>
        {   (q) ? // if question then present it's summary
            <div>
            <p className='inside-question-summary question-text'>{index + 1}. {q.question.split('').filter((q, index) => index < 30).join('')}
            {(q.question.split('').length > 30) ? '...' : ''}</p>
            <div className='inside-question-summary'>Answers: {q.answers.length}</div>
            <div className='inside-question-summary'>Time: {q.time/1000}</div>
            <div className='inside-question-summary'>Points: {q.points}</div><br/>
            {
                // Button to go inside question ... to see more summary
            }
            <div className='inside-question-summary'>
            <button
            className='submit-btn'
            onClick={() => {
                setChecking({
                    id: q.id,
                    inProgress: true
                })
            }}
            >See Details</button>
            </div>
         </div>
         :
         (!error) ? <p>Loading question details ...</p> : <p><strong>{error.message}</strong></p> // otherwise inform admin that there is not any question summary or present error message
        }
        </div>
        
    )
}

export default QuestionSummary; // export component