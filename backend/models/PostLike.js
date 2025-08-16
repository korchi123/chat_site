import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PostLike = sequelize.define('PostLike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
      
    }
  }, {
    
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId']
      }
    ]
  });

  return PostLike;
};