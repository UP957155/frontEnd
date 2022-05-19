// import dependencies
import React, {useState} from 'react';
import { fetchRegister } from '../fetchMethods/fetchRegister';

// create Register component with properties: setRegistered
const Register = ({setRegistered}) => {

    const [error, setError] = useState(null) // useState for an error object
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [nickname, setNickname] = useState('') // useState for a nickname string
    const [email, setEmail] = useState('') // useState for an email string
    const [password, setPassword] = useState('') // useState for an password string
    const [controlPassword, setControlPassword] = useState({ // useState for an controlPassword object
        isSame: true,
        value: ''
    })

    // define async function to submit register form details
    const submitHandle = async(e) => {
        e.preventDefault()
        setError(null)
        setLoading(true) // start loading event

        const data = await fetchRegister(nickname, email, password) // send request to register user with with nickname, email and password

        if(data.error){ // if a registration not successful then present error message
            setError(data)
            setLoading(false) // end up loading event
        }else{ // when registration successful go to login section
            setRegistered(data)
            setLoading(false) // end up loading event
        }
    }


    // component HTML body ... present registration section to user/admin
    return (

    <form className='register-form'
    onSubmit={(e) => {
        submitHandle(e)
    }}
    >
        <h1>Register</h1>
        <label htmlFor='input-nickname' >Nickname:</label>
        <input className='register input-nickname'
        type='text'
        maxLength={10}
        value={nickname}
        onChange={(e) => {
            setNickname(e.target.value)
        }}
        required
        ></input>
        <label htmlFor='input-email' >Email:</label>
        <input className='register input-email'
        type='email'
        maxLength={30}
        value={email}
        onChange={(e) => {
            setEmail(e.target.value)
        }}
        required
        ></input>
        <label htmlFor='input-password' >Password:</label>
        <input className='register input-password'
        type='password'
        maxLength={30}
        value={password}
        onChange={(e) => {
            setPassword(e.target.value)
            if(e.target.value === controlPassword.value){
                setControlPassword({
                    isSame: true,
                    value: controlPassword.value
                })
            }else{
                setControlPassword({
                    isSame: false,
                    value: controlPassword.value
                })
            }
        }}
        required
        ></input>
        {
            // Checking if both passwords are same!
        }
        <label htmlFor='input-controlPassword' >Password again: {(controlPassword.isSame) ? '🟢' : '🔴'} 
        {(controlPassword.isSame) ? <snap className='light-green'>Passwords are same!</snap> : <snap className='red'>Passwords are different!</snap>}</label>
        <input className='register input-controlPassword'
        type='password'
        maxLength={30}
        value={controlPassword.value}
        onChange={(e) => {
            if(e.target.value === password){
                setControlPassword({
                    isSame: true,
                    value: e.target.value
                })
            }else{
                setControlPassword({
                    isSame: false,
                    value: e.target.value
                })
            }

        }}
        required
        ></input>
        {
            (error) ?
            <p><strong>{error.message}</strong></p>
            : (loading) ? <p>Loading ...</p> :
            '' // present error message or message about loading event
        }
        {
            // Button to submit registration details ... password has to be same as controlPassword
        }
        <input className='submit-btn submit-register-details-btn'
        disabled={(controlPassword.isSame === true && controlPassword.value !== '') ? 
        false : true}
        type='submit'
        value='Register'
        ></input>
    </form>

    )
}

export default Register; // export component