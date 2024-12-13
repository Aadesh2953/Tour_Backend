export const apiErrorHandler=(err,req,res,next)=>
{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'Fail';
   if(err.name=='CastError')
   {
     handleDbError(err,res)
   }
    if(process.env.NODE_ENV=='development')
    {
      development(err,res);
      return
    }
    if(process.env.NODE_ENV=='production')
      {
        production(err,res);
      }
}
export const development=(err,res)=>
{
   
  return res.status(500).json({
    status:"Fail",
    message:err.message,
    stack:err.stackTrace 
  })
}
export const production=({message,status},res)=>
{
  
  return res.status(500).json({
    status,
    message,
  })
}
export const handleDbError=(err,res)=>
{
  
    res.status(500).json({
    status:err.status,
    message:"Something went wrong!!!"
   })
}