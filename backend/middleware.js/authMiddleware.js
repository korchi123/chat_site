import ApiError from "../error/ApiError.js"
import TokenService from "../service/TokenService.js";

export default function(req, res, next){
    try{
        //1. Получаем токен из заголовков
        const authorizationHeader = req.headers.authorization;
         if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        // 2. Валидируем токен
        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        // 3. Добавляем данные пользователя в запрос
        req.user = userData;
        next();
    } catch(e){
        return next(ApiError.UnauthorizeError())
    }
}