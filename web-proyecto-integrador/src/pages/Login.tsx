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

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  console.log("SUBMIT");

  try {
    const data = await loginService(form);
    console.log("LOGIN OK:", data);

    login(data.access_token);
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
  }
};

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

<button type="submit" className="login-button">
  Ingresar
</button>
  </form>
</div>
</MainLayout>
  );
}

