import { useState, useRef, useEffect } from "react";
import { PopupWithForm } from "./PopupWithForm";

export const EditAvatarPopup = ({ isOpen, onClose, onAvatarUpdate }) => {
  const avatarRef = useRef();

  const [isValidJob, setIsValidJob] = useState(true);
  const [errorsJob, setErrorsJob] = useState([]);


  useEffect(() => {
    if (isOpen) {
      avatarRef.current.value = "";
    }
  }, [isOpen]);

  const submitHandler = (e) => {
    e.preventDefault();
    onAvatarUpdate({
      avatar: avatarRef.current.value,
    });
  };

  const handleChange = (e) => {
    
    if (e.target.name === "avatarLink") {
      setIsValidJob(e.target.checkValidity());
      setErrorsJob(e.target.validationMessage);
    }
  };

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      buttonLabel="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
    >
      <div className="popup__input-wrapper">
        <input
          className="popup__input"
          name="avatarLink"
          placeholder="Ссылка на картинку"
          type="url"
          required
          ref={avatarRef}
          onChange={handleChange}
        />
        <span className={`popup__error avatar-link-error ${isValidJob ? '' : 'popup__error_state_visible'}`}>{errorsJob}</span>
      </div>
    </PopupWithForm>
  );
};
