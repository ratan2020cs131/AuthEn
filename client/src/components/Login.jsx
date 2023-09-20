import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import './css/loginStyle.css';


const Login = () => {

    const { state, dispatch } = useContext(userContext);
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [userError, setUserError] = useState(false);
    const [userErrorMsg, setUserErrorMsg] = useState();
    const [passError, setPassError] = useState(false);
    const [passErrorMsg, setPassErrorMsg] = useState();

    const [user, setUser] = useState({
        phone: '', password: ''
    })

    let name, value;
    const handleChange = (event) => {
        setPassError(false);
        setUserError(false)
        name = event.target.name;
        value = event.target.value;
        setUser({ ...user, [name]: value })
    }

    const sendData = async (event) => {
        setLoader(true);
        event.preventDefault();
        const { phone, password } = user;

        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone, password
            })
        });

        const data = await res.json();

        setLoader(false);

        if (res.status === 201) {
            dispatch({ type: 'Log', payload: true });
            navigate('/');
        }

        else if (res.status === 401 || res.status === 423) {
            setPassError(true);
            setPassErrorMsg(data.message);
        }

        else if (res.status === 424 || res.status === 422) {
            setUserError(true);
            setUserErrorMsg(data.message);
        }

    }


    return (
        <div id="box">
            <div id="register">
                <div id="logImage"></div>
                <div id="form">
                    <h4>Welcome</h4>
                    <p><b>Log in</b> to your account to get started</p>
                    <form id="regForm">

                        <div className='inEmail form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-user"></i>
                            </span>
                            <input type='number' className='form-control' id='phone' name='phone' placeholder='97XXXXXX99'
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {
                            userError ? <div id='wrongPhone'>{userErrorMsg}</div> : null
                        }

                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input type='password' className='form-control' id='password' name='password' placeholder='********'
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>

                        {
                            passError ? <div id='wrongPass'>{passErrorMsg} </div> : null
                        }

                        {loader ?
                            <div className='loading'>
                                <div className="loader" style={{height: '35px', width: '35px'}}></div>
                            </div>
                            :
                            <button type='submit' className='btn btn-primary'
                                name='login'
                                value='login'
                                id='loginbtn'
                                onClick={sendData}
                            >
                                Login
                            </button>
                        }
                        <div>
                            <NavLink to="/forgot-password">Forgot Password?</NavLink>
                        </div>
                    </form>
                    <div className='register'>New Here?<br></br>Click here to&nbsp;
                        <NavLink to="/register">Register</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;