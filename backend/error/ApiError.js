class ApiError extends Error {
    constructor(status, message, errors){
super();
this.status=status;
this.message=message
    }
    static BadRequest(message){
        return new ApiError(400, message)
    }
    static UnauthorizeError(){
        return new ApiError(401, 'Пользователь не авторизован')
    }
    static Forbidden(message){
        return new ApiError(403, message)
    }
     static NotFound(message){
        return new ApiError(404, message)
    }
    
}
export default ApiError