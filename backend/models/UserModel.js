import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    nickname: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    isActivated:{type:DataTypes.BOOLEAN, defaultValue: false},
    activationLink:{type:DataTypes.STRING},
    deletionCode: {type: DataTypes.STRING},
    deletionCodeExpires: {type: DataTypes.DATE}
  });
  return User;
};