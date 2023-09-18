import React from 'react';
import './css/footerStyle.css';

const Footer = () => {
    return (
        <div id="footer">
            <div id='copyright'>
                <p id='copyPara'>Copyright reserved by</p>
                <p>Auth<b>En</b></p>
            </div>
            <div id='contact'>
                <div className='contactItem'>
                    <i className="fa-solid fa-phone"></i>
                    <i className="fa-solid fa-envelope" />
                    <i className="fa-brands fa-instagram" />
                    <i className="fa-brands fa-linkedin" />
                </div>
                <div className='contactItem'>
                    <a href='tel:+918765789799'>8765789799</a>
                    <a href='mailto:ratandeep.blr.12@gmail.com'>ratandeep.blr.12@gmail.com</a>
                    <a href='https://www.instagram.com/ratan.deep.23' className='socialLink' target='_blank' rel='noreferrer'>ratan.deep.23</a>
                    <a href='https://www.linkedin.com/in/ratan-deep-singh-50322b211/' className='socialLink' target='_blank' rel='noreferrer'>Ratan Deep Singh </a>
                </div>
                {/* <div className='footItem'>
                </div>
                <div className='footItem'>
                </div>
                <div className='footItem'>
                </div>
                <div className='footItem'>
                </div> */}
            </div>
        </div>

    )
}

export default Footer;