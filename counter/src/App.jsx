import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'



function App() {


  let [counter, setCounter] = useState(15)

  let increase = () => {
    setCounter(counter + 1)
  }

  let deacrease = () => {

    if (counter <= 0) {

    }
    else {

      setCounter(counter - 1)
    }
  }


  return (
    <>
      <h1>Counter Value {counter}</h1>

      <button onClick={increase}>Increase</button>
      <br />
      <button onClick={deacrease}>Deacrease</button>
    </>
  )
}


export default App
