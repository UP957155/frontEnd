// import dependencies
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchLogout } from './fetchMethods/fetchLogout';

// create Navbar component with properties: user, setUser
const Navbar = ({user, setUser}) => {

    const navigate = useNavigate() // save useNavigate hook to global variable 

    // define async function to logout user
    const logoutHandler = async() => {
    
            const data = await fetchLogout()
    
            if(!data.error){ // if logout successful then:
                setUser(null) // restart user variable to default value
                localStorage.removeItem('currentContent') // remove saved content from browser storage
                localStorage.removeItem('currentQuestion')
            }else{ // if error occur then:
                alert('Logout failed') // present message error
            }
      }

    //Invite bot to the server
    const inviteBot = () => {
        window.open('http://localhost:8080/invite', '_blank').focus()
    }

    // component HTML body ... present navbar section to user/admin
    return(
        <div className="navbar">
          {
          (user) ? // if user exists (is logged in) show logout button... otherwise show login button
          <button className="auth-btn logout-btn"
          onClick={logoutHandler}
          >Logout</button>
          :
          <button className="auth-btn"
          onClick={() => {
            navigate('/auth', {replace: true})
          }}
          >Login</button>
          }
          <h1>Discord Quiz Bot</h1>
          <div className='dropdown-section'>
          <button className='dropdown-btn'>
            MENU
          </button>
          {
              // Links to switch between sections
          }
          <div className='menu-section'>
          <Link className='menu-section-btn' to='/leaderBoard'>🥇 LeaderBoard</Link>
          <Link className='menu-section-btn'  to='/discover'>🌐 Discover</Link>
          <Link className='menu-section-btn'  to='/'>🏁 Dashboard</Link>
          {
              (user) ? (user.user.admin) ? // if user is admin then show option to go to the admin section
              <Link className='menu-section-btn'  to='/admin'>🤖 Admin</Link>
              :
              null
              :
              null
          }
          <div className='menu-section-btn'
          onClick={inviteBot}
          >➕ Invite QuizBot</div>
          </div>
          </div>
        </div>
    )
}

export default Navbar; // export component