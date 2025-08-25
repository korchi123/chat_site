    import UserService from "../service/UserService.js"
    import { validationResult } from "express-validator"
    import ApiError from "../error/ApiError.js"

    class userController{
    async registration(req, res, next) {
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
    return next(ApiError.BadRequest('Ошибка при валидации'))
            }
    const {email, password, nickname}=req.body
    const userData=await UserService.registration(email, password, nickname)
    res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly:true, sameSite: 'none',
  secure: true,  // Обязательно для HTTPS
  domain: 'chat-site-qmju.onrender.com'  // Укажите правильный domain
  })
    return res.json(userData)
        } 
        catch (e){
            next(e)
    console.log(e)
        }
    }
    async activate(req,res,next){
    try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch(e) {
            console.log(e);
            next(e)
        }
    }
    async login(req,res,next){
    try {
        const {email, password}=req.body;
        const userData=await UserService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly:true, sameSite: 'none',
  secure: true,  // Обязательно для HTTPS
  domain: 'chat-site-qmju.onrender.com'  // Укажите правильный domain
  }) 
    return res.json(userData)
            
        } catch(e) {
            console.log(e);
            next(e)
        }
    }
    async logout(req,res,next){
    try {
            const{refreshToken}=req.cookies;
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch(e) {
            console.log(e);
            next(e)
        }
    }
    async refresh(req,res,next){
    try {
        const{refreshToken}=req.cookies;
         const userData=await UserService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly:true, sameSite: 'none',
  secure: true,  // Обязательно для HTTPS
  domain: 'chat-site-qmju.onrender.com'  // Укажите правильный domain
  }) 
    return res.json(userData)
            
        } catch(e) {
            console.log(e);
            next(e)
        }
    }
    
    async requestAccountDeletion(req, res, next) {
    try {
        const user = req.user;
        await UserService.sendDeletionCode(user.email);
        return res.json({ message: 'Код подтверждения отправлен на почту' });
    } catch(e) {
        next(e);
    }
}

async confirmAccountDeletion(req, res, next) {
    try {
        const { code } = req.body;
        const user = req.user;
        const result = await UserService.confirmAndDelete(user.email, code);
        if (!user || !user.email) {
            throw ApiError.UnauthorizedError();
        }
        // Очищаем куки, если пользователь был авторизован
        res.clearCookie('refreshToken');
        
        return res.json(result);
    } catch(e) {
        next(e);
    }
}
async resendActivation(req, res, next) {
    try {
        const { email } = req.body;
        
        if (!email) {
            throw ApiError.BadRequest('Email не указан');
        }
        
        const result = await UserService.resendActivation(email);
        return res.json(result);
    } catch (e) {
        next(e);
    }
}
    }
    export default new userController