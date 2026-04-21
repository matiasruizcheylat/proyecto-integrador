import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";

import "../styles/Home.css"

export default function Home() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/home");
  };

  return (
    <DashboardLayout>
      <div className="home-container">
      <div className="home-card">
        <h1>Bienvenido al sistema de gestión</h1>
        <p>
          Desde aquí podés administrar empleados, consultar información y
          realizar distintas acciones dentro del sistema.
        </p>
      </div>
      {!token ? (
        <div className="home-card warning">
          <p>
            🔐 Iniciá sesión para acceder a las funcionalidades del sistema.
          </p>
        </div>
        ):(
          <div className="home-card info">
            <p>✅ Ya estás logueado. Podés usar todas las funcionalidades.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}