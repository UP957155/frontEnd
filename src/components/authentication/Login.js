// import dependencies
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '../fetchMethods/fetchLogin';
import discordIcon from '../icons8-discord.svg';

// create Login component with properties: setUser
const Login = ({setUser}) => {

    const [error, setError] = useState(null) // useState for an error object
    const [loading, setLoading] = useState(false) // useState for a loading event
    const [email, setEmail] = useState('') // useState for a email string
    const [password, setPassword] = useState('') // useState for a password string
    const navigate = useNavigate() // assign useNavigate hook to variable

    // define async function to submit login form details
    const submitHandler = async(e) => {
        e.preventDefault()
        setError(null)
        setLoading(true) // set loading event to true

        const data = await fetchLogin(email, password) // send login request with email and password

        if(data.error){ // if login throw error then present error message
            setError(data)
            setLoading(false) // end up loading event
        }else{ // if login successful set up user object and navigate to dashboard section
            setUser(data)
            navigate('/home', {replace: true})
            setLoading(false) // end up loading event
        }
    }
    // discord login handler ... navigate to auth discord page for this web app
    const discordLogin = () => {
        window.location.href = 'http://localhost:8080/auth'
    }

    // component HTML body ... present a login section to user/admin
    return (
    <div>
        <form className='login-form'
            onSubmit={(e) => {
            submitHandler(e)
            }}
        >
        <h1>Log in</h1>
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
            // Button to submit login form .. login via user email
        }
        <input
        className='submit-btn'
        type='submit'
        value='Log in'
        ></input>
        </form>
        <h3>OR</h3>
        {
            // Button to login via discord account
        }
        <button
        className='discord-btn'
        onClick={discordLogin}
        >
        <img alt='icon' src={discordIcon} width='30px' height='20px'
        />
        </button>
    </div>
    )
}

export default Login; // export component