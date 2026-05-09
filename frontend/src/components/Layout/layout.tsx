import Sidebar from "../SideBar/sideBar";
import styles from "../../styles/layout.module.css";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}