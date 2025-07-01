const bcrypt = require("bcrypt");
const pool = require("../config/database");
const User = require("../models/user.model");

class UserRepository {
  async getAll() {
    const [rows] = await pool.query(`SELECT * FROM user`);
    return rows.map((row) => new User(row));
  }

  async getById(id) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE id = ?`, [id]);
    const user = rows[0];
    return user ? new User(user) : null;
  }

  async register(user) {
    if (!user.isValid()) return null;
    const { username, email, password } = user;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const [result] = await pool.query(
      `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );
    return new User({
      id: result.insertId,
      username: user.username,
      email: user.email,
    });
  }

  async login(email) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE email = ?`, [
      email,
    ]);
    const user = rows[0];
    return user ? new User(user) : null; // si no se encuentra sera undefined
  }

  async update(data, id) {
    const user = await this.getById(id);

    if (!user) return null;

    const updated = new User({
      id: user.id,
      username: data.username ?? user.username,
      email: data.email ?? user.email,
      password: user.password,
    });

    if (!updated.isValid({ partial: true })) return null;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updated)) {
      if (key !== "id") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE user SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.query(`DELETE FROM user WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = UserRepository;
