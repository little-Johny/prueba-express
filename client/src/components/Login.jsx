import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useContext";
import { login as LoginRequest } from "./../api/auth";
import { useState } from "react";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await LoginRequest(data);
      const token = response.data.data.token;
      if (!token) {
        throw new Error('Token no recibido');
      }
      login(token);
      navigate("/dashboard");
      // alert('Inicio de sesion exitoso');
      console.log("Respuesta completa:", response);
      console.log("Token:", response?.data?.data?.token);
    } catch (error) {
      console.error(error);
      setErrorMessage("Credenciales invalidas");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-base-00 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      {errorMessage && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage || "Credenciales invalidas"}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="form-control">
          <span className="label-text">Correo electrónico</span>
          <input
            name="email"
            type="email"
            className="input input-bordered input-primary w-full"
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text">Contraseña</span>
          <input
            name="password"
            type="password"
            className="input input-bordered input-primary w-full"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary w-full">
          Ingresar
        </button>
        <p className="w-full flex flex-column gap-3 justify-center">
          No tienes cuenta?
          <a
            className="link link-primary"
            onClick={() => navigate("/register")}
          >
            Registrate
          </a>
        </p>
      </form>
    </div>
  );
}
