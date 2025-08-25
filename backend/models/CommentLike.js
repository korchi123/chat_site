import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CommentLike = sequelize.define('CommentLike', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    
    indexes: [
      {
        unique: true,
        fields: ['userId', 'commentId']
      }
    ]
  });

  return CommentLike;
};