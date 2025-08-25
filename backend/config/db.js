import { Sequelize } from 'sequelize';
import 'dotenv/config';
import PostsModel from '../models/PostsModel.js'
import UserModel from '../models/UserModel.js';
import CommentModel from '../models/CommentsModel.js';
import PostLike from '../models/PostLike.js';
import CommentLike from '../models/CommentLike.js';
import Profile from '../models/Profile.js';
import TokenModel from '../models/TokenModel.js';
import association from '../models/association.js';
const DB = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,          // Требуем SSL
        rejectUnauthorized: false // Игнорируем самоподписанные сертификаты
      }
    },
    logging: true
  }
  
);
const models = {
  User: UserModel(DB),
  Post: PostsModel(DB),
  Token: TokenModel(DB),
  Comment: CommentModel(DB),
  PostLike: PostLike(DB),
  CommentLike: CommentLike(DB),
  Profile:Profile(DB)
  
};

association(DB)

export {DB, models};