import styles from "../../styles/sideBar.module.css";

interface Props {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({ icon, label, active, onClick }: Props) {
  return (
    <div
      className={`${styles.item} ${active ? styles.active : ""}`}
            onClick={onClick}

    >
      <span className={styles.icon}>{icon}</span>
      {label}
    </div>
  );
}