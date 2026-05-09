import React from "react";
import style from "../Input/input.module.css";

// Adicionei name, value, onChange e required aqui
function Input({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
}) {
  return (
    <div className={style.inputContainer}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        name={name} // ESSENCIAL
        value={value} // ESSENCIAL
        onChange={onChange} // ESSENCIAL
        required={required}
      />
    </div>
  );
}
export default Input;
