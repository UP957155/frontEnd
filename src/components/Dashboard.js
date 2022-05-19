// import dependencies
import React, { useEffect, useState } from 'react';
import CreateQuiz from './dashboard/CreateQuiz';
import Quizzes from './dashboard/Quizzes';
import { fetchCreateQuiz } from './fetchMethods/fetchCreateQuiz';

// create Dashboard component with properties: user
const Dashboard = ({user}) => {

    const [editQuiz, setEditQuiz] = useState({ // useState for a editing quiz object
        id: null,
        inProgress: false
    })

    // useEffect to get current status of creating or editing quiz
    useEffect(() => {

        if(user){ // if user exists ...
            const response = localStorage.getItem('currentContent') // try to get info from browser storage
        
            if(response){ // if the info in browser exists then set up creating and editing global variables
                const content = JSON.parse(response)
                setEditQuiz(content.editQuiz)
            }
            // otherwise do nothing
        }else{ // if not any user restart both global variables to default value
            //setCreating(false)
            setEditQuiz({
                id: null,
                inProgress: false
            })
        }

    }, [user]) // set up useEffect dependencies

    //define async function to create quiz
    const createQuiz = async() => {

        let quiz = {}

        const data = await fetchCreateQuiz(user, quiz)

        if(!data.error){
            setEditQuiz({
                id: data,
                inProgress: true
            })
        }else{
            alert(data.message)
        }
    }
    
    // component HTML body ... present main dashboard section to user
    return (
    <div className='dashboard-section'>
        <h1>{(!user) ? 'User Quizzes' : (user.user.username) ? user.user.username + `'s Quizzes` : user.user.nickname + `'s Quizzes`}</h1>
        <button
        className='create-btn'
        onClick={() => {
            createQuiz()
        }}
        disabled={(user && !editQuiz.inProgress) ? false : true}
        >+ Create Quiz</button>
        { ((editQuiz.inProgress) && user) ? // show either list of quizzes or create/edit quiz section based ont he values of creating and editQuiz variables

        <CreateQuiz user={user} editQuiz={editQuiz} setEditQuiz={setEditQuiz} />
        :
        <Quizzes user={user} setEditQuiz={setEditQuiz} />
        }
    </div>
    )
}

export default Dashboard; // export component