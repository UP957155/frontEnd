// import dependencies
import React, { useEffect } from 'react';
import { topics } from '../../topics';

// create component Filter with properties: difficulty, setDifficulty, topic, setTopic, name, setName, id, setId, loading, setLoading, setFilter
const Filter = ({difficulty, setDifficulty, topic, setTopic, name, setName, id, setId, loading, setLoading, setFilter}) => {

    useEffect(() => { //useEffect to get saved filter data from localStorage

        //create and save object with filter data
        // define function to save content
        const saveContent = () => {
            localStorage.setItem('discoverFilter', JSON.stringify({
                difficulty: difficulty,
                topic: topic,
                name: name,
                id: id
            }))
        }

        saveContent() // call the function
    }, [difficulty, topic, name, id])

    return (
        <div className='filter-section'>
            <div className='filter-content'>
            <h3>Filter Quizzes</h3>
            <label>Difficulty:</label><br/>
            <select name='difficulty' className='question-topics-section'
            onChange={(e) => {
                setDifficulty(parseFloat(e.target.value))
            }}
            value={difficulty}
            >
                <option value={0}>All</option>
                <option value={1}>1 - very easy</option>
                <option value={2}>2 - easy</option>
                <option value={3}>3 - average difficulty</option>
                <option value={4}>4 - difficult</option>
                <option value={5}>5 - very difficult</option>
            </select><br/><br/>
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
                <input type='text' placeholder='filter by quiz name ...' value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
                />
            </div>
            <br/>
            <div>
                <input type='number' placeholder='filter by id ...' value={id}
                onChange={(e) => {
                    setId(parseFloat(e.target.value))
                }}
                />
            </div>
            <br/>
            {
                (loading) ? <p>Filtering quizzes ... </p> : null
            }
            {
                // Button to clear filter properties
            }
            <button
            className='choice-btn larger-btn'
            onClick={() => {
                setDifficulty(0)
                setTopic(-1)
                setId('')
                setName('')
                localStorage.removeItem('filterData')
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