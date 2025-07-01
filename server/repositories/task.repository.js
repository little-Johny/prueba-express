const pool = require("../config/database");
const Task = require("../models/task.model");

class TaskRepository {
  async getAll() {
    const [rows] = await pool.query(`SELECT * FROM task`);
    return rows.map((row) => new Task(row));
  }

  async getById(id) {
    const [rows] = await pool.query(`SELECT * FROM task WHERE  id = ?`, [id]);
    const task = rows[0];
    return task ? new Task(task) : null;
  }

  async getByUser(
    user_id,
    { search, sort, order, priority, due_date, completed } = {}
  ) {
    // Verificar existencia del usuario (opcional)
    const [userRows] = await pool.query(`SELECT 1 FROM user WHERE id = ?`, [
      user_id,
    ]);
    if (userRows.length === 0) return null;

    // Consulta base
    let query = `SELECT * FROM task WHERE user_id = ?`;
    const params = [user_id];

    // Filtro por búsqueda (search)
    if (search) {
      query += ` AND title LIKE ?`;
      params.push(`%${search}%`);
    }

    // Filtro por prioridad exacta
    if (priority && ["low", "medium", "high"].includes(priority)) {
      query += ` AND priority = ?`;
      params.push(priority);
    }

    // Filtro por fecha exacta
    if (due_date) {
      query += ` AND DATE(due_date) = ?`;
      params.push(due_date);
    }

    // Filtro por estado
    if (completed === "true" || completed === "false") {
      query += ` AND completed = ?`;
      params.push(completed === "true");
    }

    // Ordenamiento
    const validSortFields = ["title", "due_date", "priority", "completed"];
    const validOrderFields = ["ASC", "DESC"];
    if (
      sort &&
      validSortFields.includes(sort) &&
      order &&
      validOrderFields.includes(order)
    ) {
      query += ` ORDER BY ${sort} ${order}`;
    } else {
      query += ` ORDER BY priority`; // predeterminado
    }

    // Ejecutar consulta
    const [rows] = await pool.query(query, params);
    return rows.length ? rows.map((row) => new Task(row)) : [];
  }

  async getByfilters({ sort, search, order }) {
    let query = "SELECT * FROM task ";
    const filters = [];

    if (search) {
      query += `WHERE title LIKE ?`;
      filters.push(`%${search}%`);
    }
    const validSortFields = ["title", "due_date", "priority", "completed"];
    const validOrderFields = ["ASC", "DESC"];
    if (
      (sort && validSortFields.includes(sort)) ||
      validOrderFields.includes(order)
    ) {
      query += ` ORDER BY ${sort} ${order}`;
    }
    const [rows] = await pool.query(query, filters);
    return rows.map((row) => new Task(row));
  }

  async create(task) {
    const { user_id, title, description, due_date, priority, completed } = task;
    const user = await pool.query(`SELECT * FROM user WHERE id = ?`, [user_id]);
    if (!user) return null;
    const [result] = await pool.query(
      `INSERT INTO task (user_id, title, description, due_date, priority, completed) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, due_date, priority, completed]
    );
    return new Task({
      id: result.id,
      user_id: task.user_id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      priority: task.priority,
      completed: task.completed,
    });
  }

  async update(data, id) {
    const task = await this.getById(id);

    if (!task) return null;

    const updated = new Task({ ...task, ...data });
    /*     if(!updated.isValid({ partial: true })) return null;
     */
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updated)) {
      if (key !== "id" && key !== "user_id") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE task SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.query(`DELETE FROM task WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TaskRepository;
