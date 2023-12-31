const mongoose=require('mongoose');
require('dotenv').config();
const DB_Name=process.env.DB_Name;
const DB_URL=process.env.DB_URL;
console.log(DB_Name,DB_URL);
const dbConnection=async()=>{
 try {
    await  mongoose.connect(`${DB_URL}/${DB_Name}`);
         console.log("connected to db");
 } catch (error) {
    console.log(error);
 }
}
module.exports=dbConnection;