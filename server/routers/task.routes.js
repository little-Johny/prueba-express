const express = require("express");

const TaskRepository = require("../repositories/task.repository");
const TaskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const taskRepository = new TaskRepository();
const taskController = new TaskController(taskRepository);

router.get("/", taskController.getAll);
router.get("/:id", authMiddleware, taskController.getById);
router.post("/", authMiddleware, taskController.create);
router.patch("/update/:id", authMiddleware, taskController.update);
router.delete("/:id", authMiddleware, taskController.delete);

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "El servidor está funcionando correctamente",
  });
});

module.exports = router;
