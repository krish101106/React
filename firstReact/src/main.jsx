import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

let [counter,setCounter]=useState(15)

let increase = ()=>{
  setCounter(counter+1)
}

let deacrease = ()=>{
  setCounter(counter-1)
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>

      <h1>Counter Value {count}</h1>

      <button onClick={increase}>Increase</button>
      <br />
      <button onClick={deacrease}>Deacrease</button>
      
    </>
  </StrictMode>,
)
