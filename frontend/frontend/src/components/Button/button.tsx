import style from "../Button/button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

function Button({
  children,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={style.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;