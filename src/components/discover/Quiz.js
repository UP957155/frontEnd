// import dependencies
import React from 'react';
import { topics } from '../../topics';

// create component Quiz with properties: q, index
const Quiz = ({q, index}) => {

    //open modal with description
    const openDescription = () => {
        const modal = document.querySelectorAll('.modal')
        modal[index].style.display = 'block'

    }

    //close modal with description
    const closeDescription = () => {
        const modal = document.querySelectorAll('.modal')
        modal[index].style.display = 'none'

    }

    const copyPlayCommand = () => {
        const copyBtn = document.querySelectorAll('.copy-btn')
        // save text into the clipboard
        navigator.clipboard.writeText(copyBtn[index].previousElementSibling.textContent)
        copyBtn[index].textContent = 'Copied' // change button text
        setTimeout(() => {
            copyBtn[index].textContent = 'Copy' // after 3 seconds restart button text
        }, 3000)
    }


    // component HTML body ... present quiz summary to user
    return (
        <div className='quiz-summary-section'>
                                <h3 className='inside-quiz-section' >{q.name.split('').filter((q, index) => index < 30).join('')}</h3>
                                <div className='inside-quiz-section' >Topic: {topics.find(topic => parseInt(topic.id) === parseInt(q.topic)).value}</div>
                                <div className='inside-quiz-section' >Number of Questions: {q.questionIDs.length}</div>
                                <div className='inside-quiz-section' >Quiz Difficulty: {q.difficulty}/5</div>
                                <div className='inside-quiz-section command' >Play command:</div>
                                <div className='code-text'><div>{'!play ' + q.id}</div><button className='copy-btn'
                                onClick={() => {
                                    copyPlayCommand()
                                }}
                                >Copy</button></div>
                                <div className='modal'>
                                    {
                                        // Button to close description
                                    }
                                <span className='close'
                                onClick={() => {
                                    closeDescription()
                                }}
                                >X</span>
                                    <p className='quiz-description'>
                                    {q.description.split('').filter((q, index) => index < 100).join('')}<br/>
                                    {q.description.split('').filter((q, index) => (index >= 101 && index < 200)).join('')}<br/>
                                    {q.description.split('').filter((q, index) => (index >= 201 && index < 300)).join('')}
                                    </p>
                                </div>
                                <div className='inside-quiz-section command'>
                                {
                                        // Button to open description
                                    }
                                    <button
                                    className='submit-btn'
                                    onClick={() => {
                                        openDescription()
                                    }}
                                    >
                                        Read description
                                    </button>
                                </div>
                            </div>
    )
}

export default Quiz; // export component