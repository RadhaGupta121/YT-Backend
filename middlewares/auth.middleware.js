const jwt=require('jsonwebtoken');
const verifyJWTToken=async(req,res,next)=>{
    try {
      console.log("this is req from middlweare cookies",req.cookies?.accesstoken);
      const token=req.cookies?.accesstoken||req.header("Authorization")?.replace('Bearer ',"");
      console.log(token);
      if(!token)
      {
        res.status(201).json({message:"Unauthorized access"});
      }
     else{
        const decodeToken=jwt.verify(token,process.env.secreteAcessKey);
     req.user=decodeToken.userId;
     console.log("this is decodedtoken",decodeToken.userId);
      next(); 
     } 
    } catch (error) {
       console.log(error); 
    }
}
module.exports=verifyJWTToken;