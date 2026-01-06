
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [Data,setData]=useState([])

  useEffect (()=>{

    axios.get('/api/Data')
    .then((res)=>{
      setData(res.data)
      
    })

  })
  
  
  return (
    <>
     <h1>Full stack conection with proxy</h1>
     <div>DATA:{Data.length}</div>
     {
      Data.map((Data)=>(
        <div key={Data.id}>
          <h1>{Data.title}</h1>
          <h2>{Data.text}</h2>

        </div>
      ))
     }

    </>
  )
}

export default App
