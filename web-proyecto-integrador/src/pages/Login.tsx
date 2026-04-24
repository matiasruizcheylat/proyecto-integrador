import { useState} from "react";
import type {ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth"; 
import "../styles/global.css";
import "../styles/Login.css";
import MainLayout from "../layouts/MainLayout";
import Swal from "sweetalert2";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();


  try {
     setLoading(true);
    const data = await loginService(form);

    login(data.access_token);
    await new Promise(resolve => setTimeout(resolve, 5000));
    navigate("/home");
    
  } catch (error: any) {
    console.log("ERROR REAL:", error);

    if (error.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Usuario o contraseña inválidos",
        confirmButtonColor: "#4f46e5",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Mirá la consola",
      });
    }
  }finally{
     setLoading(false);
  }
};

if (loading) {
  return (
    <MainLayout>
      <div className="loading-screen">
        <div className="loading-spinner"></div>

        <h2 className="loading-title">
          Despertando servidor...
        </h2>

        <p className="loading-text">
          Validando credenciales.<br />
          Esto puede tardar entre 30 segundos y 2 minutos.
        </p>
      </div>
    </MainLayout>
  );
}

  return (<MainLayout>
    <div className="login-container">
  <h2 className="login-title">Iniciar sesión</h2>

  <form onSubmit={handleSubmit} className="login-form">
    <input
      className="login-input"
      name="username"
      placeholder="Usuario"
      onChange={handleChange}
    />

    <input
      className="login-input"
      type="password"
      name="password"
      placeholder="Contraseña"
      onChange={handleChange}
    />


<button type="submit" className="login-button" disabled={loading}>
  {loading ? "Ingresando..." : "Ingresar"}
</button>
  </form>
</div>
</MainLayout>
  );
}

