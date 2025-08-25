import jwt from "jsonwebtoken";
import {DB} from '../config/db.js';
import TokenModel from '../models/TokenModel.js';

const Token = TokenModel(DB);

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {  // Используем userId, а не email
    const tokenData = await Token.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await Token.create({ userId, refreshToken });
  }
  async removeToken(refreshToken){
    const tokenData=await Token.destroy({where: { refreshToken }});
    return tokenData
  }
  async findToken(refreshToken){
    const tokenData=await Token.findOne({where: { refreshToken }});
    return tokenData
  }
  validateAccessToken(token){
    try{
      const userData=jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch(e){
      return null
    }
  }
   validateRefreshToken(token){
    try{
      const userData=jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch(e){
      return null
    }
  }
}

export default new TokenService;