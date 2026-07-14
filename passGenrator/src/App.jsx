import { useState, useCallback, useEffect, useRef } from 'react'

import './App.css'

function App() {
  const [length, setLength]= useState(8)
  const [number, setNumber]= useState(false)
  const [symbol, setSymbol]= useState(false)
  const [password, setPassword]= useState("")

  const passwordReff=useRef(null)

  const passwordGenrator= useCallback(()=>{
      let pass=""
      let str="ABCDEFGHIJKLMNOPORSTUVWXYZabcdefghijkImnopqrstuvwxyz"

      if(number) str+="0123456789"
      if(symbol) str+="~`!@#$%^&*()_+=-{}[]:;''<>?/.,|"

      for (let i = 0; i < length; i++) {
        let char= Math.floor(Math.random() * str.length + 1)
        
        pass+=str.charAt(char)
      }

      setPassword(pass)

    }, [length, number, symbol, setPassword])

    const copyPass=useCallback(()=>{
      passwordReff.current?.select()
      window.navigator.clipboard.writeText(password)

    }, [password])


    useEffect(()=>{
      passwordGenrator()
    }, [length, passwordGenrator, number, symbol, setPassword])

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">

    <div className="w-full max-w-xl rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

      <h1 className="text-3xl font-bold text-center text-white mb-2">
        Password Generator
      </h1>

      <p className="text-center text-gray-400 mb-8">
        Generate strong and secure passwords instantly.
      </p>

      {/* Password Box */}
      <div className="flex rounded-2xl overflow-hidden bg-black/40 border border-white/10">

        <input
          ref={passwordReff}
          value={password}
          readOnly
          placeholder="Your Password"
          className="flex-1 bg-transparent px-5 py-4 text-lg text-green-400 tracking-widest outline-none"
        />

        <button
          onClick={copyPass}
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-6 text-white font-semibold"
        >
          Copy
        </button>

      </div>

      {/* Length */}
      <div className="mt-8">

        <div className="flex justify-between mb-2">
          <span className="text-gray-300">Password Length</span>

          <span className="text-indigo-400 font-semibold">
            {length}
          </span>
        </div>

        <input
          type="range"
          min={6}
          max={100}
          value={length}
          onChange={(e)=>setLength(e.target.value)}
          className="w-full accent-indigo-500 cursor-pointer"
        />

      </div>

      {/* Checkboxes */}

      <div className="mt-8 grid grid-cols-2 gap-4">

        <label className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">

          <span className="text-gray-300">
            Numbers
          </span>

          <input
            type="checkbox"
            checked={number}
            onChange={()=>setNumber(prev=>!prev)}
            className="w-5 h-5 accent-indigo-500"
          />

        </label>

        <label className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">

          <span className="text-gray-300">
            Symbols
          </span>

          <input
            type="checkbox"
            checked={symbol}
            onChange={()=>setSymbol(prev=>!prev)}
            className="w-5 h-5 accent-indigo-500"
          />

        </label>

      </div>

      {/* Footer */}

      <div className="mt-8 flex justify-between text-sm text-gray-500">

        <span>
          Strength:
        </span>

        <span className="text-green-400 font-medium">
          Strong
        </span>

      </div>

    </div>

  </div>
)
}

export default App
