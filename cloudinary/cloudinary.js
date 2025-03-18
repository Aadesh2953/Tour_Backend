import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: "dalwe3oj1", 
    api_key: "373472148518959", 
    api_secret: "vkmVtMjJOgNOe0uGQfFiZurpMDU" // Click 'View API Keys' above to copy your API secret
});
 async function uploadOnCloudinary(filePath) {
     const uploadResult = await cloudinary.uploader
       .upload(
        filePath
       )
       .catch((error) => {
           console.log(error);
       });
       return uploadResult.url;  
}
export {uploadOnCloudinary};