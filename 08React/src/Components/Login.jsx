import React, { useContext, useState } from 'react'
import UserContext from '../Context/UserContext'

function Login() {
    const [username, setUsername]= useState(null)
    const [password, setPassword]= useState(null)

    const {setUser} = useContext(UserContext)

    const handleSubmit=(e)=>{
        e.preventDefault()
        setUser({username, password} )
        
    }

    return (
        <div>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
        <br/>
        <input type="text" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>

        <button type='submit' onClick={handleSubmit}>submit</button>
        </div>
    )
    }

export default Login
