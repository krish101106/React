import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { ThemeProvider } from './Context/Theme'
import ThemeBtn from './Components/ThemeBtn'
import Card from './Components/Card'

function App() {
  const [themeMode, setThemeMode]= useState("light")

  const lightTheme=()=>{
    setThemeMode("light")
  }

  const darkTheme=()=>{
    setThemeMode("dark")
  }

  useEffect(()=>{
    const webClass=document.querySelector('html').classList

    webClass.remove("light", "dark")

    webClass.add(themeMode)

  },[themeMode])

  return (
    <>
      <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>

        <div className="flex flex-wrap min-h-screen items-center">
          <div className="w-full">
            <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
              <ThemeBtn/>
            </div>

            <div className="w-full max-w-sm mx-auto">
              <Card/>
            </div>
          </div>
        </div>


      </ThemeProvider>
        
    </>
    
  )
}

export default App
