export default class Userdto {
  email;
  id;
  isActivated;
  nickname
  
  constructor(model) {
    this.email = model.email;
    this.id = model.id;  // Это значение передается как userId в TokenService
    this.isActivated = model.isActivated;
    this.nickname=model.nickname
  }
}