export const apiErrorHandler=(err,req,res)=>
{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'Fail';
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })
}