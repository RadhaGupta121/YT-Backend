// import {v2 as cloudinary} from 'cloudinary';
  const cloudinary=require('cloudinary').v2;     
cloudinary.config({ 
  cloud_name: 'dywxivtuq', 
  api_key: '168422262715995', 
  api_secret: 'P172WsON88mSa3NAMSx2uE0hK7M' 
});

const ImageUpload=(localPath)=>{
    console.log(localPath);
      try {
       
          if(!localPath)return null;
        const output=  cloudinary.uploader.upload(`${localPath}`,
   
    function(error, result) 
    {
      if(error)console.log("errror",error);
     else console.log(result);
    
    });
    console.log("output",output);
    return output;
      } catch (error) {
          fs.unlinkSync(localPath);
          console.log("there is some error in uploading file in cloudinary");
      }
  }
  module.exports= ImageUpload;