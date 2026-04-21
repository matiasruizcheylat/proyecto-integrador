import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import EmpleadosPage from "../pages/EmpleadosPage";
import EmpleadoCreatePage from "../pages/EmpleadoCreatePage";
import EmpleadoEditPage from "../pages/EmpleadoEditPage";
import ReportesPage from "../pages/ReportesPage";
import { useAuth } from "../hooks/useAuth";




const PrivateRoute = ({ children }: any) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/home" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

          <Route
          path="/empleados"
          element={
            <PrivateRoute>
              <EmpleadosPage/>
            </PrivateRoute>
          }
        />


      <Route
          path="/empleados/inactivos"
          element={
            <PrivateRoute>
              <EmpleadosPage />
            </PrivateRoute>
          }
        />


        <Route
          path="/empleados/nuevo"
          element={
            <PrivateRoute>
              <EmpleadoCreatePage />
            </PrivateRoute>
          }
        />

         <Route
          path="/empleados/editar/:id"
          element={
            <PrivateRoute>
              <EmpleadoEditPage />
            </PrivateRoute>
          }
        />


          <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ReportesPage />
            </PrivateRoute>
          }
        />



      </Routes>
    </BrowserRouter>
  );
}