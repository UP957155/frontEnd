// import dependencies 
import React, { useEffect, useState } from 'react';
import { fetchQuestionDetails } from '../fetchMethods/fetchQuestionDetails';

// create CheckQuestion component with properties: user, checking, setChecking
const CheckQuestion = ({user, checking, setChecking}) => {

    const [question, setQuestion] = useState('') // useState for question string
    const [imgURL, setImgURL] = useState('') // useState for image URL string
    const [type, setType] = useState('multiple-one') // useState for question type
    const [answers, setAnswers] = useState([]) // useState for list (array) of answers
    const [time, setTime] = useState(0) // useState for a question's time limit
    const [points, setPoints] = useState(0) // useState for a question's max points
    const [firstHint, setFirstHint] = useState('') // useState for firstHint string
    const [secondHint, setSecondHint] = useState('') // useState for secondHint string

    // if checking question is in progress then get the question details. 
    useEffect(() => {

        if(checking.inProgress){
            // define async function to get a question data
                const getDetails = async() => {
                    const data = await fetchQuestionDetails(checking.id, user) // fetch a question details by its id

                    if(!data.error){ // if fetching successful then set up global question variables
                        setQuestion(data.question)
                        setImgURL(data.imgURL)
                        setType(data.type)
                        setAnswers(data.answers)
                        setTime(data.time/1000)
                        setPoints(data.points)
                        setFirstHint(data.firstHint)
                        setSecondHint(data.secondHint)
                    }else{ // if error while fetching then show the error message
                        alert(data.message)
                        setChecking({
                            id: null,
                            inProgress: false
                        })
                    }
                }
                getDetails() // call the function
            }

    }, [user, checking, setChecking]) // set up useEffect dependencies

    // component HTML body ... present a question details to admin
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
            readOnly={true}
            />
            <label>Image URL (!ONLY HTTP/HTTPS):</label>
            <input
            type='text'
            className='question-input'
            value={imgURL}
            onChange={(e) => {
                setImgURL(e.target.value)
            }}
            readOnly={true}
            />
            <label>Choose type of question:</label>
            <input type='text' name='types' className='question-types-section'
            value={type}
            readOnly={true}
            />
            {
                // present answers in right format based on the type of a question
                (type.includes('multiple')) ?
                <div className='answers-list'>
                <p>List of answers</p>
                <ul>
                    { // unordered list of answers
                        answers.map((ans, index) => {
                            return (
                                <div className='answer-in-list' key={index}>
                                { // present answers in right format based on the type of a multiple question (one right answer or more)
                                    (type === 'multiple-one') ?
                                
                                <input type='radio' className='radio-multiple' name='radio-multiple' value={ans.value}
                                checked={(ans.isCorrect) ? true : false}
                                readOnly={true}
                                />
                                :
                                <input type='checkbox' className='checkbox-multiple' name='checkbox-multiple' value={ans.value}
                                checked={(ans.isCorrect) ? true : false}
                                readOnly={true}
                                />
                                }
                                <label className='answer-text' htmlFor='radio-multiple'>{ans.value}</label>
                              </div>
                            )
                        })
                    }
                </ul>
                </div>
                :
                <div className='answers-list'>
                <p>List of correct answers:</p>
                <ol>
                    { // ordered list of answers => open question
                        answers.map((ans, index) => {
                            return (
                                <li key={index} className='answer-in-list'>
                                <span className='answer-text'>
                                    {ans.value.split('').filter((ch, index) => index < 20).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 21 && index < 40)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 41 && index < 60)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 61 && index < 80)).join('') + '\n'}
                                    {ans.value.split('').filter((ch, index) => (index >= 81 && index < 100)).join('')}
                                </span>
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
            readOnly={true}
            />
            <label>Define points for correct answer (max: 100):</label>
            <input
            type='number'
            className='points-input'
            placeholder='0'
            value={points}
            readOnly={true}
            />
            <label>First hint (optional):</label>
            <input
            type='text'
            className='firstHint-input'
            placeholder=' ... '
            value={firstHint}
            readOnly={true}
            />
            <label>Second hint (optional):</label>
            <input
            type='text'
            className='secondHint-input'
            placeholder=' ... '
            value={secondHint}
            readOnly={true}
            />
          <div className='question-buttons'>
              {
                  //Button to cancel checking and go back to the quiz details
              }
            <button 
            className='logout-btn'
            onClick={() => {
            setChecking({
                id: null,
                inProgress: false
            })
            }}>Close Details</button>
          </div>
        </div>
    </div>
    )
}

export default CheckQuestion; // export component