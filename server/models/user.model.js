class User {
  constructor({ id = null, username, email, password }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
  /**
 * Valida los campos del usuario.
 * @param {Object} options
 * @param {boolean} options.partial - Si se permite validación parcial.
 * @returns {boolean} - true si los datos son válidos.
 */
  isValid({ partial = false } = {}) {
  if (partial) {
    if (this.username !== undefined && typeof this.username !== 'string') return false;
    if (this.email !== undefined && (typeof this.email !== 'string' || !this.email.includes('@'))) return false;
    if (this.password !== undefined && (typeof this.password !== 'string' || this.password.length < 6)) return false;
    return true;
  }

  return (
    typeof this.username === 'string' &&
    this.username.trim() !== '' &&
    typeof this.email === 'string' &&
    this.email.includes('@') &&
    typeof this.password === 'string' &&
    this.password.length >= 6
  );
}


  isLoginValid() {
    return (
      typeof this.email === 'string' &&
      this.email.includes('@') &&
      typeof this.password === 'string' &&
      this.password.length >= 6
    );
  }
}

module.exports = User;