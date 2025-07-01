const validPriority= ['low', 'medium', 'high'];

class Task {
  constructor({ id, user_id, title, description, due_date, priority, completed }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.description = description;
    this.due_date = due_date;
    this.priority = priority;
    this.completed = completed ?? false;
  }

  isValid({ partial = false } = {}) {

    if (partial) {
      if (this.user_id !== undefined && typeof this.user_id !== 'number') return false;
      if (this.title !== undefined && typeof this.title !== 'string') return false;
      if (this.description !== undefined && typeof this.description !== 'string') return false;
      if (this.due_date !== undefined && isNaN(Date.parse(this.due_date))) return false;
      if (this.priority !== undefined && (!validPriority.includes(this.priority))) return false;
      if (this.completed !== undefined && typeof this.completed !== 'boolean') return false;
      return true;
    }


    return (
      typeof this.user_id === 'number' &&
      typeof this.title === 'string' &&
      typeof this.description === 'string' &&
      !isNaN(Date.parse(this.due_date)) &&
      typeof this.priority === 'string' &&
      validPriority.includes(this.priority) &&
      typeof this.completed === 'boolean'
    );
  }
}

module.exports = Task;