import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPass = () => {
    const [pass, setPass] = useState();
    const [result, setResult] = useState(false);
    const [loader, setLoader] = useState(false);
    const [reply, setReply] = useState();

    const { token } = useParams();

    const sendPass = async () => {
        setLoader(true);
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password:pass
            })
        }
        const res = await fetch(`/reset-password/${token}`, options);
        const result = await res.json();
        setLoader(false);
        if (res.status === 200) {
            setResult(true);
            setReply(result.message);
        } else {
            setReply(result.message);
        }
    }


    return (
        <div id="forgotPass">
            {
                result ?
                    <p style={{ color: 'green' }}><b>{reply}</b></p>
                    :
                    <div id="verify" className=''>
                        <p>Create a password</p>
                        <input
                            type='text'
                            placeholder='Enter a new Password'
                            onChange={e => setPass(e.target.value)}
                        ></input>
                        {loader ?
                            <div className='loading'>
                                <div className="loader"></div>
                                <p>Loading...</p>
                            </div>
                            :
                            <button
                                type='submit'
                                className='btn btn-primary'
                                id='verifybtn'
                                onClick={sendPass}
                            >Reset Password</button>
                        }

                        {reply && <p style={{ color: 'tomato' }}><b>{reply}</b></p>}
                    </div>
            }
        </div>
    )
}

export default ResetPass;
