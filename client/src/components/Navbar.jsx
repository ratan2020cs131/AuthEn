import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './css/navStyle.css';
import { userContext } from '../App';

const Navbar = () => {

  const { state, dispatch } = useContext(userContext);

  const callAbout = async () => {
    try {
      const res = await fetch('https://authen-api.onrender.com/getData', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      });

      await res.json();
      if (res.status === 200) {
        dispatch({ type: 'Log', payload: true });
      }

      if (res.status === 401) {
        throw new Error(res.data);
      }
    }
    catch (error) {
      dispatch({ type: 'Log', payload: false });
    }
  }

  const NavMenu = () => {
    if (state) {
      return (
        <>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" className="active" aria-current="page" to="/">Home</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/profile">Profile</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/logout">Logout</NavLink>
            </li>
          </ul>
        </>
      )
    }
    else {
      return (
        <>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" className="active" aria-current="page" to="/">Home</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/login">Login</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/register">Register</NavLink>
            </li>
          </ul>
        </>
      )
    }
  }

  useEffect(() => {
    callAbout();
  }, [])

  return (
    <div>
      <nav className="navbar navbar-expand-lg text-bg-secondary bg-opacity-25">
        <div className="container-fluid">
          <a className="navbar-brand ms-2" href="/">
            {/* <img src={logo} alt="Logo" width="30" className="d-inline-block align-text-top mx-2" /> */}
            Auth<b>En</b></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavMenu />
            <form className="d-flex" role="search">
            </form>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;