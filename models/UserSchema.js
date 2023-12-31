const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    userName:{
        type:String,
        index:true,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        index:true,
        require:true,
        unique:true,
    },
    avatar :{
        type:String,
       
    },
    coverImage:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,

    },
    refreshToken:{
        type:String,
        required:true,
    },
    watchHistory:
        
       [{type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
       }]
    
    
},{
    timestamps:true
})
UserSchema.pre('save',async function(){
    if(this.isModified('password'))
    {
    return this.password=await bcrypt.hash(this.password,10);
    }
   
})

UserSchema.methods={
    comparePassword:async function(savedpassword,userPassword)
    {
          const output=await bcrypt.compare(savedpassword,userPassword);
          return output;
    },
    generateAccesstoken: function(userId)
    {
        let accesstoken=jwt.sign({userId},process.env.secreteAcessKey,{expiresIn:process.env.accessTokenExpiry})
         return accesstoken;
    },
    generateRefreshToken:function(userId)
    {
        let refreshToken=jwt.sign({userId},process.env.Refresh_Token_Key,{expiresIn:process.env.Refresh_Token_Expiry})
      return refreshToken;
    }
}
const User=mongoose.model('User',UserSchema);
module.exports=User;