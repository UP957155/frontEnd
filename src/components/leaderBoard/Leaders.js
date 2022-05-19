// import dependencies
import React, { useState, useEffect } from 'react';
import { fetchGetLeaders } from '../fetchMethods/fetchGetLeaders';
import { topics } from '../../topics';


// create component Leaders with properties: topic, username, loading, setLoading
const Leaders = ({topic, username, loading, setLoading}) => {

    const [leaders, setLeaders] = useState([]) // useState for an array of leaders
    const [error, setError] = useState(null) // useState for an error object


    // useEffect to get leaders
    useEffect(() => {
        setLoading(true)
        // define async function to get a list of leaders
        const getLeaders = async() => {
            
            const data = await fetchGetLeaders(topic, username) // send request for an array of leaders filtered by topic and username if applied
    
            if(!data.error){ // if fetching successful then set up global variable with list of leaders
                setLeaders(data)
                setLoading(false)
            }else{ // if error while fetching then show the error message
                setError(data)
                setLoading(false)
            }
    
        }

        const interval = setInterval(() => {
            getLeaders() // call the function
        }, 1000)
        return () => clearInterval(interval)
    }, [topic, username, setLoading]) // set up useEffect dependencies

    return (
        <div className='leader-list'>
            <h3>Topic: {(topics.find(t => t.id === parseInt(topic))) ? topics.find(t => t.id === parseInt(topic)).value : 'All'}</h3>
               {
               (leaders.length > 0) ? // if at least one leader then present it.
                   <ul className='leaders-list'>
                       <div className='leader-section'>
                                    <div>Place</div>
                                    <div>Username</div>
                                    <div>Points</div>
                        </div>
                      { 
                            leaders.map((l, index) => {
                                return (
                                <div className='leader-section' key={index}>
                                    <div>{(index === 0) ? '🥇' :
                                    (index === 1) ? '🥈' :
                                    (index === 2) ? '🥉' : `${index + 1}. `}</div>
                                    <div>{l.username}</div>
                                    <div className='leader-points'>{l.points}</div>
                                </div>
                                )
                            })
                    }
                   </ul>
                   :
                   (!error) ? <p>Not any leaders</p> : <p><strong>{error.message}</strong></p> // otherwise inform user that there are not any leaders or present error message                  
                   }
        </div>
    )
}

export default Leaders; // export component