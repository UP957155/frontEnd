// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchChangeStatus } from '../fetchMethods/fetchChangeStatus';
import { fetchQuizDetails } from '../fetchMethods/fetchQuizDetails';
import CheckQuestion from './CheckQuestion';
import QuestionList from './QuestionList';
import { topics } from '../../topics';

// create CheckQuiz component with properties: user, checkingQuiz, setCheckingQuiz
const CheckQuiz = ({user, checkingQuiz, setCheckingQuiz}) => {

    const [questionIDs, setQuestionIDs] = useState([]) // useState for IDs of quiz questions
    const [name, setName] = useState('') // useState for a quiz name string
    const [status, setStatus] = useState('waiting') // useState for a quiz status string
    const [description, setDescription] = useState('') // useState for a quiz description string
    const [topic, setTopic] = useState(0) // useState for a quiz topic number
    const [difficulty, setDifficulty] = useState(1) // useState for a quiz difficulty number
    const [error, setError] = useState(null) // useState for an error
    const [loading, setLoading] = useState(false) // useState for loading event
    const [checking, setChecking] = useState({ // useState for a question checking object
        id: null,
        inProgress: false
    })

    // if checking quiz event is in progress then get a quiz details
    useEffect(() => {
            if(checkingQuiz.inProgress){
                // define async function to get a quiz details
                const getDetails = async() => {

                    const data = await fetchQuizDetails(checkingQuiz.id, user) // fetch a quiz details by it's id
        
                    if(!data.error){ // if fetching is successful then set up a quiz global variables
                    setChecking({
                        id: null,
                        inProgress: false
                    })
                    setName(data.name)
                    setDescription(data.description)
                    setTopic(data.topic)
                    setQuestionIDs(data.questionIDs)
                    setStatus(data.status)
                    if(data.difficulty){
                        setDifficulty(data.difficulty)
                    }
                    }else{ // if error while fetching then show the error message
                        alert(data.message)
                        setCheckingQuiz({
                            id: null,
                            inProgress: false
                        })
                    }

                }

                    
                    getDetails() // call the function
            }

    }, [user, checkingQuiz, setCheckingQuiz]) // set up useEffect dependencies

    //useEffect to save current page content within browser storage
    useEffect(() => {
        const saveContent = () => {
            localStorage.setItem('checkingContent', JSON.stringify({
                difficulty: difficulty
            }))
        }

        saveContent()
    }, [difficulty]) // set up useEffect dependencies

    
    // define async function to edit a quiz status by admin's decision
    const changeStatus = async(status) => {

        if(name !== '' && questionIDs.length > 0){ // if a quiz has name and at least one question then start process
            setLoading(true) // start loading event
         if(checkingQuiz.inProgress){ // if checking in progress start fetching
             const data = await fetchChangeStatus(checkingQuiz.id, status, difficulty, user) // send request to API to edit quiz properties. Included level of difficulty

             if(!data.error){ // if fetching successful then stop loading event and go back to the admin main section
                setLoading(false)
                setCheckingQuiz({ // restart checking quiz process
                    id: null,
                    inProgress: false
                })
                localStorage.removeItem('checkingContent') // remove page content from the browser storage
            }else{ // if error while fetching then show the error message and stop loading event
                setLoading(false)
                setError(data)
            }

         }
        }else{ // otherwise throw alert
            alert('!Quiz game has to have defined the quiz game NAME and add at least one question!')
        }
    }

    // component HTML body ... present a quiz details to admin
    return (
        <div className='createQuiz-section'>
            <label>Name:</label>
            <input
            type='text'
            className='quiz-input'
            value={name}
            readOnly={true}
            />
            <label htmlFor='description-textarea'>Quiz description:</label>
            <textarea className='description-textarea' name='description-textarea' value={description} placeholder='Describe your quiz ... (300 characters)' rows='4' cols='50'
                maxLength={300}
                readOnly={true}
            ></textarea>
            <label>Quiz topic:</label>
            <input type='text' className='quiz-topics-section'
            value={topics.filter(t => t.id === JSON.parse(topic))[0].value}
            readOnly={true}
            />
            <h3>Number of questions: {questionIDs.length}</h3>
            { // present either list of a quiz's questions or present question details .. based on checking event
                (checking.inProgress) ?
                <CheckQuestion user={user} checking={checking} setChecking={setChecking} />
                :
                <QuestionList user={user} quizID={checkingQuiz.id} questionIDs={questionIDs} setQuestionIDs={setQuestionIDs} setChecking={setChecking} />
            }
            {
                // Set up or present a quiz difficulty based on the status
            }
            <label>Define Quiz Difficulty:</label>
            {
                (status === 'checking') ?
            <select name='difficulty' className='question-difficulty-section'
            onChange={(e) => {
                setDifficulty(e.target.value)
            }}
            value={difficulty}
            >
                <option value={1}>1 - very easy</option>
                <option value={2}>2 - easy</option>
                <option value={3}>3 - average difficulty</option>
                <option value={4}>4 - difficult</option>
                <option value={5}>5 - very difficult</option>
            </select>
            :
            <input type='text'
            value={
                (difficulty === 1 || difficulty === '1') ? '1 - very easy'
                : (difficulty === '2') ? '2 - easy'
                : (difficulty === '3') ? '3 - average difficulty'
                : (difficulty === '4') ? '4 - difficult'
                : (difficulty === '5') ? '5 - very difficult'
                : 'not defined'
            }
            readOnly={true}
            />
            }
            {
                (loading) ? <p>Loading ...</p> : (error) ? <p><strong>{error.message}</strong></p> : null
            }
            {
                // Button to approved quiz
            }
            <br/><button className='submit-btn larger-btn'
            onClick={() => {
                changeStatus('approved')
            }}
            disabled={(status !== 'checking') ? true : false}
            >Approve Quiz</button><br/>
            {
                // Button to reject quiz
            }
            <button className='logout-btn larger-btn'
            onClick={() => {
                changeStatus('rejected')
            }}
            disabled={(status !== 'checking' && status !== 'approved') ? true : false}
            >Reject Quiz</button><br/>
            {
                // Button to cancel quiz checking and go back to the main admin section
            }
            <button className='logout-btn larger-btn'
            onClick={() => {
            if(checkingQuiz.inProgress){
                setCheckingQuiz({
                    id: null,
                    inProgress: false
                })
            }
            localStorage.removeItem('checkingContent')
            }}>Close Details</button>
        </div>
    )
}

export default CheckQuiz; // export component