import React, { createContext, useReducer } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Error from './components/Error';
import AboutError from './components/AboutError';
import Logout from './components/Logout';
import Footer from './components/Footer';
import EditProfile from './components/EditProfile';
import DeleteAcc from './components/DeleteAcc';
import { initialState, reducer } from './reducer/UseReduce';

export const userContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route exact path='/'
        element={<Home />}>
      </Route>

      <Route path='/profile'
        element={<Profile />}>
      </Route>

      <Route path='/login'
        element={<Login />}>
      </Route>

      <Route path='/register'
        element={<Register />}>
      </Route>

      <Route path='/abouterr'
        element={<AboutError />}>
      </Route>

      <Route path='/logout'
        element={<Logout />}>
      </Route>

      <Route path='/editprofile'
        element={<EditProfile />}>
      </Route>

      <Route path='/deleteacc'
        element={<DeleteAcc />}>
      </Route>

      <Route path='*'
        element={<Error />}>
      </Route>
    </Routes>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <userContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routing />
        <Footer />
      </userContext.Provider>
    </>
  )
}

export default App;