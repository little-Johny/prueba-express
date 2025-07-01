import React, { useEffect, useState } from "react";
import { create, update } from "../api/task";

export default function TaskModal({
  id = "my_modal_3",
  editable = false,
  task = null,
  onSave = () => {},
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (editable && task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date?.slice(0, 10) || "",
        priority: task.priority || "medium",
      });
    }
  }, [editable, task]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Validación básica
    if (!form.title || !form.description || !form.due_date) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      if (!editable) {
        const res = await create(form);
        onSave(res.data || form);
      } else {
        const res = await update(form, task.id);
        onSave(res.data || form);
      }

      document.getElementById(id).close();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
        error.message ||
        "Error al registrar"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-full max-w-3xl h-[80vh] overflow-y-auto">
        {/* Botón cerrar */}
        <form method="dialog" className="absolute right-2 top-2">
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>

        <h3 className="text-2xl font-bold mb-4">
          {editable ? "Editar Tarea" : "Nueva Tarea"}
        </h3>

        {errorMessage && (
          <div role="alert" className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          <div className="form-control col-span-2">
            <label className="label font-semibold">Título:</label>
            <input
              type="text"
              name="title"
              className="input input-bordered w-full"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control col-span-2">
            <label className="label font-semibold">Descripción:</label>
            <input
              type="text"
              name="description"
              className="input input-bordered w-full"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Fecha de vencimiento:</label>
            <input
              type="date"
              name="due_date"
              className="input input-bordered"
              value={form.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Prioridad:</label>
            <select
              name="priority"
              className="select select-bordered"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {editable ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
