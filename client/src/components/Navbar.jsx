import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    navigate("/home"); // asegúrate que /login sea pública
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <button className="btn btn-ghost text-xl" onClick={() => navigate("/dashboard")}>
          To-do Create
        </button>
      </div>

      {/* Si estás en el dashboard: avatar con dropdown */}
      {location.pathname === "/dashboard" && (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Avatar"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={() => navigate("/profile")}>
                Perfil <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a onClick={onLogout}>Cerrar sesión</a>
            </li>
          </ul>
        </div>
      )}

      {/* Si estás en el perfil: botón volver */}
      {location.pathname === "/profile" && (
        <div className="btn btn-ghost btn-circle" onClick={() => navigate("/dashboard")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        </div>
      )}
    </div>
  );
}
