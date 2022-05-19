// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchDeleteQuestion } from '../fetchMethods/fetchDeleteQuestion';
import { fetchQuestionDetails } from '../fetchMethods/fetchQuestionDetails';

// create QuestionSummary component with properties: user, questions, setQuestions, ID, index, setEditing, questionIDs, setQuestionIDs
const QuestionSummary = ({user, questions, setQuestions, ID, index, setEditing, questionIDs, setQuestionIDs}) => {

    const [q, setQ] = useState(null) // useState for a question object
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [error, setError] = useState(null) // useState for an error object

    useEffect(() => {
        // useEffect to get a question summary
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

    // define async function to delete question with question id as an attribute
    const deleteQuestion = async(id) => {
        setLoading(true) // start loading event
        const data = await fetchDeleteQuestion(id, user) // send request to delete question with question id

        if(!data.error){ // if successfully deleted then: 
            const newArr = questionIDs.filter(ID => ID !== id) // edit questionsIDs array
            const newArr2 = questions.filter(q => q.id !== id) // edit questions array
            // update both array ...
            setQuestionIDs(newArr)
            setQuestions(newArr2)
            setLoading(false) // end loading event
        }else{ // if error occur then:
            setLoading(false) // end loading event
            alert(data.message) // present error message
        }
    }

    // component HTML body ... present a question summary to user
    return (
        <div className='question-summary-section'>
        {   (q) ? // if question then present it's summary
            <div>
            <p className='inside-question-summary question-text'>{index + 1}. {q.question.split('').filter((q, index) => index < 30).join('')}
            {(q.question.split('').length > 30) ? '...' : ''}</p>
            <div className='inside-question-summary'>Answers: {q.answers.length}</div>
            <div className='inside-question-summary'>Time: {q.time/1000}</div>
            <div className='inside-question-summary'>Points: {q.points}</div><br/>
            <div className='inside-question-summary'>
            {
                // Button to edit question
            }
            <button
            className='submit-btn'
            onClick={() => {
                setEditing({
                    id: q.id,
                    inProgress: true
                })
            }}
            >Edit</button>
            {
                // Button to delete question
            }
            <button
            className='logout-btn'
            onClick={() => {
                deleteQuestion(q.id)
            }
            }  
            >{(!loading) ? 'Delete' : 'Deleting ...'}</button>
            </div>
         </div>
         :
         (!error) ? <p>Loading question data ...</p> : <p><strong>{error.message}</strong></p> // present loading message or error message
        }
        </div>
        
    )
}

export default QuestionSummary; // export component