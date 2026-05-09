import React from "react";
import style from "./button.module.css";

function Button({ texto }) {
  return <button className={style.button}>{texto}</button>;
}

export default Button;
