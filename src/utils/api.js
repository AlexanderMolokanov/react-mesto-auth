import { ApiReguest } from "./ApiReguest.js";

export class Api {
  constructor(options) {
    this._options = options;
  }

  loadAllCards() {
    return this._options.get('cards');
  };

  deleteCard(id) {
    return this._options.delete(`cards/${id}`);
  };

  createCard(card) {
    return this._options.post('cards', card);
  };

  getUserInfo() {
    return this._options.get('users/me');
  };

  setUserInfo(data) {
    return this._options.patch('users/me', {
      name: data.name,
      about: data.about,
    });
  };

  getAvatar() {
    return this._options.get('users/me/avatar');
  };

  setAvatar(avatarData) {
    return this._options.patch('users/me/avatar', {
      avatar: avatarData.placeLink
    });
  };

  useLike(id) {
    return this._options.put(`cards/${id}/likes`);
  };

  removeLike(id) {
    return this._options.delete(`cards/${id}/likes`);
  };
}

 

const request = new ApiReguest('https://nomoreparties.co/v1/cohort-42/', {
    authorization: 'f94fe150-fc6f-49bf-839d-cc1279afa58f',
    'Content-Type': 'application/json',
    'Accept': 'application/json: charset=utf-8'
})  

export const api = new Api(request);

// export const api = new Api(request);


