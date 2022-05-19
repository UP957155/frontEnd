// import dependencies
import React, { useEffect } from 'react';
import { topics } from '../../topics';

// create component Filter with properties: topic, setTopic, username, setUsername, loading, setLoading, setFilter
const Filter = ({topic, setTopic, username, setUsername, loading, setLoading, setFilter}) => {

    useEffect(() => { //useEffect to get saved filter data from localStorage

        //create and save object with filter data
        // define function to save content
        const saveContent = () => {
            localStorage.setItem('leaderBoardFilter', JSON.stringify({
                topic: topic,
                username: username
            }))
        }

        saveContent() // call the function
    }, [topic, username])

    return (
        <div className='filter-section'>
            <div className='filter-content'>
            <h3>Filter Leaders</h3>
            <label>Topic:</label><br/>
            <select name='topics' className='question-topics-section'
            onChange={(e) => {
                setTopic(parseFloat(e.target.value))
            }}
            value={topic}
            >
                <option value={-1}>All</option>
                { // present possible choices of topics
                    topics.map((t, index) => {
                        return (
                            <option key={index} value={t.id}>{t.value}</option>
                        )
                    })
                }
            </select><br/><br/>
            <div>
                <input type='text' placeholder='filter by player username ...' value={username}
                onChange={(e) => {
                    setUsername(e.target.value)
                }}
                />
            </div>
            <br/>
            {
                (loading) ? <p>Filtering leaders ... </p> : null
            }
            {
                // Button to clear filter properties
            }
            <button
            className='choice-btn larger-btn'
            onClick={() => {
                setTopic(-1)
                setUsername('')
                localStorage.removeItem('leaderBoardFilter')
            }}
            >
                Clear Filter
            </button><br/>
            <button
            className='logout-btn larger-btn'
            onClick={() => {
                setFilter(false)
            }}
            >
                Close Filter
            </button>
            </div>
        </div>
    )
}


export default Filter; // export component