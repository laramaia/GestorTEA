import type { ReactNode, InputHTMLAttributes } from "react";
import style from "../Input/input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  imagePreviewUrl?: string;
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  className,
  ...rest
}: InputProps) {
  return (
    <div className={style.inputContainer}>
      <label htmlFor={name}>{label}</label>
      <div className={style.inputWrapper}>
        {icon && <span className={style.icon}>{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`${style.input} ${icon ? style.inputWithIcon : ""} ${className ?? ""}`}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
      </div>
    </div>
  );
}

export default Input;
