import Usermodel from "../models/UserModel.js";
import TokenModel from "../models/TokenModel.js";
import ProfileModel from "../models/Profile.js";
import { Op } from 'sequelize'; // Добавьте этот импорт в начале файла
import bcrypt from 'bcrypt'
import TokenService from "./TokenService.js";
import user_dto from "../dtos/user_dto.js";
import {DB} from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import MailService from "./MailService.js";
import ApiError from "../error/ApiError.js";
const User = Usermodel(DB);
const Token = TokenModel(DB);
const Profile =ProfileModel(DB)

class UserService {
  async registration(email, password, nickname) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь ${email} уже зарегистрирован`);
    }
    const candidateByNickname = await User.findOne({ where: { nickname } });
        if (candidateByNickname) {
            throw ApiError.BadRequest(`Пользователь с ником ${nickname} уже существует`);
        }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink=uuidv4()
    const user = await User.create({ email, password: hashPassword, nickname, activationLink });
    const profile = await Profile.create({ userId: user.id })
    await MailService.sendActivationMail(
  email, 
  `${process.env.API_URL}/api/user/activate/${activationLink}` // Уберите # из ссылки
);
    const userDto = new user_dto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken); // Передаем userDto.id как userId
    return { ...tokens, user: userDto, profile };
  }
  async activate(activationLink){
    const user = await User.findOne({ where: { activationLink } })
    if (!user){
    throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    user.isActivated=true;
    await user.save()
      }
      async login(email, password){
          const candidate = await User.findOne({ where: { email } });
    if (!candidate){
    throw ApiError.BadRequest('Пользователь не найден')
    }
    const isPassEequal = await bcrypt.compare(password, candidate.password)
    if (!isPassEequal){
    throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = new user_dto(candidate);
        const tokens = TokenService.generateToken({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken); // Передаем userDto.id как userId
        return { ...tokens, user: userDto };
  }

  async logout(refreshToken){
    const token = await TokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken){
      if(!refreshToken){
        throw ApiError.UnauthorizeError()
      }
      const userData = TokenService.validateRefreshToken(refreshToken)
      const tokenFromDB=await TokenService.findToken(refreshToken)
      if(!userData||!tokenFromDB){
        throw ApiError.UnauthorizeError()
      }
      const user = await User.findOne({ where: { id: userData.id} });
      const userDto = new user_dto(user);
      const tokens = TokenService.generateToken({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken); // Передаем userDto.id как userId
      return { ...tokens, user: userDto };
    }
  
  async sendDeletionCode(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw ApiError.BadRequest('Пользователь не найден');
    }
    
    // Генерируем 6-значный код
    const deletionCode = Math.floor(100000 + Math.random() * 900000).toString();
    const deletionCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Код действует 15 минут
    
    // Сохраняем код в базе
    user.deletionCode = deletionCode;
    user.deletionCodeExpires = deletionCodeExpires;
    await user.save();
    
    // Отправляем письмо с кодом
    await MailService.sendDeletionCodeMail(
        email,
        deletionCode
    );
    
    return { message: 'Код подтверждения отправлен' };
}

async confirmAndDelete(email, code) {
    const user = await User.findOne({ 
        where: { 
            email,
            deletionCode: code,
            deletionCodeExpires: { [Op.gt]: new Date() } // Проверяем срок действия кода
        }
    });
    
    if (!user) {
        throw ApiError.BadRequest('Неверный код или срок его действия истек');
    }
    
    // Удаляем все refresh токены пользователя
    await Token.destroy({ where: { userId: user.id } });
    
    // Удаляем самого пользователя
    await user.destroy();
    
    return { message: 'Аккаунт успешно удален' };
}
async resendActivation(email) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
        throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    
    if (user.isActivated) {
        throw ApiError.BadRequest('Аккаунт уже активирован');
    }
    
    // Генерируем новую ссылку
    const newActivationLink = uuidv4();
    
    // Обновляем пользователя
    user.activationLink = newActivationLink;
    await user.save();
    
    // Отправляем письмо (используем ту же логику, что и при регистрации)
    await MailService.sendActivationMail(
        email, 
        `${process.env.API_URL}/api/user/activate/${newActivationLink}`
    );
    
    return { message: 'Письмо с активацией отправлено повторно' };
}
}

export default new UserService();