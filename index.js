const express=require('express');
const mongoose=require('mongoose');
const app=require('./app.js');

const userrouter=require('./routers/user.js');
const dbConnection=require('./db/dbConnections.js');

dbConnection()

.then(()=>{
   
    app.listen(8000,(req,res)=>{
        console.log("listerning to youtube clone")
    })
})
.catch((error)=>console.log(error));