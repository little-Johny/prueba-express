const express = require("express");

const UserController = require("../controllers/user.controller");
const UserRepository = require("../repositories/user.repository");
const authMiddleware = require("../middlewares/authMiddleware");
const TaskController = require("../controllers/task.controller");
const TaskRepository = require("../repositories/task.repository");

const router = express.Router();

const userRepository = new UserRepository();
const taskRepository = new TaskRepository();
const userController = new UserController(userRepository);
const taskController = new TaskController(taskRepository);

router.get("/", authMiddleware, userController.getAll);
router.get("/tasks", authMiddleware, taskController.getByUser);
router.get("/:id", authMiddleware, userController.getById);
router.patch("/:id", authMiddleware, userController.update);
router.delete("/:id", authMiddleware, userController.delete);

module.exports = router;
