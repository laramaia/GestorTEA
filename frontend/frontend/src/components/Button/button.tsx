import style from "../../styles/button.module.css";

interface ButtonProps {
  texto: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

function Button({ texto, type = "button", onClick }: ButtonProps) {
  return (
    <button className={style.button} type={type} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Button;