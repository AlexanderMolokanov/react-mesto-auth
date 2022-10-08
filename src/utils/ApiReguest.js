export class ApiReguest {
  constructor(url, headers) {
    this._url = url;
    this._headers = headers;
  }

  _renderPromise(promise) {
    return promise
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((obj) => {
        return obj;
      });
  }

  get(type) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "GET",
      headers: this._headers,
    });
    return this._renderPromise(promise);
  }

  post(type, item) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: item.name,
        link: item.link,
        image: item.image,
      }),
    });
    return this._renderPromise(promise);
  }

  postPass(type, item) {
    // console.log(item)
    const promise = fetch(`${this._url}/${type}`, {
      
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password: item.password,
        email: item.email,
      }),
    });
    return this._renderPromise(promise);
  }

  getMe(type) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "GET", 
      headers: this._headers, 
    });
    return this._renderPromise(promise);
  }

  checkAuth(type) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "GET",
      headers: { authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    return this._renderPromise(promise);
  }

  patch(type, keys) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(keys),
    });
    return this._renderPromise(promise);
  }

  delete(type) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "DELETE",
      headers: this._headers,
    });
    return this._renderPromise(promise);
  }

  put(type) {
    const promise = fetch(`${this._url}/${type}`, {
      method: "PUT",
      headers: this._headers,
    });
    return this._renderPromise(promise);
  }

  putDelete(type, hasMyLike) {
    const promise = fetch(`${this._url}/${type}`, {
      method: `${hasMyLike ? "DELETE" : "PUT"}`,
      headers: this._headers,
    });
    return this._renderPromise(promise);
  }
}
