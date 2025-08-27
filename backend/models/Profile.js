import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    photo: {
      type: DataTypes.TEXT, // Путь к файлу или base64
      defaultValue: null,
      allowNull: true
    },
    photoFileId: { // Новое поле для хранения ID файла на Google Drive
      type: DataTypes.TEXT,
      defaultValue: null,
      allowNull: true
    },
    birthDate: {
      type: DataTypes.DATEONLY, // Только дата без времени
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT, // Для длинного текста
      allowNull: true
    },
    userId: { // Внешний ключ для связи
      type: DataTypes.INTEGER,
      unique: true, // Обеспечиваем связь один-к-одному
      allowNull: false
    }
  }, {
    timestamps: true // Добавляет createdAt и updatedAt
  });

  return Profile;
};