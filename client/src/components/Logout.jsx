import React, { useEffect, useContext } from 'react';
import { userContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(userContext);
    const logOut = () => {
        fetch('https://authen-api.onrender.com/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: "include"
        }).then((res) => {
            if (res.status === 202) {
                dispatch({ type: 'Log', payload: false });
                navigate('/login', { replace: true });
            }
        })
    }

    useEffect(() => {
        logOut();
    }, [])
    return (
        <div className="position-absolute top-50 start-50 translate-middle">
            {
                state ?
                    <div className='loading'>
                        <div className="loader"></div>
                        <p>Logging out</p>
                    </div> :
                    <h1>Logged out</h1>
            }
        </div>
    );
}

export default Logout;