export default class ApiError extends Error{
    constructor(statusCode,message)
    {
        super(message)
        this.statusCode=statusCode
        this.status=this.statusCode?.startsWith('4')?'Error':'Fail'
        this.isOpertional=true
        Error.captureStackTrace(this,this.constructor);
    }
}
