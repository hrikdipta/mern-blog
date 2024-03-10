import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/Sign-in'
import SignUp from './pages/Sign-up'
import Header from './components/Header'
import FooterCom from './components/Footer'
function App() {
  return (
    <>
      <h1 className='text-lg'></h1>

      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
        </Routes>
        <FooterCom/>
      </BrowserRouter>
    </>

  )
}

export default App
