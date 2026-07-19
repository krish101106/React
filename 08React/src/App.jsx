import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './Components/Login';
import Profile from './Components/Profile';
import UserContextProvider from './Context/UserContextProvider'
function App() {
  const [count, setCount] = useState(0)

  return (
      <UserContextProvider>
        <Login/>
        <Profile/>
      </UserContextProvider>
  )
}

export default App
