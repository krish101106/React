import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import "./App.css"

function App() {
  const [color, setColor] = useState("black")


  return (
    <>
      <div className="w-full h-screen duration-300" style={{backgroundColor: color}}>
        <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">


          <div className='flex flex-wrap justify-center gap-3 rounded-xl py-3 px-2 bg-white'>

            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'red'}} onClick={()=>{setColor("red")}}> red</button>

            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'green'}} onClick={()=>{setColor("green")}}> green</button>

            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'olive'}} onClick={()=>{setColor("olive")}}> olive</button>

            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'yellow'}} onClick={()=>{setColor("yellow")}}> yellow</button>

            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'grey'}} onClick={()=>{setColor("grey")}}> grey</button>
            
            <button className='rounded-xl outline-none px-3 py-1' style={{backgroundColor: 'blue'}} onClick={()=>{setColor("blue")}}> blue</button>
          </div>

          

        </div>
      </div>
    
    </>
  )
}

export default App
