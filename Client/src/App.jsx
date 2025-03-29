import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Home from './Pages/Home'
import Auth from './Pages/Auth'

function App() {


  return (
    <>
    <Toaster />
     <Routes>
       <Route path="/auth" element={<Auth />} />
       <Route path="/" element={<Home />} />
     </Routes>
    </>
  )
}

export default App
