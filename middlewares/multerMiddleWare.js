import multer from 'multer'
const  storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/temp')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname+'tour')
    },
    
})
export const upload=multer({storage,limits:{fileSize:5*1024*1024}});
