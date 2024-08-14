// import React from 'react'
import {Routes,Route} from 'react-router-dom'
// import pages
import Home from './Pages/Home'
import SignUp from './Pages/SignOn'
import Signin from './Pages/Signin'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Navbar from './Components/Navbar'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing'











const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/about' element={<About/>}/>
        <Route  element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-listing' element={<CreateListing/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App