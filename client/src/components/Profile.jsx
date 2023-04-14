import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './images/avatar.png';
import './css/aboutStyle.css';

const About = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState('');

    const callAbout = async () => {
        try {
            if (userData !== '') { return 0 }
            const res = await fetch('/getData', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            res.json().then((data) => {
                setUserData(data);
            })


            if (res.status === 401) {
                throw new Error(res.data);
            }
        }
        catch (error) {
            navigate('/abouterr');
        }
    }

    useEffect(() => {
        callAbout();
    });

    const editProfile = () => {
        navigate('/editprofile');
    }

    const deleteAcc = () => {
        navigate('/deleteacc');
    }

    return (
        <>
        { (userData === '') ?
            <div className='loading'>
                <div className="loader"></div>
                <p>Loading...</p>
            </div> :
            <div id='profile'>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Name</div>
                    <div className='entity' id='Itemvalue'>{userData.name}</div>
                </div>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Email</div>
                    <div className='entity' id='Itemvalue'>{userData.email}</div>
                </div>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Phone</div>
                    <div className='entity' id='Itemvalue'>{userData.phone}</div>
                </div>
                <div id='profilePic'>
                    <img src={userData.profileImage || avatar}
                        height='120px'
                        width='120px'
                        alt='profile'
                        id='DP' />
                </div>
                <button type='submit' className='btn btn-primary' id='edit' name='register'
                    value='edit' onClick={editProfile}
                >Edit</button>

                <button type='submit' className='btn btn-primary' id='delete' name='register'
                    value='delete' onClick={deleteAcc}
                >Delete Account</button>
            </div>
        }
        </>
    )
}

export default About;