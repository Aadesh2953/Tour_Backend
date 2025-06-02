import multer from 'multer'
const  storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/temp')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
    
})
const allowedMimeTypes=[
    "image/png",
    "video/mp4",
    "video/mov",
    "video/quicktime", // for .mov sometimes
    "video/x-matroska", // .mkv
    "video/webm"]
const fileFilter=(req,file,cb)=>
{
    allowedMimeTypes.includes(file.mimetype)?cb(null,true):cb(null,false);
    
}
export const upload=multer({storage:storage,limits:{fileSize:5*1024*1024}});
