import React, { useContext } from "react";
import "./App.css";
import Ingredients from "./components/Ingredients/Ingredients";
import Auth from "./components/Auth";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const authContext = useContext(AuthContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }
  return content;
};

export default App;
