import { useEffect, useState } from "react";
import TaskModal from "../../components/TaskModal";
import { getByUser } from "../../api/user";
import { remove, update } from "../../api/task";

export default function Dashboard() {
  const [search, setSearch] = useState("");
/*   const [completed, setCompleted] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState(""); */
  const [sort, setSort] = useState("due_date");
  const [order, setOrder] = useState("ASC");
  const [tasks, setTasks] = useState([]);
  const [isEditableModal, setIsEditableModal] = useState(false);
  const [task, setTask] = useState(null);

  const reloadTasks = async () => {
    try {
      const response = await getByUser({
        search,
        /* completed,
        priority,
        due_date: dueDate, */
        sort,
        order,
      });

      setTasks(response.data.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  useEffect(() => {
    reloadTasks(); // al montar
  }, [search]);

  const deleteTask = async (id) => {
    try {
      await remove(id);
      await reloadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (id, status) => {
    try {
      await update({ completed: !status }, id);
      await reloadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getByUser();
        const tasks = response.data.data;
        setTasks(tasks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="w-full h-full flex flex-col flex-grow p-6 bg-base-200 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Mi Lista de Tareas</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          reloadTasks();
        }}
        className="flex flex-wrap gap-4 mb-6 items-end"
      >
        <input
          type="text"
          placeholder="Buscar tareas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1"
        />

        {/* <select
          value={completed}
          onChange={(e) => setCompleted(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Todas</option>
          <option value="true">Completadas</option>
          <option value="false">Pendientes</option>
        </select> */}

        {/* <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select> */}

        {/* <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input input-bordered"
        /> */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-bordered"
        >
          <option value="due_date">Fecha</option>
          <option value="priority">Prioridad</option>
          <option value="title">Título</option>
          <option value="completed">Estado</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="select select-bordered"
        >
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <section className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No hay tareas aún.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                task.completed ? "bg-green-100" : "bg-base-100"
              }`}
            >
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-black" : ""
                }`}
              >
                {task.title}
              </span>
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-black" : ""
                }`}
              >
                {task.due_date.slice(0, 10)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(task.id, task.completed)}
                  className={`btn btn-sm ${
                    task.completed ? "btn-warning" : "btn-success"
                  }`}
                >
                  {task.completed ? "❌" : "✔"}
                </button>
                <button
                  onClick={() => {
                    setIsEditableModal(true);
                    setTask(task);
                    document.getElementById("my_modal_3").showModal();
                  }}
                  className="btn btn-sm btn-primary"
                >
                  editar
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btn-sm btn-error"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
        <div className=" w-full flex justify-center">
          <button
            className="btn btn-success rounded-full"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            add
          </button>
        </div>
      </section>
      <TaskModal
        id="my_modal_3"
        editable={isEditableModal}
        task={task}
        onSave={async (tareaGuardada) => {
          if (isEditableModal) {
            setTasks((prev) =>
              prev.map((t) => (t.id === tareaGuardada.id ? tareaGuardada : t))
            );
          } else {
            setTasks((prev) => [...prev, tareaGuardada]);
          }
          await reloadTasks();
          setIsEditableModal(false);
          setTask(null);
        }}
      />
    </div>
  );
}
