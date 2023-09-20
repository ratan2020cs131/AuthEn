import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/registerStyle.css';
import avatar from './images/avatar.svg';
import { converToBase64 } from '../base64/Base64';


const Register = () => {

    const AvatarClick = () => {
        const ProfilePic = document.querySelector('#profileImage');
        ProfilePic.click();
    }

    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [user, setUser] = useState({
        name: '', email: '', phone: '', password: '', cpassword: '', profileImage: ''
    })

    let name, value, file;

    const handleProfilePic = async (event) => {
        name = event.target.name;
        file = event.target.files[0];
        if (file.size > 500000) {
            alert('image should be less than or equal to 500kb');
        }
        else {
            const base64 = await converToBase64(file);
            setUser({ ...user, [name]: base64 });
            console.log(user.profileImage)
        }
    }

    const handleChange = (event) => {
        setError(true);
        name = event.target.name;
        value = event.target.value;
        setUser({ ...user, [name]: value });
    }

    const sendData = async (event) => {
        setLoader(true);
        event.preventDefault();
        const { _id, name, email, phone, password, cpassword, profileImage } = user;
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id, name, email, phone, password, cpassword, profileImage
            })
        });
        const data = await res.json();
        setLoader(false);

        if (res.status === 201) {
            navigate('/login');
        }else{
            setError(true);
            setErrorMsg(data.message);
        }
    }

    return (
        <div id="box">
            <div id="register">
                <div className='hidePhone'>
                    <h4 >Welcome</h4>
                    <p>Tell us about yourself</p>
                </div>
                <div id="regImage">
                    <form method="POST" id='uploadImg'>
                        <img src={user.profileImage || avatar} height='170px'
                            width='170px' alt='Upload'
                            id='Avatar'
                            onClick={AvatarClick}
                            loading='lazy'></img>
                        <input
                            type='file'
                            name='profileImage'
                            id='profileImage'
                            accept='.jpeg, .jpg, .png'
                            value={user.image}
                            onChange={handleProfilePic}
                        />
                    </form>
                </div>
                <div id="form">
                    <h4 className='regDesk'>Welcome</h4>
                    <p className='regDesk'>Tell us about yourself</p>
                    <form method='POST' id="regForm">
                        <div className='inName form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-user"></i>
                            </span>
                            <input type='text' className='form-control' id='name' placeholder='Name'
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inEmail form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-envelope" />
                            </span>
                            <input type='email' className='form-control' id='email' placeholder='example@email.com'
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inPhone form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-phone"></i>
                            </span>
                            <input type='number' className='form-control' id='phone' placeholder='Phone'
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input type='password' className='form-control' id='password' placeholder='Password'
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input type='password' className='form-control' id='cpassword' placeholder='Confirm'
                                name="cpassword"
                                value={user.cpassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error?<div id="errMsg">{errorMsg}</div>:null}

                        {loader ?
                            <div className='loading'>
                                <div className="loader" style={{height: '35px', width: '35px'}}></div>
                            </div>
                            :
                            <button type='submit' className='btn btn-primary' id='btn' name='register'
                                value='register' onClick={sendData}
                            >
                                Register
                            </button>
                        }
                    </form>
                    <div id='regCon'>Already Registered?<br></br> Click here to&nbsp;
                        <NavLink to="/login">Login</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
