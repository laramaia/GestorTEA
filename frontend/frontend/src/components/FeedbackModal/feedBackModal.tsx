import styles from "./feedbackModal.module.css";

interface FeedbackModalProps {
  type: "success" | "error";
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function FeedbackModal({
  type,
  title,
  message,
  buttonText = "Concluído",
  onClose,
}: FeedbackModalProps) {
  const isSuccess = type === "success";

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div
          className={`${styles.iconCircle} ${
            isSuccess ? styles.iconSuccess : styles.iconError
          }`}
        >
          {isSuccess ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <button
          className={`${styles.button} ${
            isSuccess ? styles.buttonSuccess : styles.buttonError
          }`}
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
