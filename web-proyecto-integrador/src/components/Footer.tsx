export default function Footer() {
  return (
    <footer style={styles.footer}>
      © 2026 - Mi App | Todos los derechos reservados
    </footer>
  );
}

const styles = {
  footer: {
    height: "50px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
};