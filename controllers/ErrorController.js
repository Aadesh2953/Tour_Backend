export const apiErrorHandler=(err,req,res,next)=>
{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'Fail';
   if(err.name=='CastError')
   {
     handleDbError(err,res)
     return
   }
   
   if(err.name=='JsonWebTokenError')
   {
     handleJSONWebTokenError(err,res);
     return
   }
   if(err.name=='TokenExpiredError')
    {
      tokenExpiredError(err,res);
      return
    }
    if(process.env.NODE_ENV=='development')
    {
      development(err,res);
      return
    }
    if(process.env.NODE_ENV=='production')
      {
        production(err,res);
        return;
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
    status:err,
    message:"Something went wrong!!!"
   })
}
export const  handleJSONWebTokenError=(err,res)=>
{
  res.status(500).json({
    status:err.status,
    message:"Invalid Token!!!"
   })
}
export const tokenExpiredError=(err,res)=>
  {
    res.status(500).json({
      status:err.status,
      message:"TOKEN eXPIRED!!!"
     })
  }
;