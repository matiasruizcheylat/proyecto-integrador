import { createContext, useEffect, useState } from "react";
 import Swal from "sweetalert2"; // opcional

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar token al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // 🔥 🔥 NUEVO: control de inactividad
  useEffect(() => {
    if (!token) return;

    let timer: any;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        logout();

        // opcional lindo:
         Swal.fire({
           icon: "warning",
           title: "Sesión expirada",
           text: "Inactividad detectada",
         });

      }, 15* 60 * 1000); // ⏳ 15 minutos 
    };

    const events = ["mousemove", "keydown", "click"];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // iniciar

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    };
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};