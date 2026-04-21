import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // detectar resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // cerrar sidebar si pasa a desktop
  useEffect(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  return (
    <div style={styles.container}>
      {/* 🔥 OVERLAY (click afuera) */}
      {isMobile && isOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebarWrapper,
          left: isMobile
            ? isOpen
              ? 0
              : "-220px"
            : "0",
        }}
      >
        <Sidebar onClose={() => setIsOpen(false)} />
      </div>

      {/* Main */}
      <div
        style={{
          ...styles.main,
           marginLeft: isMobile ? "0" : "220px",
        }}
      >
        <Header
  onMenuClick={() => setIsOpen(!isOpen)}
  isMobile={isMobile}
/>

        <div style={styles.content}>{children}</div>

        <Footer />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },

  sidebarWrapper: {
    position: "fixed" as const,
    top: 0,
    height: "100vh",
    width: "220px",
    transition: "0.3s",
    zIndex: 1000,
  },

  main: {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  minHeight: "100vh",
},

  content: {
    flex: 1,
    padding: "0px",
    background: "#f9fafb",
  },

  // 👇 CLAVE para cerrar haciendo click afuera
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    zIndex: 900,
  },
};