// import dependencies
import React, { useEffect, useState } from 'react';
import { fetchEditQuiz } from '../fetchMethods/fetchEditQuiz';
import { fetchQuizDetails } from '../fetchMethods/fetchQuizDetails';
import Question from './Question';
import QuestionList from './QuestionList';
import { topics } from '../../topics';

// create CreateQuiz component with properties: user, editQuiz, setEditQuiz
const CreateQuiz = ({user, editQuiz, setEditQuiz}) => {

    const [adding, setAdding] = useState(false) // useState for adding question event (boolean)
    const [questionIDs, setQuestionIDs] = useState([]) // useState for an array of question IDs
    const [name, setName] = useState('') // useState for a quiz name string
    const [description, setDescription] = useState('') // useState  for a quiz description
    const [topic, setTopic] = useState(0) // useState for a quiz topic
    const [error, setError] = useState(null) // useState for an error object
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [editing, setEditing] = useState({ // useState for question editing
        id: null,
        inProgress: false
    })

    // useEffect to get a quiz current content ... depends if quiz is created or edited
    useEffect(() => {
            if(editQuiz.inProgress){ // if editing quiz then we first get quiz details from server ... then when making changes we can have saved content in browser storage
                // define async function to get a quiz details from server
                const getDetails = async() => {

                    const data = await fetchQuizDetails(editQuiz.id, user) // send request for a quiz details with quiz ID

                    if(!data.error){ // if not any error then set up a quiz global variables based on the data
                    setEditing({
                        id: null,
                        inProgress: false
                    })
                    setAdding(false)
                    setName((data.name) ? data.name : '')
                    setDescription((data.description) ? data.description : '')
                    setTopic((data.topic) ? data.topic : 0)
                    }

                }
                 
                const response = localStorage.getItem('currentContent') // try to get content from the storage

                if(response){ // if content is found then setup global quiz variables
                    const content = JSON.parse(response)
                    setEditing(content.editing)
                    setAdding(content.adding)
                    setName(content.name)
                    setDescription(content.description)
                    setTopic(content.topic)
                }else{ // otherwise get details from server
                    getDetails() // call the function
                }
            }

    }, [user, editQuiz]) // set up useEffect dependencies

    // useEffect for saving content to the browser storage
    useEffect(() => {
        // define function to save content
        const saveContent = () => {
            localStorage.setItem('currentContent', JSON.stringify({
                editing: editing,
                editQuiz: editQuiz,
                adding: adding,
                name: name,
                description: description,
                topic: topic
            }))
        }

        saveContent() // call the function
    }, [editQuiz, editing, adding, name, description, topic]) // set up useEffect dependencies

    
    // define async function to save/submit a quiz details ... to create or edit quiz
    const submitHandler = async() => {

        if(name !== '' && questionIDs.length > 0){ // A quiz has to have name and at least one question to continue
            let quiz = { // create quiz object with right properties
                name: name,
                description: description,
                topic: topic
            }
            setLoading(true) // start loading event

         if(editQuiz.inProgress){ // If a quiz is edited ... 

             quiz.id = editQuiz.id // add to quiz object already existed id

             const data = await fetchEditQuiz(quiz, user) // send request to EDIT quiz with quiz object ... included quiz id

             if(!data.error){ // if quiz edited successfully then:  
                setLoading(false) // end loading event
                setEditQuiz({ // go back to the main dashboard section
                    id: null,
                    inProgress: false
                })
                localStorage.removeItem('currentContent') // clear current content
            }else{ // if error occur then:
                setLoading(false) // end loading event
                setError(data) // present error message
            }

         }
        }else{ // otherwise throw alert to inform user that quiz can not be saved/submitted
            alert('!You have to define the quiz game NAME and add at least one question!')
        }
    }

    // component HTML body ... present creating/editing form to user
    return (
        <div className='createQuiz-section'>
            <label>Name:</label>
            <input
            type='text'
            className='question-input'
            value={name}
            onChange={(e) => {
                setName(e.target.value)
            }}
            />
            <label htmlFor='description-textarea'>Add description:</label>
            <textarea className='description-textarea' name='description-textarea' value={description} placeholder='Describe your quiz ... (300 characters)' rows='4' cols='50'
                onChange={(e) => {
                    setDescription(e.target.value)
                }}
                maxLength={300}
            ></textarea>
            <label>Choose quiz's topic:</label>
            <select name='topics' className='question-topics-section'
            onChange={(e) => {
                setTopic(e.target.value)
            }}
            value={topics.filter(t => t.id === JSON.parse(topic))[0].id}
            >
                {
                    topics.map((topic, index) => {
                        return (
                            <option  key={index} value={topic.id}>{topic.value}</option>
                        )
                    })
                }
            </select>
            <h3>Number of questions: {questionIDs.length}</h3>
            <button
            className='add-btn'
            onClick={() => {
                if(questionIDs.length < 25){
                    setAdding(true)
                }else{
                    alert('Max number of questions is 25')
                }
                
            }}
            >+ Add Question</button>
            { // present to user list of questions or form for add/create or edit a new/created question.
                (adding || editing.inProgress) ?
                <Question user={user} quizID={editQuiz.id} editing={editing} setEditing={setEditing} setAdding={setAdding} questionIDs={questionIDs} setQuestionIDs={setQuestionIDs} />
                :
                <QuestionList user={user} quizID={editQuiz.id} questionIDs={questionIDs} setQuestionIDs={setQuestionIDs} setEditing={setEditing} />
            }
            {
                (loading) ? <p>Saving quiz details ...</p> : (error) ? <p><strong>{error.message}</strong></p> : null // present loading event message or error message
            }
            {
                // Button to save/create quiz
            }
            <button className='submit-btn larger-btn' 
            onClick={submitHandler}
            disabled={(adding || editing.inProgress) ? true : false}
            >Save Quiz</button>
            {
                // Button to cancel creating or editing a quiz.
            }
            <button className='logout-btn larger-btn'
            onClick={() => {
                setEditQuiz({
                    id: null,
                    inProgress: false
                })
            localStorage.removeItem('currentContent')
            }}
            disabled={(adding || editing.inProgress) ? true : false}
            >Cancel</button>
        </div>
    )
}

export default CreateQuiz; // export component