import { useContext } from "react";
// import { Navigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AuthForm } from "./AuthForm";

export const Login = ({ onSubmit }) => {
  const currentUser = useContext(CurrentUserContext);

  return currentUser?.isLoggedIn ? 
  // (
 ( <AuthForm title="Вход" buttonLabel="Войти" onSubmit={onSubmit} />
    // <Navigate to="/" />
  ) : 
  (
    <AuthForm title="Вход" buttonLabel="Войти" onSubmit={onSubmit} />
  );
};
