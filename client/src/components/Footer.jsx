import React from 'react';
import './css/footerStyle.css';

const Footer = () => {
    return (
        <div id="footer">
            <div id='copyright'><p id='copyPara'>Copyright reserved by</p><br></br>Auth<b>En</b></div>
            <div id='contact'>
                <div>
                    <div className='footItem'>
                    <i class="fa-solid fa-phone"></i>
                        <a href='tel:+918765789799'>8765789799</a></div>
                    <div className='footItem'>
                    <i class="fa-solid fa-envelope"/>
                        <a href='mailto:ratandeep.blr.12@gmail.com'>ratandeep.blr.12@gmail.com</a></div>
                </div>
                <div>
                    <div className='footItem'>
                        <a href='https://www.instagram.com/ratan.deep.23' className='socialLink' target='_blank'
                            rel='noreferrer'>
                            <i class="fa-brands fa-instagram"/>
                            ratan.deep.23
                        </a>
                    </div>
                    <div className='footItem'>
                        <a href='https://www.linkedin.com/in/ratan-deep-singh-50322b211/' className='socialLink' target='_blank'
                            rel='noreferrer'>
                            <i class="fa-brands fa-linkedin"/>
                            Ratan Deep Singh
                        </a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer;