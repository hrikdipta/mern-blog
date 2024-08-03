import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/Sign-in'
import SignUp from './pages/Sign-up'
import Header from './components/Header'
import FooterCom from './components/Footer'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
import VerifyUser from './components/VerifyUser'
function App() {
  return (
    <>
      <h1 className='text-lg'></h1>

      <BrowserRouter>
        <ScrollToTop/>
        <VerifyUser/>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute/>}>
            <Route path={'/dashboard'} element={<Dashboard/>}/>
          </Route>
          <Route element={<OnlyAdminPrivateRoute/>}>
            <Route path={'/create-post'} element={<CreatePost/>}/>
            <Route path={'/update-post/:postId'} element={<UpdatePost/>}/>
          </Route>
          <Route path="/contact" element={<Contact />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/post/:postSlug' element={<PostPage/>} />
        </Routes>
        <FooterCom/>
      </BrowserRouter>
    </>

  )
}

export default App
