import React, { useState, useEffect } from "react";
import { 
  // Routes, 
  Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
// import { PopupWithForm } from "./PopupWithForm";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { ImagePopup } from "./ImagePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
// import { ProtectedRoute } from "./ProtectedRoute";
// import { Login } from "./Login";
// import { Register } from "./Register";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.loadAllCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const handleCardDelete = (card) =>
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id != card._id));
      })
      .catch((err) => console.log(err));

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
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
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAvatarUpdate = ({ avatar }) =>
    api
      .setAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
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

  return (
    <div className="whole-page">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
        <Header />
          <Routes>
            <Route path="/sign-in" element={<Login onSubmit={handleLogin} />} />
            <Route path="/sign-up" element={<Register onSubmit={handleRegistration} />} />
            <Route
              path="/"
              element={
                
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardDelete={handleCardDelete}
                  onCardLike={handleCardLike}
                />
                // {" "}
              }
            />
          </Routes>

          <Footer />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handlePopupClose}
            onAvatarUpdate={handleAvatarUpdate}
            title="Редактировать профиль"
            name="profile"
          />
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
          <ImagePopup onClose={handlePopupClose} card={selectedCard} />{" "}
        </CurrentUserContext.Provider>{" "}
      </div>{" "}
    </div>
  );
}

export default App;
