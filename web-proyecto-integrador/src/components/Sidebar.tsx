import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (path: string) => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>
        <hr />
      </h2>

      <nav style={styles.nav}>
        {/* Público */}
        <Link to="/home" style={styles.link}>
          🏠 Home
        </Link>

        {/* Protegidos */}
        <span
          style={token ? styles.link : styles.linkDisabled}
          onClick={() => handleProtectedClick("/empleados")}
        >
          👥 Empleados
        </span>

        <span
          style={token ? styles.link : styles.linkDisabled}
          onClick={() => handleProtectedClick("/empleados/inactivos")}
        >
          👥 Empleados Inactivos
        </span>

        <span
          style={token ? styles.link : styles.linkDisabled}
          onClick={() => handleProtectedClick("/empleados/nuevo")}
        >
          + Agregar
        </span>

        {/* Nuevo */}
        <span
          style={token ? styles.link : styles.linkDisabled}
          onClick={() => handleProtectedClick("/reportes")}
        >
          📊 Reportes
        </span>
      </nav>
    </aside>
  );
}


const styles = {
  sidebar: {
    width: "220px",
    height: "100%",
    background: "#1e1b4b",
    color: "white",
    padding: "20px 0px",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  linkDisabled: {
    color: "#9ca3af",
    padding: "10px",
    borderRadius: "6px",
    cursor: "not-allowed",
    opacity: 0.6,
  },
};