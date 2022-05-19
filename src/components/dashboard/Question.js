// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchCreateQuestion } from '../fetchMethods/fetchCreateQuestion';
import { fetchEditQuestion } from '../fetchMethods/fetchEditQuestion';
import { fetchQuestionDetails } from '../fetchMethods/fetchQuestionDetails';

// create Question component with properties: user, quizID, editing, setEditing, setAdding, questionIDs, setQuestionIDs
const Question = ({user, quizID, editing, setEditing, setAdding, questionIDs, setQuestionIDs}) => {

    const [question, setQuestion] = useState('') // useState for a question string (text)
    const [imgURL, setImgURL] = useState('') // useState for a image URL string (text)
    const [type, setType] = useState('multiple-one') // useState for question type
    const [answer, setAnswer] = useState({ // useState for current answer object
        id: null,
        value: ''
    })
    const [answers, setAnswers] = useState([]) // useState for current array of answers
    const [time, setTime] = useState(0) // useState for a question time limit
    const [points, setPoints] = useState(0) // useState for a question max points
    const [error, setError] = useState(null) // useState for an error object
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [firstHint, setFirstHint] = useState('') // useState for a firstHint string
    const [secondHint, setSecondHint] = useState('') // useState for a secondHint string

    // useEffect to get a question content ... depends if question is created/added or edited
    useEffect(() => {

        if(editing.inProgress){ // If question is edited ...

            
            const response = localStorage.getItem('currentQuestion') // try to get question content from browser storage

            if(response){ // if content saved in storage then set up global variables
                const content = JSON.parse(response)
                setQuestion(content.question)
                setImgURL(content.imgURL)
                setType(content.type)
                setAnswers(content.answers)
                setTime(content.time)
                setPoints(content.points)
                setFirstHint(content.firstHint)
                setSecondHint(content.secondHint)
            }else{ // otherwise get question content from server
                // define async function to get question content
                const getDetails = async() => {

                    const data = await fetchQuestionDetails(editing.id, user) // end request for the content with question id

                    if(!data.error){ // if fetched successfully the set up global variables based on the data
                        setQuestion(data.question)
                        setImgURL(data.imgURL)
                        setType(data.type)
                        setAnswers(data.answers)
                        setTime(data.time/1000)
                        setPoints(data.points)
                        setFirstHint(data.firstHint)
                        setSecondHint(data.secondHint)
                    }else{ // if error occur then:
                        alert(data.message) // present error message
                        setEditing({
                            id: null,
                            inProgress: false
                        })
                    }
                }
                getDetails() // call the function
            }


        }else{ // if question is being created
            
            const response = localStorage.getItem('currentQuestion') // tru to get content from browser storage

            if(response){ // if content saved in browser then set up global variables
                const content = JSON.parse(response)
                setQuestion(content.question)
                setImgURL(content.imgURL)
                setType(content.type)
                setAnswer(content.answer)
                setAnswers(content.answers)
                setTime(content.time)
                setPoints(content.points)
                setFirstHint(content.firstHint)
                setSecondHint(content.secondHint)
            }
        }

    }, [user, editing, questionIDs, setEditing]) // set up useEffect dependencies

    // useEffect to save content
    useEffect(() => {
        // define function to save content
        const saveContent = () => {
            localStorage.setItem('currentQuestion', JSON.stringify({
                id: questionIDs.length,
                question: question,
                imgURL: imgURL,
                type: type,
                answer: answer,
                answers: answers,
                time: time,
                points: points,
                firstHint: firstHint,
                secondHint: secondHint
            }))
        }

        saveContent() // call the function
    }, [question, imgURL, type, answer, answers, time, points, firstHint, secondHint, questionIDs]) // set up useEffect dependencies

    // define async function to submit/save a question details ... to create or edit question
    const submitHandler = async() => {

        if(question !== '' && answers.length > 0 && time !== 0){ // Question has to have a text of the task, at least one answer and time limit to continue in process
            setLoading(true) // start loading event
            let correctAnswers = [] // create new array with right answers
            if(type.includes('multiple')){ // if multiple choice question the push only correct answers
                correctAnswers = answers.filter(ans => ans.isCorrect)
                if (correctAnswers.length <= 0){ // if no right answers defined then assign first answer as correct one
                    answers[0].isCorrect = true
                    correctAnswers = answers.filter(ans => ans.isCorrect)
                }
            }else{  // if open question then all defined answers are right
                correctAnswers = [...answers]
            }
    
            let questionObject = { // create question object
                question: question,
                imgURL: imgURL,
                type: type,
                answers: answers,
                correctAnswers: correctAnswers,
                time: (Math.abs(parseFloat(time)) > 300) ? 300 * 1000 : (Math.abs(parseFloat(time)) <= 0) ? 30 * 1000 : (isNaN(parseFloat(time))) ? 30 * 1000 : parseFloat(time) * 1000,
                points: (Math.abs(parseFloat(points)) > 100) ? 100 : (Math.abs(parseFloat(points)) <= 0) ? 0 : (isNaN(parseFloat(points))) ? 0 : Math.abs(parseFloat(points)),
                firstHint: firstHint,
                secondHint: secondHint
            }

            if(editing.inProgress){ // if editing question ...

                questionObject.id = editing.id // add question already existed id to the question object 

                const data = await fetchEditQuestion(questionObject, user) // send request to edit question with question object

                if(!data.error){ // if successfully edited then:
                    setLoading(false) // end loading event
                    setEditing({ // go back to a quiz creating/editing section
                        id: null,
                        inProgress: false
                    })
                    localStorage.removeItem('currentQuestion') // remove question content from browser storage
                }else{ // if error occur then:
                    setLoading(false) // end loading event
                    setError(data) // present error message
                }

            }else{ // if creating new question ...

                const data = await fetchCreateQuestion(questionObject, quizID, user) // send request to create new question with question object

                if(!data.error){ // if question successfully created then: 
                    setLoading(false) // end loading event
                    const newQuestionIDs = [...questionIDs, data] // add question id to array of quiz's question IDs
                    setQuestionIDs(newQuestionIDs)
                    setAdding(false) // go back to a quiz creating/editing section
                    localStorage.removeItem('currentQuestion') // remove question content from browser storage
                }else{ // if error occur then:
                    setLoading(false) // end loading event
                    setError(data) // present error message
                }
            }
                
        }else{ // otherwise throw alert to inform user that question can not be saved/submitted
            alert('!To add the question you have to define text of the question, create answers and set time limit!')
        }
        
    }

    // define function to add question's answer
    const addAnswer = () => {
        // When question is type of multiple then max number of answers is 6 or if is type of open then max number of answers is 2
        if(answer.value !== '' && ((answers.length < 6 && type.includes('multiple')) || (answers.length < 10 && type === 'open'))){
            const newArr = [...answers, answer] // add answer to array of current answers
            setAnswers(newArr) // update array of answers
            setAnswer({ // restart answer value
                id: null,
                value: ''
            })
        }else if(answer.value !== ''){ // when user wants to add too many answers ... throw alert
            setAnswer({
                id: null,
                value: '!!!YOU ARE OUT OF SCOPE FOR MAX NUMBER OF ANSWERS!!!'
            })
        }
    }

    // define function to delete answer with answer id as attribute
    const deleteAnswer = (id) => {
        const newArr = answers.filter(ans => ans.id !== id) // delete answer from array by its id
        setAnswers(newArr) // update array of answers
        if(answer.value === '!!!YOU ARE OUT OF SCOPE FOR MAX NUMBER OF ANSWERS!!!'){ // restart answer value when it includes warning
            setAnswer({
                id: null,
                value: ''
            })
        }
    }

    // define function to set right answer with answer id and type (type of question) as attributes
    const setRightAnswer = (id, type) => {
        const newAnswers = answers.map((ans, index) => { // add isCorrect property (with boolean value = true) to answer with given id
            if(ans.id === id){
                ans.isCorrect = true
            }else if(ans.id !== id && type === 'multiple-one'){ // if only one correct answer then drop isCorrect property from other answers
                ans = {
                    id: ans.id,
                    value: ans.value
                }
            }
            return ans
        })
        setAnswers(newAnswers) // update array of answers
    }

    // define function to restart answer to incorrect one with answer id and type (type of question) as attributes ... in case of more right answers for multiple-choice question
    const dropRightAnswer = (id, type) => {
        const newAnswers = answers.map((ans, index) => { // drop isCorrect property from answer with given id
            if(ans.id === id && type === 'multiple-more'){
                ans = {
                    id: ans.id,
                    value: ans.value
                }
            }
            return ans
        })
        setAnswers(newAnswers) // update array of answers
    }

    // component HTML body ... present creating/editing form to user
    return (
    <div>
        <div className='question-section'>
            <label>Question:</label>
            <input
            type='text'
            className='question-input'
            value={question}
            onChange={(e) => {
                setQuestion(e.target.value)
            }}
            maxLength={250}
            />
            <label>Image URL (optional and only HTTP/HTTPS):</label>
            <input
            type='text'
            className='imgURL-input'
            value={imgURL}
            onChange={(e) => {
                setImgURL(e.target.value)
            }}
            />
            <label>Choose type of question:</label>
            <select name='types' className='question-types-section'
            onChange={(e) => {
                setType(e.target.value)
                setAnswers([])
                setAnswer({
                    id: null,
                    value: ''
                })
            }}
            value={type}
            >
                <option value='multiple-one'>Multiple-choice (only one right answer)</option>
                <option value='multiple-more'>Multiple-choice (one+ right answers)</option>
                <option value='open'>Open-ended</option>
            </select>
            { // present list of possible answers based on the question type
                (type.includes('multiple')) ?
                <div className='answers-list'>
                <label htmlFor='answer-textarea'>Create list of answers (max.: 6):</label>
                <input className='answer-textarea' name='answer-textarea' value={answer.value} placeholder='Type answer ...' maxLength={100}
                onChange={(e) => {
                    setAnswer({
                        id: (answers.length > 0) ? answers[answers.length - 1].id + 1 : 0,
                        value: e.target.value
                    })
                }}
                />
                {
                    // Button to add answer
                }
                <button
                id='answer-btn'
                className='submit-btn'
                onClick={addAnswer}
                >Add answer</button>
                <p>List of answers (Select correct answer):</p>
                <ul>
                    { // unordered list of answers
                        answers.map((ans, index) => {
                            return (
                                <div className='answer-in-list' key={index}>
                                { // choose radio input or checkbox input based on the allowed number of right answers
                                    (type === 'multiple-one') ?
                                
                                <input type='radio' className='radio-multiple' name='radio-multiple' value={ans.value}
                                checked={(ans.isCorrect) ? true : false}
                                onChange={(e) => {
                                    if(e.target.checked === true){
                                        setRightAnswer(ans.id, type)
                                    }
                                }}
                                />
                                :
                                <input type='checkbox' className='checkbox-multiple' name='checkbox-multiple' value={ans.value}
                                checked={(ans.isCorrect) ? true : false}
                                onChange={(e) => {
                                    if(e.target.checked === true){
                                        setRightAnswer(ans.id, type)
                                    }else{
                                        dropRightAnswer(ans.id, type)
                                    }
                                }}
                                />
                                }
                                <label className='answer-text' htmlFor='radio-multiple'>{ans.value}</label>
                                {
                                    // Button to drop answer
                                }
                                <strong
                                onClick={() => {
                                    deleteAnswer(ans.id)
                                }}
                                >X</strong>
                              </div>
                            )
                        })
                    }
                </ul>
                </div>
                :
                <div className='answers-list'>
                <label htmlFor='answer-textarea'>Define keywords that has to be in the right answer (max.: 10):</label>
                <input className='answer-textarea' name='answer-textarea' value={answer.value} placeholder='Type keyword ...' maxLength={55}
                onChange={(e) => {
                    setAnswer({
                        id: (answers.length > 0) ? answers[answers.length - 1].id + 1 : 0,
                        value: e.target.value.split(' ').join('')
                    })
                }}
                />
                {
                    // Button to add answer
                }
                <button
                className='submit-btn'
                onClick={addAnswer}
                >Add answer</button>
                <p>List of keywords:</p>
                <ol className='keywords-list'>
                    { // ordered list of answers ... in open type of question
                        answers.map((ans, index) => {
                            return (
                                <li key={index} className='answer-in-list'>
                                <span className='answer-text'>
                                    {ans.value.split('').filter((ch, index) => index < 20).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 21 && index < 40)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 41 && index < 60)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 61 && index < 80)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 81 && index < 100)).join('')}
                                </span><br/><br/>
                                {
                                    // Button to drop answer
                                }
                                <button
                                className='logout-btn'
                                onClick={() => {
                                    deleteAnswer(ans.id)
                                }}
                                >Delete</button>
                              </li>
                            )
                        })
                    }
                </ol>
                </div>
            }
            <label>Time to wait for answers (in seconds):</label>
            <input
            type='number'
            className='time-input'
            placeholder='0'
            value={time}
            onChange={(e) => {
                    setTime(e.target.value)
            }}
            max={300}
            min={0}
            />
            <label>Define points for correct answer (max: 100):</label>
            <input
            type='number'
            className='points-input'
            placeholder='0'
            value={points}
            onChange={(e) => {
                    setPoints(e.target.value)
            }}
            max={100}
            min={0}
            />
            <label>Type first hint (optional):</label>
            <input
            type='text'
            className='firstHint-input'
            placeholder='First hint ...'
            value={firstHint}
            onChange={(e) => {
                setFirstHint(e.target.value)
            }}
            maxLength={150}
            />
            <label>Type second hint (optional):</label>
            <input
            type='text'
            className='secondHint-input'
            placeholder='Second hint ...'
            value={secondHint}
            onChange={(e) => {
                setSecondHint(e.target.value)
            }}
            maxLength={150}
            />
            {
                (loading) ? <p>Saving question details ...</p> : (error) ? <p><strong>{error.message}</strong></p> : null // present loading event or error message
            }
          <div className='question-buttons'>
              {
                  // Button to save question
              }
            <button
            className='submit-btn'
            onClick={() => {
                if(questionIDs.length < 25){
                    submitHandler()
                }else{
                    alert('Max number of questions is 25')
                }
                
            }}
            >Save Question</button>
            {
                // Button to cancel creating/editing question
            }
            <button 
            className='logout-btn'
            onClick={() => {
            setAdding(false)
            setEditing({
                id: null,
                inProgress: false
            })
            localStorage.removeItem('currentQuestion')
            }}>Cancel</button>
          </div>
        </div>
    </div>
    )
}

export default Question; // export component