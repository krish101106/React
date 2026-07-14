import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './card.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='bg-green-400 text-black rounded-xl p-4'>tailwind</h1>
      <Card username="Krish" age={20}/> 
      <Card username="Dharmit" /> 
    </>
  )
}

export default App
