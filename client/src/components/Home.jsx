import React, {useEffect, useState} from 'react';
import mongo from './images/mongo.png';
import express from './images/express.png';
import node from './images/node.png';
import react from './images/react.png';
import './css/homeStyle.css';


const Home = () => {
    const [user, setUser] = useState({});
    const [show, setShow]= useState(false);

    const callAbout = async ()=>{
        try{
            const res = await fetch('/getData', {
                method: 'GET',
                headers: {
                    Accept:'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include'
            });
    
            const data=await res.json(); 
            setUser(data);
            setShow(true);
    
            if(res.status===401){
                throw new Error(res.data);
            }
        }
        catch(error){
            setShow(false);
        }
    }

    useEffect(()=>{
        callAbout();
      },[])

    return (
        <>
            <div id='corousel'>
                <div id='corousel-body'>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={mongo} className="d-block w-100" alt="..."/>
                        </div>

                        <div className="carousel-item">
                            <img src={express} className="d-block w-100" alt="..."/>
                        </div>

                        <div className="carousel-item">
                            <img src={react} className="d-block w-100" alt="..."/>
                        </div>

                        <div className="carousel-item">
                            <img src={node} className="d-block w-100" alt="..."/>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                </div>
                <div id='welcome'>
                <h2>{ show ? 'Welcome Back':'MERN FULLSTACK'}</h2>
                <h1 id='#name' >{user.name}</h1>
                <p>MERN is a Javascript Stack that is used for easier and faster deployment of full-stack web applications. MERN Stack comprises of 4 technologies namely: MongoDB, Express, React and Node.js. It is designed to make the development process smoother and easier.</p>
                <p>Each of these 4 powerful technologies provides an end-to-end framework for the developers to work in and each of these technologies play a big part in the development of web applications.</p>
            </div>
            </div>
        </>
    )
}

export default Home;