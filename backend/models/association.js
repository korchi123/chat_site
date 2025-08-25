export default (sequelize) => {
  const { User, Post, Token, Comment, PostLike, CommentLike, Profile } = sequelize.models;

  // Связи пользователя
  User.hasMany(Post, { foreignKey: 'userId'});
  Post.belongsTo(User, { foreignKey: 'userId'});

  User.hasMany(Comment, { foreignKey: 'userId' });
  Comment.belongsTo(User, { foreignKey: 'userId' });
  
  User.hasMany(Token, { foreignKey: 'userId' });
  Token.belongsTo(User, { foreignKey: 'userId' });

  User.hasOne(Profile, { foreignKey: 'userId' });
  Profile.belongsTo(User, { foreignKey: 'userId' });

  // Связи поста
  Post.hasMany(Comment, { foreignKey: 'postId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  
    // Связи пользователя
  User.hasMany(PostLike, { foreignKey: 'userId' });
  PostLike.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(CommentLike, { foreignKey: 'userId' });
  CommentLike.belongsTo(User, { foreignKey: 'userId' });

  // Связи поста
  Post.hasMany(PostLike, { foreignKey: 'postId' });
  PostLike.belongsTo(Post, { foreignKey: 'postId' });

  // Связи комментария
  Comment.hasMany(CommentLike, { foreignKey: 'commentId' });
  CommentLike.belongsTo(Comment, { foreignKey: 'commentId' });
};