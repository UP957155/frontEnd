// import dependencies
import React, { useState, useEffect } from 'react';
import Filter from './discover/Filter';
import Quizzes from './discover/Quizzes';

// create component Discover with no properties
const Discover = () => {

    
    const [difficulty, setDifficulty] = useState(0) // useState for a difficulty
    const [topic, setTopic] = useState(-1) // useState for a topic
    const [name, setName] = useState('') // useState for a name string
    const [id, setId] = useState('') // useState for a id
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [filter, setFilter] = useState(false) // useState for filter event

    useEffect(() => { //useEffect to get saved filter data from localStorage

        const filterData = localStorage.getItem('discoverFilter')//get data from localStorage

        if(filterData){ // if content is found then setup global filter variables
            const content = JSON.parse(filterData)
            setDifficulty(content.difficulty)
            setTopic(content.topic)
            setName(content.name)
            setId(content.id)
        }
    }, [])

    return (
        <div className='discover-section'>
            <h2>🌐 Discover new quiz games:</h2>
            <button
            className='choice-btn larger-btn'
            onClick={() => {
                setFilter(true)
            }}
            >
                Filter Quizzes
            </button>
            {
                (filter) ?  <Filter difficulty={difficulty} setDifficulty={setDifficulty} topic={topic} setTopic={setTopic}
                name={name} setName={setName} id={id} setId={setId} loading={loading} setLoading={setLoading} setFilter={setFilter} />
                :
                null
            }
            <Quizzes difficulty={difficulty} topic={topic} name={name} id={id} loading={loading} setLoading={setLoading} />
        </div>
    )
}

export default Discover; // export component