const Task = require("../models/task.model");

class TaskController {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getByUser = this.getByUser.bind(this);
    this.getByFilters = this.getByFilters.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req, res) {
    try {
      if (req.query) {
        this.getByFilters(req, res);
      }

      const tasks = await this.taskRepository.getAll();
      if (tasks.lenght === 0)
        return res.status(404).json({ message: "Not found" });
    } catch (error) {
      console.error("get all error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskRepository.getById(id);
      if (!task) res.status(404).json({ message: "Not found" });
      return res.status(200).json({
        data: task,
      });
    } catch (error) {
      console.error("get by id error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getByUser(req, res) {
    try {
      const { sub: id } = req.user;
      const filters = {
        search: req.query.search,
        sort: req.query.sort,
        order: req.query.order,
      };
      const tasks = await this.taskRepository.getByUser(id, filters);
      if (!tasks) return res.status(404).json({ message: "Not found" });
      return res.status(200).json({ data: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  async getByFilters(req, res) {
    try {
      const { query } = req;
      const tasks = await this.taskRepository.getByfilters(query);

      res.status(200).json({ data: tasks });
    } catch (error) {
      console.error("get by filters error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async create(req, res) {
    try {
      const task = new Task(req.body);
      const { sub: id } = req.user;
      task.user_id = id;

      if (!task.isValid()) return res.status(400).json({ message: "Bad data" });

      const newTask = await this.taskRepository.create(task);
      return res.status(200).json({
        data: newTask,
      });
    } catch (error) {
      console.error("create error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const changes = req.body;

      const updatedTask = await this.taskRepository.update(changes, id);
      if (!updatedTask)
        return res.status(404).json({ message: "Cannot updated" });

      return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      console.error("update error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.taskRepository.delete(id);
      return res.status(200).json({ message: "Successfully delete" });
    } catch (error) {
      console.error("delete error", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = TaskController;
