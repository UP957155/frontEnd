// import dependencies
import React, { useState, useEffect } from 'react';
import Filter from './leaderBoard/Filter';
import Leaders from './leaderBoard/Leaders';


const LeaderBoard = () => {

    const [topic, setTopic] = useState(-1) // useState for a topic
    const [username, setUsername] = useState('') // useState for a username string
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [filter, setFilter] = useState(false) //useState for filter event

    useEffect(() => { //useEffect to get saved filter data from localStorage

        const filterData = localStorage.getItem('leaderBoardFilter')//get data from localStorage

        if(filterData){ // if content is found then setup global filter variables
            const content = JSON.parse(filterData)
            setTopic(content.topic)
            setUsername(content.username)
        }
    }, [])


    return (
        <div className='leaderBoard-section'>
            <h2>👑 QuizBot's leaders:</h2>
            <button
            className='choice-btn larger-btn'
            onClick={() => {
                setFilter(true)
            }}
            >
                Filter Leaders
            </button>
            {
                (filter) ?  <Filter topic={topic} setTopic={setTopic}
                username={username} setUsername={setUsername} loading={loading} setLoading={setLoading} setFilter={setFilter} />
                :
                null
            }
            <Leaders topic={topic} username={username} loading={loading} setLoading={setLoading} />
        </div>
    )
}

export default LeaderBoard;