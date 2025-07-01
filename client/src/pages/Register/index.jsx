import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useAuth } from "../../hooks/useContext";
import { useState } from "react";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {
      const response = await register(data);
      login(response.data.token);
      navigate('/dashboard');
      console.log("Registro exitoso");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setErrorMessage("Este correo ya está registrado.");
      } else {
        setErrorMessage("Error al registrar. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-base-200 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
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
          <span>{errorMessage || "Error al registrar"}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="form-control">
          <span className="label-text">Correo electrónico:</span>
          <input
            name="email"
            type="email"
            className="input input-bordered input-primary w-full"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Username:</span>
          <input
            name="username"
            type="text"
            className="input input-bordered input-primary w-full"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Contraseña:</span>
          <input
            name="password"
            type="password"
            className="input input-bordered input-primary w-full"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary w-full">
          Registrarse
        </button>
      </form>
    </div>
  );
}
