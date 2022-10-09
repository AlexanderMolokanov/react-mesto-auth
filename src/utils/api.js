import { ApiReguest } from "./ApiReguest.js";

export class Api {
  constructor(options) {
    this._options = options;
    this._resHandler = (res) =>
      res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
    this._baseUrl = options.baseUrl;
  }

  loadAllCards() {
    return this._options.get("cards");
  }

  deleteCard(id) {
    return this._options.delete(`cards/${id}`);
  }

  postCard(card) {
    return this._options.post("cards", card);
  }

  getUserInfo() {
    return this._options.get("users/me");
  }

  setUserInfo(data) {
    return this._options.patch("users/me", {
      name: data.name,
      about: data.about,
    });
  }

  getAvatar() {
    return this._options.get("users/me/avatar");
  }

  setAvatar(avatarLink) {
    return this._options.patch("users/me/avatar", {
      avatar: avatarLink,
    });
  }

  useLike(id) {
    return this._options.put(`cards/${id}/likes`);
  }

  removeLike(id) {
    return this._options.delete(`cards/${id}/likes`);
  }

  toggleLike(cardId, hasMyLike) {
    return this._options.putDelete(`cards/${cardId}/likes`, hasMyLike);
  }

  signup(singupPayload) {
    return this._options.postPass("signup", singupPayload);
  }

  signin(singupPayload) {
    return this._options.postPass("signin", singupPayload);
  }

  // Вернуть пользователя
  getMe() {
    return this._options.checkAuth("users/me");
  }
}

const request = new ApiReguest("https://nomoreparties.co/v1/cohort-42/", {
  authorization: "f94fe150-fc6f-49bf-839d-cc1279afa58f",
  "Content-Type": "application/json",
  Accept: "application/json: charset=utf-8",
});

const regRequest = new ApiReguest("https://auth.nomoreparties.co", {
  "Content-Type": "application/json",

  authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const api = new Api(request);

export const regApi = new Api(regRequest);
