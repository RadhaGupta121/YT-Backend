const express=require('express');
const app=express();
const userrouter=require('./routers/user.js');
const cookieParser = require('cookie-parser');
const verifyJWTToken = require('./middlewares/auth.middleware.js');

app.use(express.json());
app.use(cookieParser());

app.use('/user',userrouter);
app.post('/',verifyJWTToken)
const upload = require('./middlewares/multer.js');
const ImageUpload = require('./utils/cloudinary.js');

// app.post('/upload', upload.single('file'), async(req, res) => {
//      const {path}=req.file;
//      const result=await ImageUpload(path);
   
//      res.status(200).send(`${JSON.stringify(result.url)}`);
 
// });
module.exports=app;