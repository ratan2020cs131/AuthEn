const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const app=express();

port=process.env.PORT;

require('./db/conn');

app.use(express.json({limit: '8mb'}));
app.use(express.urlencoded({limit: '8mb', extended: true}));
app.use(cookieParser());
app.use(require('./router/auth'));

app.listen(port,()=>{
    console.log(`server running at ${port}`);
})