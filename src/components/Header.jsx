import React from "react";
import { useContext, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import logo from "../images/header_logo.svg";

function Header({ onLogoutClick }) {
  const currentUser = useContext(CurrentUserContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);
  // console.log(currentUser?.isLoggedIn);

  const logoutMobile = () => {
    onLogoutClick();
    setMenuIsOpen(false);
  };

  const Icons = () => (
    <button
      className={menuIsOpen ? "header__close-button" : "header__menu-button"}
      type="button"
      onClick={toggleMenu}
    />
  );

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип проекта" />

      <div
        className={
          menuIsOpen
            ? "header__burger-menu header__burger-menu_open"
            : "header__burger-menu"
        }
      >
        <span className="header__info header__info_mobile">
          {currentUser?.email}
        </span>

        <Link
          className="header__link header__link_mobile"
          onClick={logoutMobile}
          to="#"
        >
          ВыйтиB
        </Link>
      </div>

      <Switch>
        <Route path="/">
          <>
            <div className="header__info-wrapper">
              <div className="header__info">
                {currentUser?.email}
                <Link
                  className="header__link header__link_logout"
                  onClick={onLogoutClick}
                  to="#"
                >
                  ВыйтиЫ
                </Link>
              </div>
            </div>
            <Icons />
          </>
        </Route>

        <Route path="/sign-in">
          <>
            <Link className="header__link" to="/sign-up">
              Регистрация
            </Link>
          </>
        </Route>

        <Route path="/sign-up">
          <>
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          </>
        </Route>
      </Switch>
    </header>
  );
}
export default Header;
