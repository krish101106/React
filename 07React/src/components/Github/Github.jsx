import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

function Github() {
    // const [data, setData]=useState([])

    // useEffect(()=>{
    //     fetch('https://api.github.com/users/Dharmit-Parmar')
    //     .then((res)=>res.json())
    //     .then((data)=>{console.log(data)
    //         setData(data)})
    // },[])

    const data =useLoaderData()
  return (
    <div className='text-center bg-gray-600 text-white text-3xl p-4 m-2'>
        Github Follower: {data.followers}
    </div>
  )
}

export default Github


export const githubLoader = async() =>{
    const response = await fetch('https://api.github.com/users/Dharmit-Parmar')
    return response.json()
}