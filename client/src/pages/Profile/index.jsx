import React, { useEffect, useState } from "react";
import { profile } from "../../api/auth";
import { update } from "../../api/user";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({ username: "", email: "" });

  const getUserProfile = async () => {
    try {
      const response = await profile();
      setUser(response.data.data.user);
      setEditUser({
        username: response.data.data.user.username,
        email: response.data.data.user.email,
      });
    } catch (error) {
      console.error("Error al obtener el perfil del usuario", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(editUser, user.id);
      await getUserProfile(); // actualiza los datos mostrados
      document.getElementById("my_modal_5").close();
    } catch (err) {
      console.error("Error al actualizar el perfil", err);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  if (!user) {
    return <p className="text-center">Cargando perfil...</p>;
  }

  return (
    <div className="card card-side bg-base-100 shadow-sm p-4">
      <figure>
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          className="w-40 h-40 object-cover rounded-lg"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl">{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* MODAL */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Editar perfil</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="form-control">
              <span className="label-text">Username</span>
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text">Email</span>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("my_modal_5").close()}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
