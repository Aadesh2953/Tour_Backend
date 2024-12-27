export default class ApiError extends Error{
    constructor(statusCode,message)
    {
        super(message)
        this.statusCode=statusCode
        this.status=this.statusCode
        this.isOpertional=true
        Error.captureStackTrace(this,this.constructor);
    }
}
