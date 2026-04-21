import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/Card";
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

    try {
      const data = await loginService(form);
      login(data.access_token);
      //localStorage.setItem("access_token", data.access_token);
      navigate("/home");
    }catch {
  Swal.fire({
    icon: "error",
    title: "Error de autenticación",
    text: "Usuario o contraseña incorrectos",
    confirmButtonColor: "#4f46e5",
  });
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

    <button className="login-button">
      Ingresar
    </button>
  </form>
</div>
</MainLayout>
  );
}

const styles = {
  
  input: {
    width: "100%",
    maxWidth:"300px",
    padding: "10px 0px",
    margin:"10px auto",
    display:"block"
  },
  button: {
    width: "100%",
    maxWidth:"300px",
    padding: "10px 0px",
    background: "#4f46e5",
    color: "white",
    margin:"10px auto",
    border:"none",
    display:"block"
  },

};