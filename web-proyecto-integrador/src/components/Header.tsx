import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header({
  onMenuClick,
  isMobile,
}: {
  onMenuClick?: () => void;
  isMobile?: boolean;
}) {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleAuthAction = () => {
    if (token) {
      logout(); // usa tu hook (mejor que tocar localStorage directo)
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        {isMobile && (
          <button style={styles.menuBtn} onClick={onMenuClick}>
            ☰
          </button>
        )}
        <span>Sistema de Gestión de Empleados</span>
      </div>

      <button style={styles.authBtn} onClick={handleAuthAction}>
        {token ? "Logout" : "Login"}
      </button>
    </header>
  );
}
const styles = {
  header: {
    height: "60px",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    width: "100%",
    boxSizing: "border-box" as const,
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  menuBtn: {
    fontSize: "20px",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  authBtn: {
    background: "#22c55e", // verde por defecto (login)
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};