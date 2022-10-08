import React, { useState, useEffect } from "react";
import {
  // Routes,
  Route,
  Switch,
  useHistory, 
  // Redirect,
  // ProtectedRoute,
  // useNavigate
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { ImagePopup } from "./ImagePopup";
import { api, regApi } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./Login";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";

function App() {
  // Состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ isLoggedIn: false });
  const [cards, setCards] = useState([]);
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);

  // юзэффекты
  useEffect(() => {
    if (currentUser.isLoggedIn) {
      Promise.all([api.getUserInfo(), api.loadAllCards()])
        .then(([user, cards]) => {
          setCurrentUser((prev) => {
            console.log(currentUser)
            console.log(`isLoggedIn = ${currentUser.isLoggedIn} !!!!!`);
            return { ...prev, ...user };
          })
          setCards(cards);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentUser.isLoggedIn]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    // console.log(jwt);
    if (jwt) {
      regApi
        .getMe()
        .then((res) => {
          setCurrentUser((prev) => {
            // console.log(prev)
            return { ...prev, ...res.data, isLoggedIn: true };
          });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  // хуки
  // const navigate = useNavigate();
  const history = useHistory();

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) =>
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        )
      )
      .catch((err) => console.log(err));
  };

  const handleRegistration = (signupPayload) => {
    // console.log(signupPayload)
    regApi.signup(signupPayload).then(handleSuccess).catch(handleError);
  };

  const onLogin = (loginPayload) =>
    regApi
      .signin(loginPayload)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        currentUser.isLoggedIn = true;
        currentUser.email = loginPayload.email;
        // navigate("/");
        history.push('/');
      })
      .catch(handleError);

  const onSignOut = () => {
    localStorage.removeItem("jwt");
    console.log(currentUser.isLoggedIn)
    setCurrentUser({ isLoggedIn: false });
    // navigate("/sign-in");
    history.push('/sign-in');
  };

  const handleError = () => setErrorPopupOpen(true);
  const handleSuccess = () => setSuccessPopupOpen(true);

  const handleCardDelete = (card) =>
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
    setErrorPopupOpen(false);
    setSuccessPopupOpen(false);
  };

  const handlePopupClose = (e) => {
    if (
      e.type === "keydown" ||
      e.target.classList.contains("popup_opened") ||
      e.target.classList.contains("popup__button-close")
    ) {
      closeAllPopups();
    }
  };

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
    } else {
      document.removeEventListener("keydown", closeByEscape);
    }
  }, [isOpen]);

  const handleUserUpdate = (user) =>
    api
      .setUserInfo(user)
      .then((res) => {
        setCurrentUser(res);
        console.log(currentUser.isLoggedIn)
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAvatarUpdate = ({ avatar }) =>
    api
      .setAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        console.log(currentUser.isLoggedIn)
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAddPlaceSubmit = (cardPayload) =>
    api
      .postCard(cardPayload)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleSuccessPopupClose = (e) => {
    closeAllPopups(e);
    // navigate("/sign-in");
    history.push('/sign-in');
    
  };

  return (
    <div className="whole-page">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header onLogoutClick={onSignOut} />
          <Switch>
            <Route path="/sign-in">
              <Login onSubmit={onLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onSubmit={handleRegistration} />
            </Route>
            <ProtectedRoute
              path="/"
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
            ></ProtectedRoute>
          </Switch>
          <Footer />
          
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={handlePopupClose}
            onUserUpdate={handleUserUpdate}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handlePopupClose}
            onAddCard={handleAddPlaceSubmit}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handlePopupClose}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <ImagePopup onClose={handlePopupClose} card={selectedCard} />

          <InfoTooltip
            onClose={handleSuccessPopupClose}
            isOpen={isSuccessPopupOpen}
          >
            <div className="popup__info-box popup__info-box_success"></div>
            <h2 className="popup__info-title">
              Вы успешно зарегистрировались!
            </h2>
          </InfoTooltip>

          <InfoTooltip onClose={handlePopupClose} isOpen={isErrorPopupOpen}>
            <div className="popup__info-box popup__info-box_error"></div>
            <h2 className="popup__info-title">
              Что-то пошло не так! Попробуйте ещё раз.
            </h2>
          </InfoTooltip>

        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
