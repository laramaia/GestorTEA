import type { ReactNode } from "react";
import style from "../../styles/input.module.css";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
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
          className={icon ? style.inputWithIcon : ""}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}
export default Input;
