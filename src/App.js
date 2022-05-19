// import dependencies
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/Selects.css';
import './styles/TextAreas.css';
import './styles/Forms.css';
import './styles/Lists.css';
import './styles/Inputs.css';
import './styles/Sections.css';
import './styles/Buttons.css';
import './styles/Others.css';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import LeaderBoard from './components/LeaderBoard';
import Discover from './components/Discover';
import Navbar from './components/Navbar';
import Admin from './components/Admin';
import { fetchDiscordUser } from './components/fetchMethods/fetchDiscordUser';
import { fetchRefreshToken } from './components/fetchMethods/fetchRefreshToken';

// main App parent component
function App() {

  const [user, setUser] = useState(null) // useState for a user object

  // useEffect to get user
  useEffect(() => {
    // define async function to get user logged in via discord account
    const getDiscordUser = async() => {
      
      const data = await fetchDiscordUser()

      if(!data){
        setUser(data)
      }else if(!data.error){
        setUser(data)
      }else{
        alert(data.message)
      }
    }

    // define async function to get user logged in via email
    const getJWTUser = async() => {
  
        const data = await fetchRefreshToken()
  
        if(!data){
          setUser(data)
        }else if(!data.error){
          setUser(data)
        }else{
          alert(data.message)
        }
    }

    getDiscordUser() // cal the function
    getJWTUser() // call the function
  }, [])

  // parent component HTML body ... present chosen section to user ... using routes
  return (
    <div className="App">
        <Navbar user={user} setUser={setUser} />
        <div>
        <Routes>
          <Route path='/' element={<Dashboard user={user} setUser={setUser} />} />
          <Route path='/auth' element={<Authentication user={user} setUser={setUser} />} />
          <Route path='/leaderBoard' element={<LeaderBoard />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/admin' element={<Admin user={user} />} />
        </Routes>
        </div>
    </div>
  )
}

export default App; // export parent component
