import React, { useState } from 'react';

const ForgotPass = () => {
    const [email, setEmail] = useState();
    const [reply, setReply] = useState();
    const [loader, setLoader] = useState(false);

    const sendEmail = async () => {
        setReply(null);
        if(!email){
            setReply("Please enter email");
            return;
        }
        setLoader(true);
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email
            })
        }
        const res = await fetch('/forgot-password', options);
        const result = await res.json();
        setReply(result.message);
        setLoader(false);
    }


    return (
        <div id="forgotPass">
            <div id="verify" className=''>
                <p>Enter your email to generate reset link</p>
                <input
                    type='email'
                    placeholder='Enter your email'
                    onChange={e => { setEmail(e.target.value); setReply(null) }}
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
                        onClick={sendEmail}
                    >Send Reset Link</button>
                }
                {reply && <p style={{ color: 'tomato' }}><b>{reply}</b></p>}
            </div>
        </div>
    )
}

export default ForgotPass;
