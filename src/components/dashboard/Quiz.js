// import dependencies
import React, {useState} from 'react';
import { fetchDeleteQuiz } from '../fetchMethods/fetchDeleteQuiz';
import { topics } from '../../topics';
import { fetchChangeStatus } from '../fetchMethods/fetchChangeStatus';

// create component Quiz with properties: user, q, index, setEditQuiz
const Quiz = ({user, q, index, setEditQuiz}) => {

    const [deleting, setDeleting] = useState(false) // useState for a deleting event
    const [publishing, setPublishing] = useState(false) // useState for a publishing event
    const [error, setError] = useState(false) // useState for an error object

    // define async function to publish quiz with quiz id as attribute
    const publishQuiz = async(id) => {
        setPublishing(true) // start loading event
        const data = await fetchChangeStatus(id, 'checking', 1, user)

        if(!data.error){ // if deleted successfully then a array of quizzes doesn't need to be updated in this component
            setPublishing(false) // end loading event
        }else{ // if error occur then:
            setPublishing(false) // end loading event
            setError(data) // present error message
        }
    }


    // define async function to delete quiz with quiz id as attribute
    const deleteQuiz = async(id) => {
        setDeleting(true) // start loading event
        const data = await fetchDeleteQuiz(id, user) // send request to delete quiz with quiz id

        if(!data.error){ // if deleted successfully then a array of quizzes doesn't need to be updated in this component
            setDeleting(false) // end loading event
        }else{ // if error occur then: 
            setDeleting(false) // end loading event
            setError(data) // present error message
        }
    }

    // function to copy play command
    const copyPlayCommand = () => {
        const copyBtn = document.querySelectorAll('.copy-btn')
        // save text into the clipboard
        navigator.clipboard.writeText(copyBtn[index].previousElementSibling.textContent)
        copyBtn[index].textContent = 'Copied' // change button text
        setTimeout(() => {
            copyBtn[index].textContent = 'Copy' // after 3 seconds restart button text
        }, 3000)
    }

    // component HTML body ... present quiz summary to user
    return (
        <div className='quiz-summary-section'>
                                <h3 className='inside-quiz-section' >{q.name.split('').filter((q, index) => index < 30).join('')}</h3>
                                {
                                    (error) ? <div className='inside-quiz-section' ><strong>{error.message}</strong></div>
                                    :
                                    null
                                }
                                <div className='inside-quiz-section' >Topic: {topics.find(topic => parseInt(topic.id) === parseInt(q.topic)).value}</div>
                                <div className='inside-quiz-section' >Questions: {q.questionIDs.length}</div>
                                <div className='inside-quiz-section' >Status: {q.status}</div>
                                <div className='inside-quiz-section command' >Play command:</div>
                                <div className='code-text'><div>{'!play ' + q.id}</div><button className='copy-btn'
                                onClick={() => {
                                    copyPlayCommand()
                                }}
                                >Copy</button></div>
                                <div className='inside-quiz-section quiz-buttons' >
                                    {
                                        // Button to publish quiz
                                    }
                                    <button
                                    className='submit-btn'
                                    onClick={() => {
                                        publishQuiz(q.id)
                                    }}
                                    disabled={(q.status !== 'waiting' || q.questionIDs.length <= 0) ? true : false}
                                    >{(!publishing) ? 'Publish' : 'Publishing'}</button>
                                    {
                                        // Button to edit quiz
                                    }
                                    <button
                                    className='submit-btn'
                                    onClick={() => {
                                        setEditQuiz({
                                            id: q.id,
                                            inProgress: true
                                        })
                                    }}
                                    disabled={(q.status === 'checking') ? true : false}
                                    >Edit</button>
                                    {
                                        // Button to delete quiz
                                    }
                                    <button
                                    className='logout-btn'
                                    onClick={() => {
                                        deleteQuiz(q.id)
                                    }}
                                    disabled={(q.status === 'checking') ? true : false}
                                    >{(!deleting) ? 'Delete' : 'Deleting'}</button>
                                </div>
                            </div>
    )
}

export default Quiz; // export component